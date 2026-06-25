import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { refreshTokens, users } from "@/db/schema";
import { verifyToken, signAccessToken, signRefreshToken, hashToken, type RefreshTokenPayload } from "@/lib/jwt";
import { eq } from "drizzle-orm";

export async function POST(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get("refresh_token")?.value;

    if (!oldRefreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token provided" },
        { status: 401 }
      );
    }

    // Verify token validity
    const payload = await verifyToken<RefreshTokenPayload>(oldRefreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Hash the token for DB lookup
    const oldTokenHash = await hashToken(oldRefreshToken);

    // Fetch the token from DB
    const dbTokenList = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, oldTokenHash))
      .limit(1);

    const dbToken = dbTokenList[0];

    if (!dbToken || dbToken.expiresAt < new Date()) {
      if (dbToken) {
        await db.delete(refreshTokens).where(eq(refreshTokens.id, dbToken.id));
      }
      return NextResponse.json(
        {
          success: false,
          message: dbToken
            ? "Session expired."
            : "Session invalidated. You may have been logged out because another device signed in.",
        },
        { status: 401 }
      );
    }

    // Fetch user details for the new access token
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

    // Create new tokens
    const { token: newAccessToken } = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = await signRefreshToken({
      userId: user.id,
    });

    const newTokenHash = await hashToken(newRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    // Execute rotation in a transaction
    await db.transaction(async (tx) => {
      await tx.delete(refreshTokens).where(eq(refreshTokens.id, dbToken.id));
      await tx.insert(refreshTokens).values({
        userId: user.id,
        tokenHash: newTokenHash,
        deviceName: dbToken.deviceName,
        ipAddress: dbToken.ipAddress,
        expiresAt,
      });
    });

    // Update cookies
    cookieStore.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    cookieStore.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
