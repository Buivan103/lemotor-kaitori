/**
 * Market-oriented buyout estimate (万円).
 *
 * Based on common JP used-car appraisal practice (残価率 by age, 年1万km norm,
 * 5万/10万km breakpoints) and public buyout ranges for popular models
 * (e.g. carmo-kun / similar journals: 2021年・5万km anchors).
 *
 * Not a live auction feed — illustrative for the landing form.
 * ATTRACTIVE_BOOST keeps the shown range slightly above mid-market to attract leads.
 */

const REF_YEAR = new Date().getFullYear();

/** Mid-market buyout (万円) for ~5年落ち・走行約5万km・走行可能・標準グレード */
const MODEL_ANCHORS = {
  アルファード: 285,
  ヴェルファイア: 369,
  ハリアー: 270,
  プリウス: 156,
  アクア: 155,
  ヴォクシー: 175,
  ノア: 170,
  シエンタ: 145,
  カローラ: 110,
  ランドクルーザー: 389,
  セレナ: 174,
  ノート: 95,
  エクストレイル: 185,
  デイズ: 55,
  ティアナ: 45,
  モコ: 25,
  マーチ: 30,
  リーフ: 70,
  エルグランド: 120,
  スカイライン: 140,
  "N-BOX": 86,
  フィット: 85,
  フリード: 140,
  ヴェゼル: 250,
  ステップワゴン: 155,
  オデッセイ: 130,
  シビック: 160,
  "N-WGN": 60,
  フィットハイブリッド: 90,
  ワゴンR: 45,
  アルト: 35,
  スペーシア: 75,
  ハスラー: 95,
  ジムニー: 186,
  スイフト: 85,
  ソリオ: 90,
  エブリイ: 55,
  タント: 70,
  ムーヴ: 40,
  ミラ: 25,
  ムーヴキャンバス: 85,
  ロッキー: 130,
  コペン: 110,
  アトレーワゴン: 50,
  ハイゼット: 45,
  デミオ: 55,
  "CX-5": 175,
  "CX-3": 110,
  アクセラ: 60,
  ロードスター: 150,
  キャロル: 30,
  "CX-8": 200,
  インプレッサ: 100,
  フォレスター: 160,
  レガシィ: 90,
  レヴォーグ: 145,
  XV: 130,
  サンバー: 40,
  "デリカD:5": 160,
  アウトランダー: 140,
  eKワゴン: 40,
  パジェロ: 100,
  RVR: 80,
  NX: 280,
  RX: 350,
  IS: 220,
  UX: 240,
  LS: 400,
  CT: 120,
  LX: 450,
};

/** Fallback mid buyout (5年/5万km) by maker when model is unknown */
const MAKER_DEFAULTS = {
  MLEJ: 280,
  MTOJ: 150,
  MNIJ: 100,
  MHOJ: 110,
  MMAJ: 120,
  MSBJ: 110,
  MSZJ: 70,
  MMIJ: 90,
  MDAJ: 55,
  MISJ: 80,
  MMEG: 320,
  MVWG: 180,
  MBMG: 300,
  MADG: 250,
  MPOG: 450,
  MMNG: 160,
  MVOS: 200,
  MPEF: 140,
  MFTI: 100,
  MTSU: 280,
};

const KEI_NAMES = new Set([
  "N-BOX",
  "N-WGN",
  "ワゴンR",
  "アルト",
  "スペーシア",
  "ハスラー",
  "ジムニー",
  "エブリイ",
  "タント",
  "ムーヴ",
  "ミラ",
  "ムーヴキャンバス",
  "キャロル",
  "デイズ",
  "モコ",
  "eKワゴン",
  "サンバー",
  "ハイゼット",
  "アトレーワゴン",
  "コペン",
]);

/** Slightly above mid-market so the WEB estimate feels attractive */
const ATTRACTIVE_BOOST = 1.05;

const AGE_RESIDUAL_VS_5Y = [
  [0, 1.9],
  [1, 1.72],
  [2, 1.48],
  [3, 1.32],
  [4, 1.12],
  [5, 1.0],
  [6, 0.86],
  [7, 0.72],
  [8, 0.58],
  [9, 0.46],
  [10, 0.36],
  [12, 0.24],
  [15, 0.15],
  [18, 0.1],
  [20, 0.08],
  [25, 0.05],
  [30, 0.04],
];

function lerpTable(table, x) {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x0, y0] = table[i - 1];
    const [x1, y1] = table[i];
    if (x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return table[table.length - 1][1];
}

export function parseYear(year) {
  if (year == null || year === "") return null;
  if (typeof year === "number" && Number.isFinite(year)) return year;
  const m = String(year).match(/(19|20)\d{2}/);
  return m ? parseInt(m[0], 10) : null;
}

/** Midpoint-ish km from form ranges like "50001～55000KM" */
export function parseMileageKm(mileage) {
  if (mileage == null || mileage === "") return null;
  if (typeof mileage === "number") return mileage;
  const s = String(mileage);
  const nums = s.match(/\d+/g);
  if (!nums || !nums.length) return null;
  if (nums.length === 1) return parseInt(nums[0], 10);
  const a = parseInt(nums[0], 10);
  const b = parseInt(nums[1], 10);
  return Math.round((a + b) / 2);
}

