# Sak Sales — เว็บนำเสนอสินค้า + ระบบจัดการเอกสาร

เว็บไซต์นำเสนอสินค้า (ประปา / ก่อสร้าง / ฮาร์ดแวร์) สไตล์โมเดิร์น
ลูกค้าเปิดดูแคตตาล็อก/เอกสาร PDF ได้ในหน้าเว็บ (พลิกหน้า–ซูม) และทักไลน์สั่งซื้อได้
แอดมินล็อกอินเข้าหลังบ้านเพื่ออัปโหลด/ลบไฟล์ PDF เพื่ออัปเดตเอกสารที่ลูกค้าเห็น

## เทคโนโลยี
- **Next.js 14 (App Router)** — deploy บน Vercel
- **Vercel Blob** — เก็บไฟล์ PDF (รองรับไฟล์ใหญ่ผ่าน client upload)
- **PDF.js** — ตัวอ่าน PDF ในหน้าเว็บ (โหลดจาก CDN)
- ระบบล็อกอินแอดมิน (username + password) ด้วย signed cookie

## โครงสร้างโปรเจค
```
app/
  page.js                  หน้าเว็บลูกค้า (hero + รายการเอกสาร + ติดต่อ)
  layout.js, globals.css   เลย์เอาต์ + สไตล์รวม
  admin/login/page.js      หน้าล็อกอินแอดมิน
  admin/page.js            แผงควบคุมแอดมิน (อัปโหลด/ลบ PDF)
  api/auth/login           เข้าสู่ระบบ
  api/auth/logout          ออกจากระบบ
  api/documents            list (GET) / delete (DELETE)
  api/documents/upload     ออก token ให้อัปโหลดไฟล์ใหญ่ตรงไป Blob
components/
  DocumentList.jsx         การ์ดเอกสารฝั่งลูกค้า
  PdfViewer.jsx            ตัวอ่าน PDF (พลิกหน้า/ซูม)
  AdminDashboard.jsx       UI หลังบ้าน
  LineButton.jsx           ปุ่มไลน์
lib/
  auth.js                  ออก/ตรวจ session (HMAC)
  store.js                 อ่าน/เขียนไฟล์บน Vercel Blob
  config.js                ตั้งค่าเว็บ + ลิงก์ไลน์
middleware.js              กันหน้า /admin ให้ต้องล็อกอิน
```

## ⚙️ ค่าที่ต้องตั้ง (Environment Variables)
ดู `.env.example` — มี 5 ค่า: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`,
`NEXT_PUBLIC_LINE_ID`, และ `BLOB_READ_WRITE_TOKEN` (Vercel ใส่ให้อัตโนมัติเมื่อสร้าง Blob Store)

## 🚀 วิธี Deploy
ดูขั้นตอนละเอียดทั้งหมดใน **`DEPLOY.md`**

## รันในเครื่อง (ถ้าต้องการ)
```bash
npm install
cp .env.example .env.local   # แล้วแก้ค่าให้ครบ
npm run dev                  # เปิด http://localhost:3000
```
หน้าแอดมินอยู่ที่ http://localhost:3000/admin
(การอัปโหลดต้องมี BLOB_READ_WRITE_TOKEN จาก Vercel Blob ถึงจะทำงาน)
# sak-sales
