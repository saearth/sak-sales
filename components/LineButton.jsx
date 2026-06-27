"use client";

const LineIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 5.7 2 10.26c0 4.08 3.55 7.5 8.35 8.14.32.07.77.21.88.49.1.25.07.64.03.89l-.14.86c-.04.25-.2.99.87.54s5.78-3.4 7.88-5.83C21.4 13.7 22 12.04 22 10.26 22 5.7 17.52 2 12 2z" />
  </svg>
);

export default function LineButton({ href, className = "btn btn-line", children, iconSize = 20 }) {
  function handle(e) {
    if (!href) {
      e.preventDefault();
      alert(
        "ยังไม่ได้ตั้งค่าไอดีไลน์ครับ 🙏\n\nไปที่ Vercel → Project → Settings → Environment Variables แล้วเพิ่ม NEXT_PUBLIC_LINE_ID เช่น @saksales จากนั้น Redeploy"
      );
    }
  }
  return (
    <a className={className} href={href || "#"} onClick={handle} target={href ? "_blank" : undefined} rel="noopener noreferrer">
      <LineIcon size={iconSize} />
      {children}
    </a>
  );
}
