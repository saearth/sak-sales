import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleUpload } from "@vercel/blob/client";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Issues a client-upload token so the browser can upload large PDFs
// directly to Vercel Blob (bypassing the serverless 4.5MB body limit).
export async function POST(request) {
  // Auth check before issuing any upload token
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ ok: false, error: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/pdf"],
        maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
        addRandomSuffix: false,
        tokenPayload: JSON.stringify({ user: session.username }),
      }),
      onUploadCompleted: async ({ blob }) => {
        // Nothing extra to persist — the document list is derived from blob storage.
        console.log("Upload completed:", blob.pathname);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message || "อัปโหลดไม่สำเร็จ" }, { status: 400 });
  }
}
