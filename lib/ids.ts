/**
 * ID + slug helpers. Uses Web Crypto when available (browser + edge + node 19+).
 */

export function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback — sufficient for a non-security-critical client id.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Short, URL-safe, human-shareable slug for /share/[slug]. */
export function shareSlug(length = 8): string {
  let out = "";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < length; i++) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}
