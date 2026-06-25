import * as jose from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretjwtkeythatmustbe32byteslongormore!"
);

export interface AccessTokenPayload extends jose.JWTPayload {
  userId: string;
  email: string;
  role: string;
  jti: string;
  deviceId: string;
  sessionVersion: number;
}

export interface RefreshTokenPayload extends jose.JWTPayload {
  userId: string;
  deviceId: string;
  sessionVersion: number;
}

export interface PreAuthTokenPayload extends jose.JWTPayload {
  userId: string;
}

export interface ChallengeTokenPayload extends jose.JWTPayload {
  userId: string;
  nonce: string;
}

/**
 * Signs a short-lived access token.
 * @param payload The token payload.
 * @returns A promise that resolves to the token and its JTI (unique identifier).
 */
export async function signAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
  deviceId: string;
  sessionVersion: number;
}): Promise<{ token: string; jti: string }> {
  const jti = crypto.randomUUID();
  const token = await new jose.SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    jti,
    deviceId: payload.deviceId,
    sessionVersion: payload.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_ACCESS_EXPIRY || "15m")
    .sign(secret);

  return { token, jti };
}

/**
 * Signs a long-lived refresh token.
 * @param payload The token payload.
 * @returns A promise that resolves to the refresh token string.
 */
export async function signRefreshToken(payload: {
  userId: string;
  deviceId: string;
  sessionVersion: number;
}): Promise<string> {
  const token = await new jose.SignJWT({
    userId: payload.userId,
    deviceId: payload.deviceId,
    sessionVersion: payload.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRY || "7d")
    .sign(secret);

  return token;
}

/**
 * Signs a short-lived pre-auth token.
 */
export async function signPreAuthToken(payload: { userId: string }): Promise<string> {
  return await new jose.SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

/**
 * Signs a short-lived challenge token.
 */
export async function signChallengeToken(payload: { userId: string; nonce: string }): Promise<string> {
  return await new jose.SignJWT({ userId: payload.userId, nonce: payload.nonce })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
}

/**
 * Verifies a token's signature and expiration.
 * @param token The JWT string.
 * @returns The token payload if valid, or null.
 */
export async function verifyToken<T extends jose.JWTPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}

/**
 * Helper to compute the SHA-256 hash of a string (useful for storing refresh tokens securely).
 * @param token The raw token string.
 * @returns The hex representation of the SHA-256 hash.
 */
export async function hashToken(token: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
