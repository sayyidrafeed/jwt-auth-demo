import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, refreshTokens } from "@/db/schema";
import { comparePassword } from "@/lib/password";
import { signAccessToken, signRefreshToken, hashToken } from "@/lib/jwt";
import { eq, and, gte } from "drizzle-orm";
import { getDeviceInfo, parseUserAgent } from "@/lib/user-agent";

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password, force } = body as Record<string, unknown>;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    const user = userList[0];
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const existingSessions = await db
      .select({
        deviceName: refreshTokens.deviceName,
        ipAddress: refreshTokens.ipAddress,
        createdAt: refreshTokens.createdAt,
      })
      .from(refreshTokens)
      .where(and(eq(refreshTokens.userId, user.id), gte(refreshTokens.expiresAt, new Date())));

    if (existingSessions.length > 0 && force !== true) {
      const session = existingSessions[0]!;
      return NextResponse.json({
        conflict: true,
        existingSession: {
          device: session.deviceName ? parseUserAgent(session.deviceName) : "Unknown Device",
          ip: session.ipAddress || "Unknown IP",
          since: session.createdAt?.toISOString() || null,
        },
        message: "You are already logged in on another device.",
      });
    }

    if (force === true) {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.id));
    }

    const { token: accessToken } = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
    });

    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { deviceName, ipAddress } = getDeviceInfo(request);

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash,
      deviceName,
      ipAddress,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Sign-in successful",
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
