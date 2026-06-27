"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="brand" style={{ justifyContent: "center", marginBottom: 8 }}>
          <span className="logo">S</span>
          <span>Sak Sales</span>
        </div>
        <h1>เข้าสู่ระบบแอดมิน</h1>
        <p>สำหรับจัดการเอกสาร/แคตตาล็อกสินค้า</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="u">ชื่อผู้ใช้</label>
          <input id="u" type="text" autoComplete="username" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="p">รหัสผ่าน</label>
          <input id="p" type="password" autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-brand" type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>
        <p style={{ marginTop: 18 }}><a href="/" style={{ color: "var(--brand)" }}>← กลับหน้าเว็บ</a></p>
      </form>
    </div>
  );
}
