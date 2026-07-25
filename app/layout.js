import "./globals.css";

export const metadata = {
  title: "車の買取・事故車や廃車の査定なら【セルトレ】",
  description:
    "中古車や廃車の買取・査定ならセルトレ（SELL AND TRADE)。動かなくなった車や水没車・事故車でも、あなたの元愛車を買い取り査定します。",
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
