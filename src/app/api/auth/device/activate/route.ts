import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, type PreAuthTokenPayload } from "@/lib/jwt";

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

    // This is the clean abstraction hook where activation confirmation can be plugged in later.
    // For now, we return DEVICE_ACTIVATION_REQUIRED to notify the client application that
    // it needs to perform out-of-band activation (e.g. OTP, Admin Approval, or Email).
    return NextResponse.json(
      {
        success: false,
        code: "DEVICE_ACTIVATION_REQUIRED",
        message: "This login attempt is from an unrecognized browser/device. Device activation is required.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("Device activation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
