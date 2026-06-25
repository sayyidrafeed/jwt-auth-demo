import { webcrypto } from "crypto";

/**
 * Verifies an ECDSA P-256 signature against the base64-encoded public key.
 * The signed data is expected to be in the format: `${nonce}:${timestamp}`
 * 
 * @param publicKeyB64 SPKI format public key encoded in base64
 * @param nonce Unique random string
 * @param timestamp Epoch timestamp in milliseconds
 * @param signatureB64 Base64 signature
 * @returns boolean indicating if the signature is valid
 */
export async function verifyDeviceSignature(
  publicKeyB64: string,
  nonce: string,
  timestamp: number,
  signatureB64: string
): Promise<boolean> {
  try {
    const rawPublicKey = Buffer.from(publicKeyB64, "base64");
    const signatureBuffer = Buffer.from(signatureB64, "base64");
    
    // Import the SPKI public key
    const publicKey = await webcrypto.subtle.importKey(
      "spki",
      rawPublicKey,
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["verify"]
    );

    const dataToVerify = new TextEncoder().encode(`${nonce}:${timestamp}`);

    return await webcrypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      signatureBuffer,
      dataToVerify
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
