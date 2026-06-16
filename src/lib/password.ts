import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext password using bcryptjs.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param password The plaintext password.
 * @param hash The stored hash to compare against.
 * @returns A promise that resolves to a boolean indicating a match.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