function anchorPrice(makerCode, modelName) {
  if (modelName && MODEL_ANCHORS[modelName] != null) {
    return MODEL_ANCHORS[modelName];
  }
  return MAKER_DEFAULTS[makerCode] ?? 100;
}

function isKei(modelName) {
  return modelName ? KEI_NAMES.has(modelName) : false;
}

function mileageFactor(age, km, kei) {
  if (km == null || Number.isNaN(km)) return 1;
  const expected = Math.max(age, 1) * (kei ? 8000 : 10000);
  const delta = km - expected;
  // ~3–5万円 / 1万km on mid cars ≈ few % of residual
  let factor = 1 - (delta / 10000) * (kei ? 0.035 : 0.04);
  if (km > 100000) factor *= 0.92;
  if (km > 150000) factor *= 0.85;
  if (km > 200000) factor *= 0.75;
  // Very low mileage on old cars: slight discount (長期不動 suspicion)
  if (age >= 8 && km < expected * 0.35) factor *= 0.95;
  return Math.min(1.15, Math.max(0.35, factor));
}

function statusFactor(carStatus) {
  switch (Number(carStatus)) {
    case 2:
      return 0.55; // 走行不可
    case 3:
      return 0.4; // 事故車
    case 4:
      return 0.25; // 水没車
    default:
      return 1;
  }
}

function gradeFactor(grade) {
  const g = String(grade || "").trim();
  if (!g || g === "不明" || g === "標準" || g === "その他") return 1;
  if (["Z", "EX", "Golden", "カスタム"].some((x) => g.includes(x))) return 1.08;
  if (["G", "S", "L", "XV", "XC"].includes(g)) return 1.04;
  return 1;
}

function colorFactor(color) {
  const c = String(color || "").toUpperCase();
  if (["WHITE", "BLACK", "PEARL"].includes(c)) return 1.02;
  if (["SILVER", "GRAY"].includes(c)) return 1.0;
  if (!c || c === "OTHER") return 1.0;
  return 0.97;
}

/**
 * @returns {{ min: number, max: number, mid: number }}
 */
export function estimateMarketPrice({
  makerCode,
  modelName,
  year,
  mileage,
  carStatus = 1,
  grade,
  color,
}) {
  const yearNum = parseYear(year);
  const km = parseMileageKm(mileage);
  const age =
    yearNum != null ? Math.max(0, REF_YEAR - yearNum) : 8;

  let base = anchorPrice(makerCode, modelName);
  base *= lerpTable(AGE_RESIDUAL_VS_5Y, age);
  base *= mileageFactor(age, km, isKei(modelName));
  base *= statusFactor(carStatus);
  base *= gradeFactor(grade);
  base *= colorFactor(color);
  base *= ATTRACTIVE_BOOST;

  // Floor: scrap / export still often has some value
  const floor = Number(carStatus) >= 3 ? 1 : isKei(modelName) ? 3 : 5;
  const mid = Math.max(floor, Math.round(base));

  // Show a band like real sites (roughly ±12–18%)
  const spread = mid < 40 ? 0.18 : mid < 150 ? 0.14 : 0.12;
  const min = Math.max(floor, Math.round(mid * (1 - spread)));
  const max = Math.max(min + 1, Math.round(mid * (1 + spread)));

  return { min, max, mid };
}

/** Rough commercial / truck estimate (万円). Illustrative for lead form. */
export function estimateCommercialPrice({
  commercialCategory,
  year,
  mileage,
}) {
  const yearNum = parseYear(year);
  const age = yearNum != null ? Math.max(0, REF_YEAR - yearNum) : 10;

  const categoryBase = {
    "トラック・バン": 180,
    ダンプ: 220,
    積載車: 200,
    トレーラー: 250,
    パッカー車: 210,
    バス: 280,
    "重機・建機": 320,
    農機具: 90,
    "その他（発電機・パーツなど）": 40,
  };

  let base = categoryBase[commercialCategory] ?? 150;
  base *= lerpTable(AGE_RESIDUAL_VS_5Y, age);

  const usage = String(mileage || "");
  if (usage.includes("h") || usage.includes("H")) {
    if (usage.includes("8,000") || usage.includes("10,000")) base *= 0.55;
    else if (usage.includes("5,000")) base *= 0.7;
    else if (usage.includes("3,000")) base *= 0.85;
  } else if (usage.includes("万km")) {
    const n = parseFloat(usage);
    if (n >= 50) base *= 0.45;
    else if (n >= 30) base *= 0.6;
    else if (n >= 20) base *= 0.75;
    else if (n >= 10) base *= 0.88;
  } else if (usage === "不明") {
    base *= 0.8;
  }

  base *= ATTRACTIVE_BOOST;
  const floor = 5;
  const mid = Math.max(floor, Math.round(base));
  const spread = mid < 80 ? 0.18 : 0.14;
  const min = Math.max(floor, Math.round(mid * (1 - spread)));
  const max = Math.max(min + 1, Math.round(mid * (1 + spread)));
  return { min, max, mid };
}
