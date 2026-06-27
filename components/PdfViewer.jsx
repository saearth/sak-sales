"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PDFJS_VERSION = "3.11.174";
const PDFJS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

// Load pdf.js from CDN at runtime (keeps it out of the build bundle).
function loadPdfJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `${PDFJS_CDN}/pdf.min.js`;
    s.onload = () => {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
        resolve(window.pdfjsLib);
      } catch (e) {
        reject(e);
      }
    };
    s.onerror = () => reject(new Error("ไม่สามารถโหลดตัวอ่าน PDF ได้"));
    document.head.appendChild(s);
  });
}

export default function PdfViewer({ doc, onClose }) {
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the document
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const pdfjs = await loadPdfJs();
        const task = pdfjs.getDocument({ url: doc.url });
        const pdf = await task.promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setPage(1);
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("ไม่สามารถเปิดเอกสารได้");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
      if (pdfRef.current) {
        try { pdfRef.current.destroy(); } catch {}
        pdfRef.current = null;
      }
    };
  }, [doc.url]);

  // Render current page
  const renderPage = useCallback(async () => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    try {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
      const pg = await pdf.getPage(page);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pg.getViewport({ scale: scale * dpr });
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;
      const task = pg.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      await task.promise;
    } catch (e) {
      if (e && e.name === "RenderingCancelledException") return;
      console.error(e);
    }
  }, [page, scale]);

  useEffect(() => {
    if (!loading && !error) renderPage();
  }, [loading, error, renderPage]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") setPage((p) => Math.min(p + 1, numPages));
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") setPage((p) => Math.max(p - 1, 1));
      else if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.2, 3));
      else if (e.key === "-") setScale((s) => Math.max(s - 0.2, 0.5));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [numPages, onClose]);

  return (
    <div className="viewer-overlay" role="dialog" aria-modal="true">
      <div className="viewer-bar">
        <span className="title">{doc.title}</span>

        <div className="group">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page <= 1} title="หน้าก่อน">‹</button>
          <span className="pageinfo">{numPages ? `${page} / ${numPages}` : "—"}</span>
          <button onClick={() => setPage((p) => Math.min(p + 1, numPages))} disabled={page >= numPages} title="หน้าถัดไป">›</button>
        </div>

        <div className="group">
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))} title="ซูมออก">−</button>
          <span className="pageinfo">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} title="ซูมเข้า">+</button>
        </div>

        <div className="group">
          <a className="btn btn-ghost btn-sm" href={doc.url} target="_blank" rel="noopener noreferrer">เปิด/ดาวน์โหลด</a>
          <button className="close" onClick={onClose} title="ปิด">✕</button>
        </div>
      </div>

      <div className="viewer-stage">
        {loading && (
          <div className="viewer-loading"><div className="spinner" />กำลังโหลดเอกสาร…</div>
        )}
        {error && <div className="viewer-loading">{error}</div>}
        {!error && <canvas ref={canvasRef} style={{ display: loading ? "none" : "block" }} />}
      </div>
    </div>
  );
}
