import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { listDocuments, deleteDocument } from "@/lib/store";

async function requireAuth() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export const dynamic = "force-dynamic";

// List documents (public-safe, but used by admin to refresh)
export async function GET() {
  const docs = await listDocuments();
  return NextResponse.json({ ok: true, documents: docs });
}

// Delete a document (admin only)
export async function DELETE(request) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ ok: false, error: "ไม่ได้รับอนุญาต" }, { status: 401 });

  const url = new URL(request.url).searchParams.get("url");
  if (!url) return NextResponse.json({ ok: false, error: "ไม่พบ url" }, { status: 400 });
  try {
    await deleteDocument(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}
