import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, refreshTokens } from "@/db/schema";
import { comparePassword } from "@/lib/password";
import { signAccessToken, signRefreshToken, hashToken } from "@/lib/jwt";
import { eq } from "drizzle-orm";

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body as Record<string, string>;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in DB
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

    // Compare passwords
    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign Access Token and Refresh Token
    const { token: accessToken } = await signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
    });

    // Hash and store the refresh token
    const tokenHash = await hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Set HTTP-only cookies
    const cookieStore = await cookies();
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
