import { NextResponse } from "next/server";
import { db } from "@/db";
import { revokedTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const jti = searchParams.get("jti");

    if (!jti) {
      return NextResponse.json({ revoked: false });
    }

    const revoked = await db
      .select({ jti: revokedTokens.jti })
      .from(revokedTokens)
      .where(eq(revokedTokens.jti, jti))
      .limit(1);

    return NextResponse.json({ revoked: revoked.length > 0 });
  } catch (error) {
    console.error("Verify-blacklist endpoint error:", error);
    // Fail-safe to avoid blocking users on db errors
    return NextResponse.json({ revoked: false });
  }
}
