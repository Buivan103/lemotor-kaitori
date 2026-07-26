// Static option lists mirroring sell.tc-v.com form + landing content.

export const YEARS = [
  "2026年/令和8年", "2025年/令和7年", "2024年/令和6年", "2023年/令和5年",
  "2022年/令和4年", "2021年/令和3年", "2020年/令和2年", "2019年/平成31年/令和元年",
  "2018年/平成30年", "2017年/平成29年", "2016年/平成28年", "2015年/平成27年",
  "2014年/平成26年", "2013年/平成25年", "2012年/平成24年", "2011年/平成23年",
  "2010年/平成22年", "2009年/平成21年", "2008年/平成20年", "2007年/平成19年",
  "2006年/平成18年", "2005年/平成17年", "2004年/平成16年", "2003年/平成15年",
  "2002年/平成14年", "2001年/平成13年", "2000年/平成12年", "1999年/平成11年",
  "1998年/平成10年", "1997年/平成9年", "1996年/平成8年", "1995年/平成7年以前",
];

export const MILEAGES = [
  "0～5000KM", "5001～10000KM", "10001～15000KM", "15001～20000KM",
  "20001～25000KM", "25001～30000KM", "30001～35000KM", "35001～40000KM",
  "40001～45000KM", "45001～50000KM", "50001～55000KM", "55001～60000KM",
  "60001～65000KM", "65001～70000KM", "70001～75000KM", "75001～80000KM",
  "80001～85000KM", "85001～90000KM", "90001～95000KM", "95001～100000KM",
  "100001～110000KM", "110001～120000KM", "120001～130000KM", "130001～140000KM",
  "140001～150000KM", "150001～200000KM", "200001～KM",
];

/** Commercial / truck form — flow inspired by truck-five.com (fields only). */
export const COMMERCIAL_CATEGORIES = [
  "トラック・バン",
  "ダンプ",
  "積載車",
  "トレーラー",
  "パッカー車",
  "バス",
  "重機・建機",
  "農機具",
  "その他（発電機・パーツなど）",
];

/** Mileage or operating hours for trucks / heavy machinery. */
export const COMMERCIAL_USAGE = [
  "0-5万km",
  "5-10万km",
  "10-15万km",
  "15-20万km",
  "20-25万km",
  "25-30万km",
  "30-35万km",
  "35-40万km",
  "40-45万km",
  "45-50万km",
  "50万km~",
  "不明",
  "0-1,000h",
  "1,000-3,000h",
  "3,000-5,000h",
  "5,000-8,000h",
  "8,000-10,000h",
];

export const COMMERCIAL_YEARS = [
  "令和8年（2026）",
  "令和7年（2025）",
  "令和6年（2024）",
  "令和5年（2023）",
  "令和4年（2022）",
  "令和3年（2021）",
  "令和2年（2020）",
  "令和1年（2019）",
  "平成30年（2018）",
  "平成29年（2017）",
  "平成28年（2016）",
  "平成27年（2015）",
  "平成26年（2014）",
  "平成25年（2013）",
  "平成24年（2012）",
  "平成23年（2011）",
  "平成22年（2010）",
  "平成21年（2009）",
  "平成20年（2008）",
  "平成19年（2007）",
  "平成18年（2006）",
  "平成17年（2005）",
  "平成16年（2004）",
  "平成15年（2003）",
  "平成14年（2002）",
  "平成13年（2001）",
  "平成12年（2000）",
  "平成11年（1999）",
  "平成10年（1998）以前",
  "不明",
];

export const CAR_STATUS = [
  { value: 1, label: "走行可能" },
  { value: 2, label: "走行不可(車検切れ)" },
  { value: 3, label: "事故車" },
  { value: 4, label: "水没車" },
];

export const SELLING_TIME = [
  { value: 0, label: "未定" },
  { value: 1, label: "1ヶ月以内" },
  { value: 3, label: "3ヶ月以内" },
];

/** Grade options when maker API has no grade endpoint (sell.tc-v.com includes 不明). */
export const GRADES = [
  "不明",
  "標準",
  "G",
  "X",
  "S",
  "Z",
  "L",
  "EX",
  "その他",
];

/** Body color swatches — mirrors sell.tc-v.com #ModalColorNewLp */
export const COLORS = [
  { value: "WHITE", label: "ホワイト系", swatch: "#ffffff", border: true },
  { value: "BLACK", label: "ブラック系", swatch: "#222222" },
  { value: "SILVER", label: "シルバー系", swatch: "#c0c0c0" },
  { value: "RED", label: "レッド系", swatch: "#ff0d0d" },
  { value: "ORANGE", label: "オレンジ系", swatch: "#ff8800" },
  { value: "GREEN", label: "グリーン系", swatch: "#3ec74c" },
  { value: "BLUE", label: "ブルー系", swatch: "#00b2ff" },
  { value: "BROWN", label: "ブラウン系", swatch: "#b06400" },
  { value: "YELLOW", label: "イエロー系", swatch: "#ffb400" },
  { value: "PINK", label: "ピンク系", swatch: "#fe7898" },
  { value: "PEARL", label: "パール系", swatch: "linear-gradient(180deg,#fff 0%,#f3f3f3 100%)" },
  { value: "PURPLE", label: "パープル系", swatch: "#9747ff" },
  { value: "GOLD", label: "ゴールド系", swatch: "#d4af37" },
  { value: "GRAY", label: "グレー系", swatch: "#888888" },
  { value: "OTHER", label: "その他", swatch: "#eeeeee", border: true },
];

