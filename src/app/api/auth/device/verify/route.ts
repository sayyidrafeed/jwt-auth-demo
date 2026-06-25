import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, devices, refreshTokens } from "@/db/schema";
import { verifyToken, signAccessToken, signRefreshToken, hashToken, type PreAuthTokenPayload, type ChallengeTokenPayload } from "@/lib/jwt";
import { verifyDeviceSignature } from "@/lib/device-crypto";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const preAuthToken = cookieStore.get("pre_auth_token")?.value;
    const challengeToken = cookieStore.get("challenge_token")?.value;

    if (!preAuthToken || !challengeToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Missing authentication step credentials." },
        { status: 401 }
      );
    }

    // Verify Pre-Auth Token
    const preAuthPayload = await verifyToken<PreAuthTokenPayload>(preAuthToken);
    if (!preAuthPayload || !preAuthPayload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid or expired pre-authentication session." },
        { status: 401 }
      );
    }

    // Verify Challenge Token
    const challengePayload = await verifyToken<ChallengeTokenPayload>(challengeToken);
    if (!challengePayload || !challengePayload.nonce || challengePayload.userId !== preAuthPayload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid or expired challenge session." },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { signature, timestamp } = body as { signature?: string; timestamp?: number };

    if (!signature || typeof signature !== "string" || !timestamp || typeof timestamp !== "number") {
      return NextResponse.json(
        { success: false, message: "Signature and timestamp are required" },
        { status: 400 }
      );
    }

    // Clock skew / replay attack verification: ±30 seconds window tolerance
    const now = Date.now();
    if (Math.abs(now - timestamp) > 30 * 1000) {
      return NextResponse.json(
        { success: false, message: "Request verification failed. Invalid challenge timestamp (possible replay)." },
        { status: 400 }
      );
    }

    // Fetch active device public key for the user
    const activeDeviceList = await db
      .select()
      .from(devices)
      .where(and(eq(devices.userId, preAuthPayload.userId), eq(devices.isActive, true)))
      .limit(1);

    const activeDevice = activeDeviceList[0];
    if (!activeDevice) {
      return NextResponse.json(
        { success: false, message: "No active trusted device found. Registration required." },
        { status: 400 }
      );
    }

    // Verify ECDSA signature of `${nonce}:${timestamp}`
    const isSignatureValid = await verifyDeviceSignature(
      activeDevice.publicKey,
      challengePayload.nonce,
      timestamp,
      signature
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, message: "Device signature verification failed" },
        { status: 401 }
      );
    }

    // Load user info for roles/claims
    const userList = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, preAuthPayload.userId))
      .limit(1);

    const user = userList[0];
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Update lastSeen for the device
    await db
      .update(devices)
      .set({ lastSeen: new Date(), updatedAt: new Date() })
      .where(eq(devices.id, activeDevice.id));

    // Sign final session access token and refresh token containing device bindings
    const { token: accessToken } = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId: activeDevice.id,
      sessionVersion: activeDevice.sessionVersion,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
      deviceId: activeDevice.id,
      sessionVersion: activeDevice.sessionVersion,
    });

    // Hash and store the refresh token
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Clean up temporary cookies
    cookieStore.delete("pre_auth_token");
    cookieStore.delete("challenge_token");

    // Set new session cookies
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Device authenticated and signed in successfully",
    });
  } catch (error) {
    console.error("Device verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
