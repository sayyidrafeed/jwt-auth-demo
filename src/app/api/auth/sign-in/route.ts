import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, devices } from "@/db/schema";
import { comparePassword } from "@/lib/password";
import { signPreAuthToken } from "@/lib/jwt";
import { eq, and } from "drizzle-orm";

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

    // Check if the user has an active registered device
    const activeDeviceList = await db
      .select()
      .from(devices)
      .where(and(eq(devices.userId, user.id), eq(devices.isActive, true)))
      .limit(1);

    // Sign Pre-Auth Token
    const preAuthToken = await signPreAuthToken({
      userId: user.id,
    });

    // Set HTTP-only pre_auth_token cookie
    const cookieStore = await cookies();
    cookieStore.set("pre_auth_token", preAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60, // 5 minutes
      path: "/",
    });

    // Clear any existing session cookies to be safe
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    if (activeDeviceList.length === 0) {
      return NextResponse.json({
        success: true,
        nextStep: "REGISTER",
        message: "Device registration required",
      });
    }

    return NextResponse.json({
      success: true,
      nextStep: "CHALLENGE",
      message: "Device verification required",
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
