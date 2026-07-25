import "./globals.css";

export const metadata = {
  title: "車の買取・査定なら【Le Motor】| 中古車の買取・販売",
  description:
    "Le Motor（リモーター）は中古車の買取・査定・販売・修理・整備を行うオートショップです。事故車・故障車・不動車もお気軽にご相談ください。",
  robots: "index,follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
