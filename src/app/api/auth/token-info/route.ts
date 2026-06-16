import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    let accessTokenData = null;
    if (accessToken) {
      try {
        const header = jose.decodeProtectedHeader(accessToken);
        const payload = jose.decodeJwt(accessToken);
        const parts = accessToken.split(".");
        accessTokenData = {
          raw: accessToken,
          header,
          payload,
          signature: parts[2] ?? null,
        };
      } catch {
        accessTokenData = null;
      }
    }

    let refreshTokenData = null;
    if (refreshToken) {
      try {
        const payload = jose.decodeJwt(refreshToken);
        const parts = refreshToken.split(".");
        refreshTokenData = {
          raw: refreshToken,
          payload,
          signature: parts[2] ?? null,
        };
      } catch {
        refreshTokenData = null;
      }
    }

    return NextResponse.json({
      accessToken: accessTokenData,
      refreshToken: refreshTokenData,
    });
  } catch (error) {
    console.error("Token info error:", error);
    return NextResponse.json(
      { accessToken: null, refreshToken: null },
      { status: 500 }
    );
  }
}
