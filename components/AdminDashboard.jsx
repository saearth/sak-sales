"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

// Encode a (possibly Thai) title into an ASCII-safe, %-free token for the blob pathname.
function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function titleFromFile(name) {
  return (name || "document.pdf").replace(/\.pdf$/i, "").trim().slice(0, 120) || "document";
}
function fmtDate(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }); } catch { return ""; }
}
function fmtSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function AdminDashboard({ documents, username, blobReady }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState(null); // {type, text}
  const [busyUrl, setBusyUrl] = useState("");

  async function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMsg({ type: "error", text: "กรุณาเลือกไฟล์ PDF เท่านั้น" });
      return;
    }
    setMsg(null);
    setUploading(true);
    setProgress(0);
    try {
      const pathname = `pdfs/${Date.now()}__${b64urlEncode(titleFromFile(file.name))}.pdf`;
      await upload(pathname, file, {
        access: "public",
        contentType: "application/pdf",
        handleUploadUrl: "/api/documents/upload",
        onUploadProgress: (e) => setProgress(Math.round(e.percentage)),
      });
      setMsg({ type: "ok", text: `อัปโหลด "${file.name}" สำเร็จ` });
      setProgress(100);
      router.refresh();
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: e?.message || "อัปโหลดไม่สำเร็จ" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(url, title) {
    if (!confirm(`ลบเอกสาร "${title}" ?`)) return;
    setBusyUrl(url);
    setMsg(null);
    try {
      const res = await fetch(`/api/documents?url=${encodeURIComponent(url)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "ลบไม่สำเร็จ");
      setMsg({ type: "ok", text: "ลบเอกสารแล้ว" });
      router.refresh();
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setBusyUrl("");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <div className="admin-top nav">
        <div className="wrap nav-in">
          <div className="brand"><span className="logo">S</span><span>Sak Sales <small>แผงควบคุมแอดมิน</small></span></div>
          <div className="nav-links" style={{ display: "flex" }}>
            <a href="/" target="_blank">ดูหน้าเว็บ ↗</a>
            <button className="btn btn-ghost btn-sm" onClick={logout}>ออกจากระบบ</button>
          </div>
        </div>
      </div>

      <div className="wrap admin-main">
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>จัดการเอกสาร / แคตตาล็อก</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>สวัสดี {username} · อัปโหลดไฟล์ PDF เพื่ออัปเดตเอกสารที่ลูกค้าเห็นบนเว็บ</p>

        {!blobReady && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠️ ยังไม่ได้เชื่อม Vercel Blob — การอัปโหลดจะใช้งานไม่ได้จนกว่าจะสร้าง Blob Store ในโปรเจค Vercel (ดูขั้นตอนใน DEPLOY.md)
          </div>
        )}
        {msg && <div className={`alert ${msg.type === "ok" ? "alert-ok" : "alert-error"}`} style={{ marginBottom: 20 }}>{msg.text}</div>}

        {/* Upload */}
        <div className="panel">
          <h2>อัปโหลดเอกสารใหม่</h2>
          <p className="sub">รองรับไฟล์ PDF (สูงสุด 100 MB)</p>

          <div
            className={`dropzone ${drag ? "drag" : ""}`}
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            <div className="big">⬆️</div>
            <p><b>คลิกเพื่อเลือกไฟล์</b> หรือลากไฟล์ PDF มาวางที่นี่</p>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          {uploading && (
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
          )}
          {uploading && <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>กำลังอัปโหลด… {progress}%</p>}
        </div>

        {/* List */}
        <div className="panel">
          <h2>เอกสารทั้งหมด <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 16 }}>({documents.length})</span></h2>
          <p className="sub">เอกสารที่แสดงบนหน้าเว็บลูกค้า</p>

          {documents.length === 0 ? (
            <div className="empty">ยังไม่มีเอกสาร — อัปโหลดไฟล์แรกด้านบน</div>
          ) : (
            <table className="doc-table">
              <thead>
                <tr><th>ชื่อเอกสาร</th><th>วันที่อัปโหลด</th><th>ขนาด</th><th></th></tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.url}>
                    <td><span className="name">📕 {d.title}</span></td>
                    <td>{fmtDate(d.uploadedAt)}</td>
                    <td>{fmtSize(d.size)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <a className="btn btn-ghost btn-sm" href={d.url} target="_blank" rel="noopener noreferrer">ดู</a>{" "}
                      <button className="btn btn-danger btn-sm" disabled={busyUrl === d.url} onClick={() => handleDelete(d.url, d.title)}>
                        {busyUrl === d.url ? "กำลังลบ…" : "ลบ"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
