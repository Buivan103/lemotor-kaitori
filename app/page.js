import { prisma } from "@/lib/prisma";
import { APPRAISAL_RESULTS, FAQS } from "@/lib/constants";
import AppraisalForm from "./components/AppraisalForm";
import WelcomeModal from "./components/WelcomeModal";

export const dynamic = "force-dynamic";

function formatDate(d) {
  const dt = new Date(d);
  return `${String(dt.getMonth() + 1).padStart(2, "0")}/${String(dt.getDate()).padStart(2, "0")}`;
}

async function getApplications() {
  try {
    return await prisma.application.findMany({
      orderBy: { appliedOn: "desc" },
      take: 30,
    });
  } catch {
    return [];
  }
}

const PURCHASE = [
  { src: "/assets/icons/purchase01.jpeg", name: "IST" },
  { src: "/assets/icons/purchase02.jpeg", name: "Harrier" },
  { src: "/assets/icons/purchase03.jpeg", name: "Corolla Axio" },
  { src: "/assets/icons/purchase05.jpeg", name: "Note" },
  { src: "/assets/icons/purchase06.jpeg", name: "Vitz" },
  { src: "/assets/icons/appeal01.png", name: "Land Cruiser Prado" },
];

export default async function Home() {
  const applications = await getApplications();

  return (
    <>
      <WelcomeModal />

      {/* Top black bar */}
      <p className="topbar">
        中古車や廃車の買取・査定ならセルトレ（SELL AND TRADE) 動かくなった車や水没車・事故車でも、あなたの元愛車を買い取り査定。
      </p>

      {/* Header */}
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="site-header__logo"
              src="/assets/logo.svg"
              alt="セルトレ SELL AND TRADE"
            />
            <div className="site-header__sponsors">
              <span>協賛:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/mota_logo.webp" alt="MOTA" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/navikuru_logo.png" alt="ナビクル" />
            </div>
          </div>
          <div className="site-header__badge">
            東証
            <br />
            プライム
            <br />
            上場
          </div>
        </div>
      </header>

      {/* Keyvisual — this IS the hero design on the original site */}
      <div className="kv">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/keyvisual/pckv_2a.jpeg"
          alt="あなたの愛車の最高額がわかる！国内販売と海外輸出で最高額売却の秘訣！"
        />
      </div>

      {/* Good-deal benefits under keyvisual */}
      <section className="good-deal">
        <p className="good-deal__lead">
          <span className="hl">「想定以上の査定額が出た」</span>
          の声が続出の一括査定！
          <br />
          査定額に満足できなければ売却しなくてもOK！
        </p>
        <div className="good-deal__blocks">
          <div className="good-deal__block">
            一括査定なら
            <span className="red">平均12万円もお得！</span>
          </div>
          <div className="good-deal__block">
            申し込み後すぐに
            <span className="red">相場額</span>
            がわかる！
          </div>
          <div className="good-deal__block">
            WEBで簡単に
            <span className="red">愛車の相場額をチェック！</span>
          </div>
        </div>
        <p className="good-deal__note">
          ※2021年9月～2022年3月の平均価格差であり、査定額の保証はできかねます。
        </p>
      </section>

      {/* Campaign banner */}
      <div className="campaign">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/campaign/digico_820.png"
          alt="対象者全員にデジタルギフト券20,000円分！"
        />
      </div>

      {/* Yellow form title */}
      <div className="form-titlebar" id="form">
        <h2>買取・査定をする車両の情報を入力ください</h2>
      </div>

      {/* Form */}
      <div className="form-area">
        <AppraisalForm />
      </div>

      {/* Steps */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section__title">
            「オールインワン査定」で<span className="u">楽々売却</span>！
          </h2>
          <p className="section__desc">
            不要な手間は一切無し！ラクラク3ステップでカンタン・安心査定
          </p>
          <div className="steps3">
            <div className="stepcard">
              <span className="stepcard__no">STEP 1</span>
              <h3>車両情報・本人情報の入力</h3>
              <p>※車検証をご用意いただくとスムーズです</p>
            </div>
            <div className="stepcard">
              <span className="stepcard__no">STEP 2</span>
              <h3>車両状況に合わせた査定依頼</h3>
              <p>※廃車も含めたご提案を実現</p>
            </div>
            <div className="stepcard">
              <span className="stepcard__no">STEP 3</span>
              <h3>査定額のご連絡</h3>
              <p>※状況・時間帯によってはお時間をいただく場合がございます</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section section--white">
        <div className="container">
          <h2 className="section__title">
            全国から<span className="u">お申し込み</span>が続々！
          </h2>
          <p className="section__desc">既にたくさんのお客様にご利用いただいております</p>
          <div className="appboard">
            <div className="appboard__row head">
              <div>お申込み</div>
              <div>都道府県</div>
              <div>車種名</div>
            </div>
            <div className="appboard__scroll">
              {applications.map((a) => (
                <div className="appboard__row" key={a.id}>
                  <div>{formatDate(a.appliedOn)}</div>
                  <div>{a.prefecture}</div>
                  <div>{a.carName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appraisal results */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section__title">
            査定<span className="u">実績</span>について
          </h2>
          <p className="section__desc">走行可能な車両の事例での査定額をご紹介</p>
          <div className="results">
            {APPRAISAL_RESULTS.map((r, i) => (
              <div className="resultcard" key={r.title}>
                <div className="resultcard__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/icons/appeal0${(i % 3) + 1}.png`}
                    alt=""
                  />
                </div>
                <div className="resultcard__body">
                  <h3>{r.title}</h3>
                  <div className="resultcard__spec">
                    年式: {r.year} ／ 走行距離: {r.mileage} ／ 本人想定額: {r.expect}
                  </div>
                  <ul className="resultcard__offers">
                    {r.offers.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                  <p className="resultcard__review">{r.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <p>1社だけ見積もるよりお得！比較するだけで高額査定のチャンス</p>
          <a className="cta-btn" href="#form">
            <small>無料</small>今すぐ査定依頼
          </a>
        </div>
      </section>

      {/* Merits */}
      <section className="section section--white">
        <div className="container">
          <h2 className="section__title">
            セルトレの車買取<span className="u">3つの魅力</span>
          </h2>
          <div className="merits" style={{ marginTop: 28 }}>
            <div className="merit">
              <div className="merit__no">1</div>
              <div>
                <h3>どんな車でも査定・買取に挑戦！</h3>
                <p>
                  海外へ中古車を輸出するTCVにより、様々な日本の中古車を販売・パーツや資源として買取を実現。多種多様な買取店・引取り業者との連携で、他社にはできない挑戦的な査定を実現しています。（事故・水没車 / 10万km以上 / 故障車もOK）
                </p>
              </div>
            </div>
            <div className="merit">
              <div className="merit__no">2</div>
              <div>
                <h3>来店不要で、ラクラク車買取</h3>
                <p>
                  査定からご契約まで来店は一切不要。売却や廃車が初めての方でも電話で楽々対応が可能です。お断りするのも自由ですのでお気軽にお問い合わせください。
                </p>
              </div>
            </div>
            <div className="merit">
              <div className="merit__no">3</div>
              <div>
                <h3>査定依頼は完全無料！</h3>
                <p>
                  47都道府県どこでも査定にお伺いします。お問い合わせ手続きは無料で、書類作成や提出などの余計な手間も一切不要です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase strengthening */}
      <section className="section section--cream">
        <div className="container">
          <h2 className="section__title">
            こちらの車を<span className="u">買取強化中</span>!!
          </h2>
          <div className="purchase-grid" style={{ marginTop: 24 }}>
            {PURCHASE.map((p) => (
              <div className="purchase-item" key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.name} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--white">
        <div className="container">
          <h2 className="section__title">
            よくある<span className="u">質問</span>
          </h2>
          <div className="faq" style={{ marginTop: 24 }}>
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <p>事故車や動かない車でもOK！愛車を一番高く売ろう！</p>
          <a className="cta-btn" href="#form">
            <small>無料</small>今すぐ査定依頼
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div>中古車や廃車の買取・査定ならセルトレ SELL AND TRADE</div>
          <div className="site-footer__copy">
            © SELL AND TRADE (clone). Demo for educational purposes.
          </div>
        </div>
      </footer>
    </>
  );
}