export const CONTACT_TIME = [
  { value: "morning", label: "8:00~12:00" },
  { value: "midday", label: "12:00~15:00" },
  { value: "afternoon", label: "15:00~18:00" },
  { value: "night", label: "18:00~20:00" },
];

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

/** Region groups for 都道府県 picker (sell.tc-v.com modalZipcodeSelect) */
export const PREFECTURE_REGIONS = [
  {
    title: "北海道・東北",
    items: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  },
  {
    title: "関東",
    items: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  },
  {
    title: "北信越",
    items: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県"],
  },
  {
    title: "東海",
    items: ["岐阜県", "静岡県", "愛知県", "三重県"],
  },
  {
    title: "関西",
    items: ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  },
  {
    title: "中国・四国",
    items: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
  },
  {
    title: "九州・沖縄",
    items: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
  },
];

export const APPRAISAL_RESULTS = [
  {
    title: "ホンダ ステップワゴンの査定結果",
    carName: "ホンダ ステップワゴン",
    image: "/assets/assessments/honda_step_wagon.png",
    year: "2016年",
    mileage: "45,000km",
    expect: "120万円",
    upAmount: "70",
    offers: ["A社：170万円", "B社：140万円", "C社：100万円"],
    review:
      "査定員により質問内容や評価が全然違ったのですが、最終的に希望額より大幅高額で購入して頂きました。",
  },
  {
    title: "スズキ ワゴンRの査定結果",
    carName: "スズキ ワゴンR",
    image: "/assets/assessments/suzuki_wagon_r.png",
    year: "2006年",
    mileage: "200,000km",
    expect: "2万円",
    upAmount: "1.9",
    offers: ["A社：3.4万円", "B社：2万円", "C社：1.5万円"],
    review:
      "大事に乗っていて傷もへこみもほぼない状態だったこともあり、結構高く買ってくれた。一括査定は便利だった。",
  },
  {
    title: "トヨタ istの査定結果",
    carName: "トヨタ ist",
    image: "/assets/assessments/toyota_ist.png",
    year: "2002年",
    mileage: "95,000km",
    expect: "10万円",
    upAmount: "8",
    offers: ["A社：10万円", "B社：6万円", "C社：2万円"],
    review:
      "金額には不満はあるものの、少しでも買取金額を上げていただけるよう、親身に話をきいて寄り添ってくださいました。",
  },
  {
    title: "いすゞ エルフ（ダンプ）の査定結果",
    carName: "いすゞ エルフ",
    image: "/assets/assessments/isuzu_elf.jpg",
    year: "2015年",
    distanceLabel: "走行距離",
    mileage: "18万km",
    expect: "280万円",
    upAmount: "70",
    offers: ["A社：350万円", "B社：310万円", "C社：260万円"],
    review:
      "法人所有のダンプでしたが、状態を丁寧に見ていただき、希望より高い金額でスムーズに買い取ってもらえました。",
  },
  {
    title: "クボタ 油圧ショベルの査定結果",
    carName: "クボタ 油圧ショベル",
    image: "/assets/assessments/kubota_excavator.jpg",
    year: "2012年",
    distanceLabel: "稼働時間",
    mileage: "4,800h",
    expect: "90万円",
    upAmount: "20",
    offers: ["A社：110万円", "B社：95万円", "C社：80万円"],
    review:
      "重機の査定は初めてで不安でしたが、仕様表やメーターの見方も教えてくれ、納得の金額で売却できました。",
  },
];

export const APPEALS = [
  {
    no: 1,
    title: "どんな車でも査定・買取に挑戦！",
    image: "/assets/icons/appeal-thumb01.png",
    body:
      "海外へ中古車を輸出サービスであるTCVにより、様々な日本の中古自動車を販売・パーツや資源として買取を実現しています。また、多種多様な各買取店舗・引取り業者との連携をすることで、他社にはできないような挑戦的な査定を実現しています。",
    okVisual: {
      image: "/assets/icons/appeal-ok-car.png",
      bubbles: ["10万km\n以上", "事故\n水没車", "故障車"],
      title: "どんな状態でもOK！",
      note:
        "国内では買取査定で金額が付きにくい古い車や、走行距離の多い車両、他社で断られた車も是非お気軽にご相談ください。",
    },
  },
  {
    no: 2,
    title: "来店不要で、ラクラク車買取",
    image: "/assets/icons/appeal-thumb02.png",
    body:
      "査定からご契約まで、来店は一切不要。売却や廃車が初めての方でも、電話で楽々対応が可能です。なお、車両の状態によっては数社からお取引のご連絡・ご確認がある場合がございますが、お断りするのも自由ですのでお気軽にお問い合わせください。",
  },
  {
    no: 3,
    title: "査定依頼は完全無料！",
    image: "/assets/icons/appeal-thumb03.png",
    body:
      "47都道府県、どこでも査定にお伺いします。お問い合わせ手続きは無料で、書類作成や提出などの余計な手間も一切不要。また、事故車・故障車などの動かない車の場合、場所によってはレッカー代がかかる場合がございますがこの点もお尋ねくださいませ。",
  },
];

export const FAQS = [
  {
    q: "Le Motorと他の買取査定の違いは？",
    a: "お問い合わせいただいた各車両の状態を丁寧に診断し、国内販売・海外需要も踏まえて「極力買取価格が付く」形でご提案します。",
  },
  {
    q: "故障・不動車も買取は可能ですか？",
    a: "可能です。お問い合わせはカンタンで、申し込みの際に状態を選択するだけとなります。",
  },
  {
    q: "他社で買取を断れた車両も査定できますか？",
    a: "はい、可能です。他社で値段が付かない車両や、買取が出来ない車両でも、0円以上の買取を目指してサービスをご提供いたします。",
  },
];
