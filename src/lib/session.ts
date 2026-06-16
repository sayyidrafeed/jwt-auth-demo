import { cookies } from "next/headers";
import { verifyToken, type AccessTokenPayload } from "./jwt";
import { db } from "@/db";
import { revokedTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Retrieves the current session by reading the access token cookie.
 * Performs signature verification and optional blacklist checking.
 * @returns The session payload, or null if unauthenticated.
 */
export async function getSession(): Promise<AccessTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return null;
  }

  const payload = await verifyToken<AccessTokenPayload>(token);
  if (!payload) {
    return null;
  }

  // Token blacklist check (conditional on environment flag)
  if (process.env.ENABLE_TOKEN_BLACKLIST === "true") {
    const revoked = await db
      .select({ jti: revokedTokens.jti })
      .from(revokedTokens)
      .where(eq(revokedTokens.jti, payload.jti))
      .limit(1);

    if (revoked.length > 0) {
      return null;
    }
  }

  return payload;
}
