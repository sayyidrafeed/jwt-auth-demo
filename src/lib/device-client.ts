// Client-only helper for WebCrypto trusted device signatures.
// Since IndexedDB and WebCrypto are only available in the browser,
// this module should only be called on the client side.

const DB_NAME = "jwt_auth_device_db";
const STORE_NAME = "keys";
const PRIVATE_KEY_ID = "device_private_key";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPrivateKey(): Promise<CryptoKey> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(PRIVATE_KEY_ID);
    
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result as CryptoKey);
      } else {
        reject(new Error("No private key found in IndexedDB"));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

async function savePrivateKey(key: CryptoKey): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(key, PRIVATE_KEY_ID);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary);
}

/**
 * Generates an ECDSA P-256 keypair.
 * Stores the private key (non-exportable) in IndexedDB.
 * Returns the base64-encoded SPKI public key.
 */
export async function generateAndStoreKeyPair(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("generateAndStoreKeyPair can only be called in the browser");
  }

  // Generate ECDSA P-256 Keypair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false, // non-exportable private key
    ["sign", "verify"]
  );

  // Store private key in IndexedDB
  await savePrivateKey(keyPair.privateKey);

  // Export public key as SPKI (Subject Public Key Info) format
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  return arrayBufferToBase64(exportedPublicKey);
}

/**
 * Signs the challenge nonce and timestamp using the stored private key.
 * 
 * @param nonce Unique random string from the server
 * @param timestamp Time of signing
 * @returns Base64 encoded signature
 */
export async function signChallenge(nonce: string, timestamp: number): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("signChallenge can only be called in the browser");
  }

  const privateKey = await getPrivateKey();
  const dataToSign = new TextEncoder().encode(`${nonce}:${timestamp}`);

  const signature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    privateKey,
    dataToSign
  );

  return arrayBufferToBase64(signature);
}

/**
 * Checks if a private key is stored in IndexedDB.
 */
export async function hasStoredKey(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const key = await getPrivateKey();
    return !!key;
  } catch {
    return false;
  }
}

/**
 * Deletes the stored private key from IndexedDB.
 */
export async function clearStoredKey(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(PRIVATE_KEY_ID);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
