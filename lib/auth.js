// Stateless session token, signed with HMAC-SHA256.
// Uses Web Crypto so it works in both the Node and Edge (middleware) runtimes.

export const SESSION_COOKIE = "sak_session";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-insecure-secret-change-me";
}

const enc = new TextEncoder();

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(data) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toHex(sig);
}

// Constant-ish time string compare
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// Create a token valid for `days` days
export async function createSession(username, days = 7) {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = `${encodeURIComponent(username)}.${exp}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

// Returns { username } if valid, otherwise null
export async function verifySession(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [user, exp, sig] = parts;
  const payload = `${user}.${exp}`;
  const expected = await hmac(payload);
  if (!safeEqual(sig, expected)) return null;
  if (Date.now() > Number(exp)) return null;
  return { username: decodeURIComponent(user) };
}

// Validate login credentials against env vars
export function checkCredentials(username, password) {
  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "changeme";
  return username === U && password === P;
}
