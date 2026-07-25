export const dynamic = "force-dynamic";

// Leads are stored in Google Sheets via GOOGLE_SHEETS_WEBHOOK_URL.
export default function AdminPage() {
  return (
    <main style={{ padding: 32, fontFamily: "var(--font)", maxWidth: 640 }}>
      <h1>査定依頼の管理</h1>
      <p style={{ lineHeight: 1.7, marginTop: 16 }}>
        お客様が査定フォームを送信すると、相場価格を表示したうえでリード情報が
        <strong> Google スプレッドシート</strong>
        に追記されます。
      </p>
      <p style={{ lineHeight: 1.7, marginTop: 12, color: "#555" }}>
        管理画面の代わりに、設定したスプレッドシートを直接ご確認ください。
        セットアップ手順は <code>scripts/google-sheets-apps-script.js</code> を参照。
      </p>
      <p style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
        環境変数: <code>GOOGLE_SHEETS_WEBHOOK_URL</code>
      </p>
    </main>
  );
}
