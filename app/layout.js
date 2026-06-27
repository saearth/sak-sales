import "./globals.css";

export const metadata = {
  title: "Sak Sales — อุปกรณ์ประปา ก่อสร้าง & ฮาร์ดแวร์",
  description:
    "Sak Sales ตัวแทนจำหน่ายอุปกรณ์ประปา ก่อสร้าง และฮาร์ดแวร์ ดูแคตตาล็อก/เอกสารสินค้าออนไลน์ สั่งซื้อง่ายผ่านไลน์",
  icons: { icon: "/favicon.svg" },
};

export const viewport = { themeColor: "#4338ca" };

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
