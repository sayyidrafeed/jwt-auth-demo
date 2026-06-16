import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { refreshTokens, revokedTokens } from "@/db/schema";
import { verifyToken, hashToken, type AccessTokenPayload } from "@/lib/jwt";
import { eq } from "drizzle-orm";

export async function POST(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // Optional access token blacklisting
    if (accessToken && process.env.ENABLE_TOKEN_BLACKLIST === "true") {
      const payload = await verifyToken<AccessTokenPayload>(accessToken);
      if (payload) {
        const expiresAt = new Date((payload.exp || 0) * 1000);
        await db
          .insert(revokedTokens)
          .values({
            jti: payload.jti,
            expiresAt,
          })
          .onConflictDoNothing();
      }
    }

    // Revoke and delete the refresh token from database
    if (refreshToken) {
      const tokenHash = await hashToken(refreshToken);
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.tokenHash, tokenHash));
    }

    // Delete cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
