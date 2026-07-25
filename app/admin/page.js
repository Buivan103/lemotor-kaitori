import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Minimal internal dashboard to confirm leads are persisted to the database.
export default async function AdminPage() {
  let inquiries = [];
  try {
    inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    inquiries = [];
  }

  return (
    <main style={{ padding: 32, fontFamily: "var(--font)" }}>
      <h1>査定依頼一覧（DB: Inquiry）</h1>
      <p>合計 {inquiries.length} 件</p>
      <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#123a6b", color: "#fff" }}>
            <th>ID</th><th>日時</th><th>メーカー/車種</th><th>年式</th><th>走行</th>
            <th>状態</th><th>氏名</th><th>都道府県</th><th>連絡先</th><th>相場(万円)</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((i) => (
            <tr key={i.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{i.id}</td>
              <td>{new Date(i.createdAt).toLocaleString("ja-JP")}</td>
              <td>{i.makerName} {i.modelName}</td>
              <td>{i.year}</td>
              <td>{i.mileage}</td>
              <td>{i.carStatus}</td>
              <td>{i.lastName} {i.firstName}</td>
              <td>{i.prefecture}</td>
              <td>{i.email} / {i.tel}</td>
              <td>{i.estimateMin}~{i.estimateMax}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
