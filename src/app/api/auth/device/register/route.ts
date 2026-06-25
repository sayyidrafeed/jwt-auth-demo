import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, devices, refreshTokens } from "@/db/schema";
import { verifyToken, signAccessToken, signRefreshToken, hashToken, type PreAuthTokenPayload } from "@/lib/jwt";
import { eq, and } from "drizzle-orm";
import { webcrypto } from "crypto";

export async function POST(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const preAuthToken = cookieStore.get("pre_auth_token")?.value;

    if (!preAuthToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Missing pre-authentication session." },
        { status: 401 }
      );
    }

    const payload = await verifyToken<PreAuthTokenPayload>(preAuthToken);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid or expired pre-authentication session." },
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

    const { publicKey, deviceName } = body as { publicKey?: string; deviceName?: string };

    if (!publicKey || typeof publicKey !== "string") {
      return NextResponse.json(
        { success: false, message: "Public key is required" },
        { status: 400 }
      );
    }

    // Validate public key format by attempting to import it
    try {
      const rawPublicKey = Buffer.from(publicKey, "base64");
      await webcrypto.subtle.importKey(
        "spki",
        rawPublicKey,
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        false,
        ["verify"]
      );
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid public key format. Must be a valid SPKI ECDSA P-256 key." },
        { status: 400 }
      );
    }

    // Verify user exists
    const userList = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    const user = userList[0];
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Check if an active device already exists.
    const activeDeviceList = await db
      .select()
      .from(devices)
      .where(and(eq(devices.userId, user.id), eq(devices.isActive, true)))
      .limit(1);

    if (activeDeviceList.length > 0) {
      return NextResponse.json(
        { success: false, message: "An active device is already registered. Device replacement activation is required." },
        { status: 400 }
      );
    }

    // Create device entry
    const newDeviceList = await db
      .insert(devices)
      .values({
        userId: user.id,
        publicKey,
        deviceName: deviceName || "Trusted Browser Device",
        isActive: true,
        sessionVersion: 1,
      })
      .returning();

    const device = newDeviceList[0];
    if (!device) {
      return NextResponse.json(
        { success: false, message: "Failed to register device" },
        { status: 505 }
      );
    }

    // Sign access and refresh tokens including device binding
    const { token: accessToken } = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId: device.id,
      sessionVersion: device.sessionVersion,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
      deviceId: device.id,
      sessionVersion: device.sessionVersion,
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

    // Clean up pre-auth token cookie
    cookieStore.delete("pre_auth_token");

    // Set HTTP-only cookies
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
      message: "Device registered and signed in successfully",
    });
  } catch (error) {
    console.error("Device registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
