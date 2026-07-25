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

export default async function Home() {
  const applications = await getApplications();

  return (
    <>
      <WelcomeModal />

      {/* Header */}
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="brand">
            <div className="brand__mark">🐫</div>
            <div>
              <div className="brand__name">セルトレ</div>
              <div className="brand__sub">SELL AND TRADE</div>
            </div>
          </div>
          <div className="header__badge">東証プライム上場グループ運営</div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="hero__eyebrow">まずはご相談ください</span>
            <h1>
              動かない車も<span className="accent">高価買取</span>に挑戦
              <br />中古車・事故車・廃車の査定なら
            </h1>
            <p className="hero__lead">
              海外輸出サービスTCVと多数の買取店との連携で、他社にはできない挑戦的な査定を実現します。
            </p>
            <div className="hero__badges">
              <div className="hero__badge"><strong>どんな車</strong>でもOK</div>
              <div className="hero__badge"><strong>来店</strong>不要</div>
              <div className="hero__badge"><strong>査定</strong>完全無料</div>
            </div>
          </div>
          <div className="hero__car"><span>🚗</span></div>
        </div>
      </section>

      {/* Form */}
      <div className="container formwrap" id="form">
        <div className="formcard">
          <AppraisalForm />
        </div>
      </div>

      {/* Steps */}
      <section className="section">
        <div className="container">
          <h2 className="section__title">「オールインワン査定」で<span className="u">楽々売却</span>！</h2>
          <p className="section__desc">不要な手間は一切無し！ラクラク3ステップでカンタン・安心査定</p>
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

      {/* CTA */}
      <section className="cta-strip">
        <div className="container">
          <p>1社だけ見積もるよりお得！比較するだけで高額査定のチャンス</p>
          <a className="btn-cta" href="#form"><small>無料</small>今すぐ査定依頼</a>
        </div>
      </section>

      {/* Applications ticker (from database) */}
      <section className="section section--tint">
        <div className="container">
          <h2 className="section__title">全国から<span className="u">お申し込み</span>が続々！</h2>
          <p className="section__desc">既にたくさんのお客様にご利用いただいております</p>
          <div className="appboard">
            <div className="appboard__row head">
              <div>お申込み</div>
              <div>都道府県</div>
              <div>車種名</div>
            </div>
            <div className="appboard__scroll">
              {applications.length === 0 && (
                <div className="appboard__row">
                  <div colSpan={3}>データがありません（seed を実行してください）</div>
                </div>
              )}
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
      <section className="section">
        <div className="container">
          <h2 className="section__title">査定<span className="u">実績</span>について</h2>
          <p className="section__desc">走行可能な車両の事例での査定額をご紹介</p>
          <div className="results">
            {APPRAISAL_RESULTS.map((r) => (
              <div className="resultcard" key={r.title}>
                <h3>{r.title}</h3>
                <div className="resultcard__spec">
                  年式: {r.year} ／ 走行距離: {r.mileage} ／ 本人想定額: {r.expect}
                </div>
                <ul className="resultcard__offers">
                  {r.offers.map((o) => (<li key={o}>{o}</li>))}
                </ul>
                <p className="resultcard__review">{r.review}</p>
              </div>
            ))}
          </div>
          <p className="hint" style={{ textAlign: "center", marginTop: 16 }}>
            ※弊社実施アンケート回答からの抜粋となり、条件・状態により実際の価格は異なります。
          </p>
        </div>
      </section>

      {/* Merits */}
      <section className="section section--tint">
        <div className="container">
          <h2 className="section__title">セルトレの車買取<span className="u">3つの魅力</span></h2>
          <div className="merits" style={{ marginTop: 32 }}>
            <div className="merit">
              <div className="merit__no">1</div>
              <div>
                <h3>どんな車でも査定・買取に挑戦！</h3>
                <p>海外へ中古車を輸出するTCVにより、様々な日本の中古車を販売・パーツや資源として買取を実現。多種多様な買取店・引取り業者との連携で、他社にはできない挑戦的な査定を実現しています。（事故・水没車 / 10万km以上 / 故障車もOK）</p>
              </div>
            </div>
            <div className="merit">
              <div className="merit__no">2</div>
              <div>
                <h3>来店不要で、ラクラク車買取</h3>
                <p>査定からご契約まで来店は一切不要。売却や廃車が初めての方でも電話で楽々対応が可能です。お断りするのも自由ですのでお気軽にお問い合わせください。</p>
              </div>
            </div>
            <div className="merit">
              <div className="merit__no">3</div>
              <div>
                <h3>査定依頼は完全無料！</h3>
                <p>47都道府県どこでも査定にお伺いします。お問い合わせ手続きは無料で、書類作成や提出などの余計な手間も一切不要です。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <h2 className="section__title">よくある<span className="u">質問</span></h2>
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

      {/* Final CTA */}
      <section className="cta-strip">
        <div className="container">
          <p>事故車や動かない車でもOK！愛車を一番高く売ろう！</p>
          <a className="btn-cta" href="#form"><small>無料</small>今すぐ査定依頼</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__grid">
            <span>中古車や廃車の買取・査定ならセルトレ</span>
            <span>SELL AND TRADE</span>
            <span>利用規約</span>
            <span>プライバシーポリシー</span>
            <span>お問い合わせ</span>
          </div>
          <div className="site-footer__copy">
            © SELL AND TRADE (clone). This is a demo clone for educational purposes.
          </div>
        </div>
      </footer>
    </>
  );
}
