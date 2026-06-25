import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretjwtkeythatmustbe32byteslongormore!"
);

interface AccessTokenPayload extends jose.JWTPayload {
  userId: string;
  email: string;
  role: string;
  jti: string;
  deviceId: string;
  sessionVersion: number;
}

export async function proxy(request: NextRequest): Promise<Response> {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/tokens");
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const accessToken = request.cookies.get("access_token")?.value;

  let isAccessTokenValid = false;
  let payload: AccessTokenPayload | null = null;

  if (accessToken) {
    try {
      const { payload: verified } = await jose.jwtVerify(accessToken, secret);
      payload = verified as AccessTokenPayload;
      if (payload?.deviceId && typeof payload?.sessionVersion === "number") {
        isAccessTokenValid = true;
      }

      // Check token blacklist via subrequest if enabled
      if (isAccessTokenValid && process.env.ENABLE_TOKEN_BLACKLIST === "true" && payload?.jti) {
        const verifyUrl = new URL(`/api/auth/verify-blacklist?jti=${payload.jti}`, request.url);
        const verifyRes = await fetch(verifyUrl);
        const verifyData = (await verifyRes.json()) as { revoked: boolean };
        if (verifyData.revoked) {
          isAccessTokenValid = false;
        }
      }
    } catch {
      isAccessTokenValid = false;
    }
  }

  // Handle protected route routing
  if (isProtectedRoute) {
    if (isAccessTokenValid) {
      return NextResponse.next();
    }

    // Try silent refresh
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (refreshResponse.ok) {
        const response = NextResponse.next();
        const setCookieHeaders = refreshResponse.headers.getSetCookie();
        for (const header of setCookieHeaders) {
          response.headers.append("Set-Cookie", header);
        }
        return response;
      }
    } catch (error) {
      console.error("Proxy token refresh error:", error);
    }

    // Redirect to sign-in if refresh fails
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return res;
  }

  // Handle authenticated users visiting sign-in/sign-up
  if (isAuthRoute) {
    if (isAccessTokenValid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
