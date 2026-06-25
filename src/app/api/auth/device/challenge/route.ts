import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, signChallengeToken, type PreAuthTokenPayload } from "@/lib/jwt";

export async function POST(): Promise<Response> {
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

    const nonce = crypto.randomUUID();
    const timestamp = Date.now();

    // Create a challenge token containing the nonce and user ID
    const challengeToken = await signChallengeToken({
      userId: payload.userId,
      nonce,
    });

    // Set HTTP-only challenge_token cookie (expires in 2 minutes)
    cookieStore.set("challenge_token", challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60, // 2 minutes
      path: "/",
    });

    return NextResponse.json({
      success: true,
      nonce,
      timestamp,
    });
  } catch (error) {
    console.error("Device challenge error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
