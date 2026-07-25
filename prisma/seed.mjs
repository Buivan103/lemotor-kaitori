// Seeds the database with makers, a sample of car models, and demo data
// so the landing page and form work out of the box.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DOMESTIC = [
  ["MLEJ", "レクサス"],
  ["MTOJ", "トヨタ"],
  ["MNIJ", "日産"],
  ["MHOJ", "ホンダ"],
  ["MMAJ", "マツダ"],
  ["MSBJ", "スバル"],
  ["MSZJ", "スズキ"],
  ["MMIJ", "三菱"],
  ["MDAJ", "ダイハツ"],
  ["MISJ", "いすゞ"],
];

const IMPORTED = [
  ["MMEG", "メルセデス・ベンツ"],
  ["MVWG", "フォルクスワーゲン"],
  ["MBMG", "BMW"],
  ["MADG", "アウディ"],
  ["MPOG", "ポルシェ"],
  ["MMNG", "ミニ"],
  ["MVOS", "ボルボ"],
  ["MPEF", "プジョー"],
  ["MFII", "フィアット"],
  ["MTSU", "テスラ"],
];

// A representative slice of models per maker (real site loads these via ajax).
const MODELS = {
  MTOJ: ["アルファード", "ヴェルファイア", "ハリアー", "プリウス", "アクア", "ヴォクシー", "ノア", "シエンタ", "カローラ", "ランドクルーザー"],
  MNIJ: ["セレナ", "ノート", "エクストレイル", "デイズ", "ティアナ", "モコ", "マーチ", "リーフ", "エルグランド", "スカイライン"],
  MHOJ: ["N-BOX", "フィット", "フリード", "ヴェゼル", "ステップワゴン", "オデッセイ", "シビック", "N-WGN", "フィットハイブリッド"],
  MSZJ: ["ワゴンR", "アルト", "スペーシア", "ハスラー", "ジムニー", "スイフト", "ソリオ", "エブリイ"],
  MDAJ: ["タント", "ムーヴ", "ミラ", "ムーヴキャンバス", "ロッキー", "コペン", "アトレーワゴン", "ハイゼット"],
  MMAJ: ["デミオ", "CX-5", "CX-3", "アクセラ", "ロードスター", "キャロル", "CX-8"],
  MSBJ: ["インプレッサ", "フォレスター", "レガシィ", "レヴォーグ", "XV", "サンバー"],
  MMIJ: ["デリカD:5", "アウトランダー", "eKワゴン", "パジェロ", "RVR"],
  MLEJ: ["NX", "RX", "IS", "UX", "LS", "CT", "LX"],
  MHOJ_DEFAULT: [],
};

async function main() {
  console.log("Seeding database...");

  // Makers
  let sort = 0;
  for (const [code, name] of DOMESTIC) {
    await prisma.maker.upsert({
      where: { code },
      update: { name, category: "domestic", sortOrder: sort },
      create: { code, name, category: "domestic", sortOrder: sort },
    });
    sort += 1;
  }
  sort = 0;
  for (const [code, name] of IMPORTED) {
    await prisma.maker.upsert({
      where: { code },
      update: { name, category: "imported", sortOrder: sort },
      create: { code, name, category: "imported", sortOrder: sort },
    });
    sort += 1;
  }

  // Models
  const makers = await prisma.maker.findMany();
  const byCode = Object.fromEntries(makers.map((m) => [m.code, m]));
  for (const [makerCode, names] of Object.entries(MODELS)) {
    const maker = byCode[makerCode];
    if (!maker) continue;
    let i = 0;
    for (const name of names) {
      const code = `${makerCode}-${String(i).padStart(3, "0")}`;
      await prisma.carModel.upsert({
        where: { code },
        update: { name, makerId: maker.id },
        create: { code, name, makerId: maker.id },
      });
      i += 1;
    }
  }

  // Recent applications ticker
  const prefectures = ["埼玉県", "岐阜県", "福岡県", "神奈川県", "新潟県", "千葉県", "宮城県", "岡山県", "静岡県", "広島県", "大阪府", "愛知県", "三重県", "沖縄県", "群馬県", "山口県", "長野県", "北海道", "東京都"];
  const cars = ["トヨタ アルファード", "トヨタ ハリアー", "日産 モコ", "日産 ティアナ", "マツダ キャロル", "ダイハツ タント", "スズキ ワゴンR", "トヨタ ヴェルファイア", "トヨタ プリウス", "スズキ アルト", "ホンダ N-BOX", "日産 セレナ", "ダイハツ ムーヴ", "ダイハツ ミラ", "トヨタ シエンタ", "トヨタ ヴォクシー", "レクサス NX"];
  await prisma.application.deleteMany();
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    await prisma.application.create({
      data: {
        prefecture: prefectures[Math.floor(Math.random() * prefectures.length)],
        carName: cars[Math.floor(Math.random() * cars.length)],
        appliedOn: new Date(now - i * 1000 * 60 * 37),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
