import { listDocuments } from "@/lib/store";
import { SITE, lineHref } from "@/lib/config";
import DocumentList from "@/components/DocumentList";
import LineButton from "@/components/LineButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const documents = await listDocuments();
  const href = lineHref();

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="wrap nav-in">
          <div className="brand">
            <span className="logo">S</span>
            <span>
              {SITE.name}
              <small>{SITE.tagline}</small>
            </span>
          </div>
          <nav className="nav-links">
            <a href="#documents">เอกสาร / แคตตาล็อก</a>
            <a href="#why">ทำไมต้องเรา</a>
            <a href="#contact">ติดต่อ</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-in">
          <span className="pill">⭐ ตัวแทนจำหน่ายอุปกรณ์ประปา ก่อสร้าง &amp; ฮาร์ดแวร์</span>
          <h1>
            {SITE.name}
            <br />ดูแคตตาล็อกสินค้าออนไลน์ ง่ายในที่เดียว
          </h1>
          <p>
            เปิดดูเอกสารและแคตตาล็อกสินค้าได้ทันทีในเว็บ พลิกหน้า–ซูมได้สะดวก
            สนใจสินค้ารายการไหน ทักไลน์สอบถามได้เลย
          </p>
          <div className="hero-btns">
            <a className="btn btn-light" href="#documents">📄 ดูเอกสารสินค้า</a>
            <LineButton href={href}>สนใจสินค้า แอดไลน์</LineButton>
          </div>
          <div className="hero-stats">
            <div><b>{documents.length}</b><span>เอกสาร/แคตตาล็อก</span></div>
            <div><b>ออนไลน์</b><span>ดูได้ทุกที่ทุกเวลา</span></div>
            <div><b>ราคาส่ง</b><span>คุยราคาได้ทางไลน์</span></div>
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="section" id="documents">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">เอกสาร / แคตตาล็อก</span>
            <h2>เลือกเปิดดูเอกสารสินค้า</h2>
            <p>คลิกที่เอกสารเพื่อเปิดดูในหน้าเว็บ — พลิกหน้า ซูมเข้า-ออก หรือดาวน์โหลดได้</p>
          </div>
          <DocumentList documents={documents} />
        </div>
      </section>

      {/* WHY */}
      <section className="section alt" id="why">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">ทำไมต้องเรา</span>
            <h2>ซื้อง่าย ครบ คุ้ม</h2>
          </div>
          <div className="features">
            <div className="feature"><div className="ic">📄</div><h3>ดูเอกสารง่าย</h3><p>เปิดแคตตาล็อกดูในเว็บได้ทันที พลิกหน้า–ซูมสะดวก ไม่ต้องโหลดไฟล์หนัก</p></div>
            <div className="feature"><div className="ic">🔄</div><h3>อัปเดตตลอด</h3><p>แอดมินอัปโหลด PDF ใหม่เมื่อไหร่ เว็บอัปเดตให้ลูกค้าเห็นทันที</p></div>
            <div className="feature"><div className="ic">💬</div><h3>สั่งง่ายผ่านไลน์</h3><p>เห็นสินค้าที่สนใจ ทักไลน์ถามราคา–สั่งซื้อได้เลย จบในแชทเดียว</p></div>
            <div className="feature"><div className="ic">🏷️</div><h3>ราคาส่ง</h3><p>ราคายุติธรรม ซื้อจำนวนมากคุยราคาได้ เหมาะกับร้านค้าและช่าง</p></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section cta" id="contact">
        <div className="wrap">
          <div className="cta-card">
            <div style={{ fontSize: 40, marginBottom: 6 }}>💬</div>
            <h2>สนใจสินค้า? ทักมาเลย</h2>
            <p>กดปุ่มด้านล่างเพื่อแอดไลน์ แล้วแจ้งสินค้าที่ต้องการได้เลย ยินดีให้คำแนะนำและเสนอราคา</p>
            <LineButton href={href} iconSize={22}>แอดไลน์ / สั่งซื้อ</LineButton>
            {!href && <small>📌 ยังไม่ได้ตั้งค่าไอดีไลน์ — ตั้งใน Vercel env: NEXT_PUBLIC_LINE_ID</small>}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <b>{SITE.name}</b> — {SITE.tagline}
          <br />
          <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} · สอบถาม/สั่งซื้อทางไลน์ · <a href="/admin">เข้าระบบแอดมิน</a></span>
        </div>
      </footer>

      {/* Floating LINE */}
      <div className="fab">
        <LineButton href={href} className="">แชทเลย</LineButton>
      </div>
    </>
  );
}
