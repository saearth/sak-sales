// Public site config. LINE id is read from an env var so it can be set
// without touching code (Vercel → Project → Settings → Environment Variables).
//   NEXT_PUBLIC_LINE_ID = "@saksales"   (LINE Official, starts with @)
//   or a personal LINE id, or leave empty.

export const SITE = {
  name: "Sak Sales",
  tagline: "ตัวแทนจำหน่ายอุปกรณ์ประปา ก่อสร้าง & ฮาร์ดแวร์",
  lineId: process.env.NEXT_PUBLIC_LINE_ID || "",
};

export function lineHref(lineId = SITE.lineId) {
  const id = (lineId || "").trim();
  if (!id) return "";
  if (id.startsWith("http")) return id;
  if (id.startsWith("@")) return "https://line.me/R/ti/p/" + encodeURIComponent(id);
  return "https://line.me/ti/p/~" + encodeURIComponent(id);
}
