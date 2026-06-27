// Document storage backed by Vercel Blob.
// Each PDF is stored at:  pdfs/<timestamp>__<filename>.pdf
// The document list is derived directly from the blob listing (no separate DB).

import { list, put, del } from "@vercel/blob";

const PREFIX = "pdfs/";
const SEP = "__";

// Decode an ASCII-safe base64url token back into the original (UTF-8) title.
function b64urlDecode(token) {
  let s = token.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64").toString("utf8");
}

function parsePathname(pathname) {
  // pdfs/1719500000000__<base64url-title>.pdf
  const base = pathname.replace(PREFIX, "");
  const idx = base.indexOf(SEP);
  let ts = 0;
  let name = base;
  if (idx > -1) {
    ts = Number(base.slice(0, idx)) || 0;
    name = base.slice(idx + SEP.length);
  }
  const token = name.replace(/\.pdf$/i, "");
  let title = token;
  // New format = base64url. Fall back to percent-encoding (older) or raw.
  try {
    const decoded = b64urlDecode(token);
    if (decoded && !/�/.test(decoded)) title = decoded;
  } catch {
    try { title = decodeURIComponent(token); } catch {}
  }
  return { ts, title };
}

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Returns: [{ url, pathname, title, uploadedAt, size }]
export async function listDocuments() {
  if (!blobConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: PREFIX });
    return blobs
      .filter((b) => b.pathname.toLowerCase().endsWith(".pdf"))
      .map((b) => {
        const { ts, title } = parsePathname(b.pathname);
        return {
          url: b.url,
          pathname: b.pathname,
          title,
          size: b.size,
          uploadedAt: b.uploadedAt || (ts ? new Date(ts).toISOString() : null),
          ts,
        };
      })
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  } catch (e) {
    console.error("listDocuments failed:", e);
    return [];
  }
}

export async function uploadDocument(file, originalName) {
  const safe = (originalName || "document.pdf")
    .replace(/[^\w.\-ก-๙ ]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  const finalName = safe.toLowerCase().endsWith(".pdf") ? safe : `${safe}.pdf`;
  const pathname = `${PREFIX}${Date.now()}${SEP}${encodeURIComponent(finalName)}`;
  const blob = await put(pathname, file, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: false,
  });
  return blob;
}

export async function deleteDocument(url) {
  await del(url);
}
