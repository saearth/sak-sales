# คู่มือ Deploy — Sak Sales (Next.js + Vercel)

โปรเจคนี้ commit เริ่มต้นไว้พร้อมแล้ว ทำตาม 4 ขั้นนี้

---

## ขั้นที่ 1 — ขึ้น GitHub
1. สร้าง repo ว่างที่ https://github.com/new ชื่อ `sak-sales` (อย่าติ๊ก Add README)
2. เปิด Terminal `cd` เข้าโฟลเดอร์ `sak-sales` แล้วรัน (แทน USERNAME ด้วยชื่อ GitHub):
```bash
git remote add origin https://github.com/USERNAME/sak-sales.git
git branch -M main
git push -u origin main
```
> ถ้าถามรหัสผ่าน ให้ใช้ Personal Access Token (github.com/settings/tokens → classic → สิทธิ์ `repo`)

---

## ขั้นที่ 2 — Import เข้า Vercel
1. เข้า https://vercel.com → Log in ด้วย GitHub
2. **Add New… → Project** → เลือก repo `sak-sales` → **Import**
3. Framework จะถูกตรวจเป็น **Next.js** อัตโนมัติ — กด **Deploy** ได้เลย (ครั้งแรกอาจยังไม่สมบูรณ์ เดี๋ยวเติม env)

---

## ขั้นที่ 3 — สร้าง Storage (Vercel Blob) สำหรับเก็บ PDF
1. ในโปรเจคบน Vercel → แท็บ **Storage** → **Create Database** → เลือก **Blob** → Create
2. กด **Connect** เข้ากับโปรเจค `sak-sales`
3. Vercel จะใส่ตัวแปร `BLOB_READ_WRITE_TOKEN` ให้อัตโนมัติ ✅ (ไม่ต้องก็อปเอง)

---

## ขั้นที่ 4 — ตั้งค่า Environment Variables
ไปที่ **Settings → Environment Variables** เพิ่ม 4 ค่านี้ (เลือก scope = Production + Preview):

| Key | ตัวอย่างค่า | หมายเหตุ |
|-----|------------|----------|
| `ADMIN_USERNAME` | `admin` | ชื่อผู้ใช้สำหรับล็อกอินหลังบ้าน |
| `ADMIN_PASSWORD` | `ตั้งรหัสที่เดายาก` | รหัสผ่านแอดมิน |
| `SESSION_SECRET` | `H0YfhZRUG3E3qiRI77aAsrgajFcu9SyHCHvVpWTA` | คีย์สุ่มยาว ๆ (เปลี่ยนเป็นของตัวเอง) |
| `NEXT_PUBLIC_LINE_ID` | `@saksales` | ไอดีไลน์ที่ปุ่มจะลิงก์ไป (LINE OA ขึ้นต้น @) |

จากนั้นไปที่แท็บ **Deployments → … → Redeploy** หนึ่งครั้ง เพื่อให้ค่ามีผล

---

## เสร็จแล้ว — วิธีใช้งาน
- **หน้าเว็บลูกค้า:** `https://sak-sales.vercel.app`
- **หลังบ้าน:** `https://sak-sales.vercel.app/admin` → ล็อกอินด้วย user/pass ที่ตั้งไว้
  - อัปโหลดไฟล์ PDF (ลากวางได้) → เอกสารจะขึ้นบนหน้าเว็บลูกค้าทันที
  - ลบเอกสารเก่าได้จากตารางในหน้าแอดมิน

## อัปเดตโค้ดภายหลัง
แก้ไฟล์ → `git add -A && git commit -m "..." && git push` → Vercel deploy ใหม่อัตโนมัติ

## หมายเหตุ
- ปุ่มไลน์: เปลี่ยนได้แค่แก้ env `NEXT_PUBLIC_LINE_ID` แล้ว Redeploy (ไม่ต้องแก้โค้ด)
- ตัวอ่าน PDF โหลดเอนจินจาก CDN (cdnjs) — เครื่องลูกค้าต้องต่อเน็ตปกติ
- ไฟล์ PDF อัปโหลดได้สูงสุด 100 MB/ไฟล์
