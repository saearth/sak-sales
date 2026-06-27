"use client";

import { useState } from "react";
import PdfViewer from "./PdfViewer";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
function fmtSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function DocumentList({ documents }) {
  const [active, setActive] = useState(null);

  if (!documents || documents.length === 0) {
    return (
      <div className="empty">
        <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
        ยังไม่มีเอกสาร — แอดมินสามารถอัปโหลดไฟล์ PDF ได้ที่หน้า <b>/admin</b>
      </div>
    );
  }

  return (
    <>
      <div className="docs">
        {documents.map((d) => (
          <button key={d.url} className="doc" onClick={() => setActive(d)}>
            <div className="thumb">
              <span className="badge">PDF</span>
              📕
            </div>
            <div className="body">
              <h3>{d.title}</h3>
              <div className="meta">
                {fmtDate(d.uploadedAt)}{d.size ? ` · ${fmtSize(d.size)}` : ""}
              </div>
              <div className="open">เปิดดูเอกสาร →</div>
            </div>
          </button>
        ))}
      </div>

      {active && <PdfViewer doc={active} onClose={() => setActive(null)} />}
    </>
  );
}
