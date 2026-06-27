import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { listDocuments, blobConfigured } from "@/lib/store";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) redirect("/admin/login");

  const documents = await listDocuments();
  return (
    <AdminDashboard
      documents={documents}
      username={session.username}
      blobReady={blobConfigured()}
    />
  );
}
