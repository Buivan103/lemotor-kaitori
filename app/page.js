import { getApplications } from "@/lib/car-data";
import { APPRAISAL_RESULTS, APPEALS, FAQS } from "@/lib/constants";
import AppraisalForm from "./components/AppraisalForm";
import WelcomeModal from "./components/WelcomeModal";

/** Keep お申込み date (= today JST) fresh without full force-dynamic. */
export const revalidate = 300;

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(dt);
  const month = parts.find((p) => p.type === "month")?.value || "01";
  const day = parts.find((p) => p.type === "day")?.value || "01";
  return `${month}/${day}`;
}

const PURCHASE = [
  { src: "/assets/icons/purchase01.jpeg", name: "IST" },
  { src: "/assets/icons/purchase02.jpeg", name: "Harrier" },
  { src: "/assets/icons/purchase06.jpeg", name: "Land Cruiser Prado" },
  { src: "/assets/icons/purchase-truck.jpg", name: "エルフ（トラック）" },
  { src: "/assets/icons/purchase-dump.jpg", name: "ダンプ" },
  { src: "/assets/icons/purchase-excavator.jpg", name: "油圧ショベル" },
];

export default async function Home() {
  const applications = getApplications(30);

  return (
    <>
      <WelcomeModal />

      <p className="topbar">
        中古車や廃車の買取・査定なら<strong>Le Motor</strong>
      </p>

      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="site-header__logo"
              src="/assets/lemotor/logo.png"
              alt="Le Motor"
            />
            <p className="site-header__catch">
              事故車・水没車・不動車も対応
            </p>
          </div>
          <div className="site-header__sponsors">
            <a className="site-header__call" href="tel:09091563524">
              <span className="site-header__call-label">お電話でご相談</span>
              <span className="site-header__call-number">📞 090-9156-3524</span>
            </a>
          </div>
        </div>
      </header>

      <div className="mobile-fixed-footer home-hide-on-result">
        <a className="mobile-fixed-footer__cta" href="#form">
          <span className="mobile-fixed-footer__bubble">
            対象者全員にキャッシュバック2,000円！
          </span>
          <span className="mobile-fixed-footer__main">
            <small>無料</small>
            今すぐ査定依頼
          </span>
        </a>
      </div>

      {/* Keyvisual + good-deal — sell.tc-v.com mobile structure */}
      <div className="hero-block home-hide-on-result">
        <picture>
          <source
            media="(max-width: 820px)"
            srcSet="/assets/keyvisual/lemotor_banner_sp.jpg"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="kv__img"
            src="/assets/keyvisual/lemotor_banner_pc.jpg"
            alt="最短29秒！！あなたの愛車を1番高く売ろう！ — Le Motor"
            width={2560}
            height={800}
          />
        </picture>

        <div className="assessment-good-deal">
          <span className="assessment-good-deal__line">
            <span className="assessment-good-deal__hl">「想定以上の査定額が出た」</span>
            の声が続出の無料査定！
          </span>
          <br />
          <span className="assessment-good-deal__line">
            査定額に満足できなければ売却しなくてもOK！
          </span>
        </div>

        <div className="d-flex justify-content-center">
          <div className="good-deal-block">
            <div className="d-flex justify-content-center fs-14">
              <div className="good-deal-block__content">
                Le Motorなら
                <br />
                <span className="red-notice">丁寧に直接査定！</span>
              </div>
              <div className="good-deal-block__content">
                申し込み後すぐに
                <br />
                <span className="red-notice">相場額</span>
                がわかる！
              </div>
              <div className="good-deal-block__content">
                WEBで簡単に
                <br />
                <span className="red-notice">愛車の相場額をチェック！</span>
              </div>
            </div>
            <div className="good-deal-block__note mb-1">
              ※表示の相場は目安であり、査定額の保証はできかねます。
            </div>
          </div>
        </div>
      </div>

      <div className="campaign">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/campaign/lemotor_cashback.png"
          alt="対象者全員 査定＆売却後にアンケートに答えるだけでキャッシュバック2,000円分がもらえる！ Le Motorからの申込限定"
        />
      </div>

      <div className="form-titlebar home-hide-on-result" id="form">
        <h2>買取・査定をする車両の情報を入力ください</h2>
      </div>

      <div className="form-area">
        <AppraisalForm />
      </div>

      <div className="home-hide-on-result">
      <section className="process" id="process">
        <div className="process__header">
          <h2>「かんたん無料査定」で楽々売却！</h2>
          <p className="process__subtitle">
            不要な手間は一切無し！
            <br className="process__br-mobile" />
            ラクラク3ステップでカンタン・安心査定
          </p>
        </div>
        <div className="process__assessed">
          <div className="assessed-info">
            <div className="assessed-info__icons">
              <div className="assessed-content assessed-content--watch" />
              <div className="assessed-content assessed-content--board arrow-board" />
              <div className="assessed-content assessed-content--phone arrow-phone" />
            </div>
            <div className="assessed-info__messages">
              <div className="step-message">
                <div className="step-message__badge">
                  <span>STEP 1</span>
                </div>
                <p className="step-message__body">車両情報・本人情報の入力</p>
                <p className="step-message__footer">
                  ※車検証をご用意いただくとスムーズです
                </p>
              </div>
              <div className="step-message">
                <div className="step-message__badge">
                  <span>STEP 2</span>
                </div>
                <p className="step-message__body">車両状況に合わせた査定依頼</p>
                <p className="step-message__footer">※廃車も含めたご提案を実現</p>
              </div>
              <div className="step-message">
                <div className="step-message__badge">
                  <span>STEP 3</span>
                </div>
                <p className="step-message__body">査定額のご連絡</p>
                <p className="step-message__footer">
                  ※車両状況・時間帯によっては多少お時間をいただく場合がございます。
                </p>
              </div>
            </div>
          </div>
          <div className="process__cta">
            <a className="process__cta-btn" href="#form">
              <span className="process__cta-main">
                <small>無料</small>
                今すぐ査定依頼
              </span>
            </a>
          </div>
          <div className="process__campaign">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/campaign/lemotor_cashback.png"
              alt="対象者全員 キャッシュバック2,000円分がもらえる！ Le Motorからの申込限定"
            />
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="section-head">
          <h2>全国からお申し込みが続々！</h2>
        </div>
        <div className="container section__body">
          <p className="section__desc">既にたくさんのお客様にご利用いただいております</p>
          <div className="appboard">
            <div className="appboard__row head">
              <div>お申込み</div>
              <div>都道府県</div>
              <div>車種名</div>
            </div>
            <div
              className="appboard__viewport"
              style={{ "--rows": Math.min(applications.length, 30) }}
            >
              <div className="appboard__track">
                {[...applications, ...applications].map((a, i) => (
                  <div className="appboard__row" key={`${a.id}-${i}`}>
                    <div>{formatDate(a.appliedOn)}</div>
                    <div>{a.prefecture}</div>
                    <div>{a.carName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream" id="results">
        <div className="section-head">
          <h2>査定実績について</h2>
        </div>
        <div className="container section__body">
          <p className="section__desc">
            Le Motorが直接査定した事例です。想定額と実際の査定額をあわせてご紹介します。
          </p>
          <div className="results">
            {APPRAISAL_RESULTS.map((r) => (
              <article className="resultcard" key={r.id}>
                <div className="resultcard__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="resultcard__car"
                    src={r.image}
                    alt={r.carName}
                  />
                  <span className="resultcard__tag">{r.tag}</span>
                </div>

                <div className="resultcard__body">
                  <div className="resultcard__meta">
                    <span className="resultcard__area">{r.area}</span>
                    <h3>{r.carName}</h3>
                    <ul className="resultcard__chips" aria-label="車両スペック">
                      <li>{r.year}</li>
                      <li>
                        {r.distanceLabel} {r.mileage}
                      </li>
                    </ul>
                  </div>

                  <div className="resultcard__compare" aria-label="査定額の比較">
                    <div className="resultcard__col">
                      <span className="resultcard__col-label">ご本人の想定</span>
                      <span className="resultcard__col-value">{r.expect}</span>
                    </div>
                    <span className="resultcard__arrow" aria-hidden="true">
                      →
                    </span>
                    <div className="resultcard__col resultcard__col--accent">
                      <span className="resultcard__col-label">Le Motor査定</span>
                      <span className="resultcard__col-value">{r.appraise}</span>
                    </div>
                  </div>

                  {Number(r.upAmount) > 0 && (
                    <p className="resultcard__delta">
                      想定より{" "}
                      <strong>
                        {r.upAmount}
                        <span>万円</span>
                      </strong>{" "}
                      UP
                    </p>
                  )}

                  <blockquote className="resultcard__quote">
                    <p>{r.review}</p>
                    <footer>— {r.reviewer}</footer>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
          <p className="results__note">
            ※金額は一例です。車両の状態・時期により実際の査定額は異なります。
            <br />
            ※車の画像はイメージです。実際の査定車両とは異なります。
          </p>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <p>無料・簡単入力！Le Motorが直接査定いたします</p>
          <a className="cta-btn" href="#form">
            <small>無料</small>今すぐ査定依頼
          </a>
        </div>
      </section>

      <section className="appeal-section">
        <div className="appeal-section__header">
          <h2>Le Motorの車買取3つの魅力</h2>
        </div>
        <div className="appeals">
          {APPEALS.map((a) => (
            <article className="appeal" key={a.no}>
              <div className="appeal__inner">
                <div className="appeal__content">
                  <h3 className="appeal__title">
                    <span className="appeal__no" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="35"
                        viewBox="0 0 32 35"
                      >
                        <path d="M0,35V0H32V35L16,27.575,0,35Z" fill="#c31731" />
                        <text
                          x="16"
                          y="22"
                          fill="#fff"
                          fontSize="19"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {a.no}
                        </text>
                      </svg>
                    </span>
                    {a.title}
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="appeal__image" src={a.image} alt="" />
                  <p className="appeal__text">{a.body}</p>
                  {a.okVisual ? (
                    <div className="appeal-ok">
                      <div className="appeal-ok__visual">
                        <span className="appeal-ok__bubble appeal-ok__bubble--tl">
                          10万km
                          <br />
                          以上
                        </span>
                        <span className="appeal-ok__bubble appeal-ok__bubble--ml">
                          事故
                          <br />
                          水没車
                        </span>
                        <span className="appeal-ok__bubble appeal-ok__bubble--tr">
                          故障車
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="appeal-ok__car"
                          src={a.okVisual.image}
                          alt="どんな状態でもOK"
                        />
                      </div>
                      <h4 className="appeal-ok__title">{a.okVisual.title}</h4>
                      <p className="appeal-ok__note">{a.okVisual.note}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <p>事故車や動かない車でもOK！
          <br />
          愛車を一番高く売ろう！</p>
          <a className="cta-btn" href="#form">
            <small>無料</small>今すぐ査定依頼
          </a>
        </div>
      </section>

      <section className="easy-start">
        <div className="easy-start__inner">
          <div className="easy-start__label">
            <span className="easy-start__label-icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/bumper.png" alt="" />
            </span>
            <p className="easy-start__label-text">初めての方でも安心・簡単！</p>
          </div>
          <div className="easy-start__list">
            <div className="easy-start__item">
              <span className="easy-start__check" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12.414 9.789"
                >
                  <path
                    d="M6.9,12.225,4.275,9.6l-.875.875,3.5,3.5,7.5-7.5L13.525,5.6Z"
                    transform="translate(-2.693 -4.893)"
                    fill="#238b10"
                    stroke="#238b15"
                    strokeWidth="1"
                  />
                </svg>
              </span>
              <p>
                下取りより
                <span className="easy-start__em">お得な買取査定</span>
                、廃車なら
                <span className="easy-start__em">高額買取</span>
                に挑戦！
              </p>
            </div>
            <div className="easy-start__item">
              <span className="easy-start__check" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12.414 9.789"
                >
                  <path
                    d="M6.9,12.225,4.275,9.6l-.875.875,3.5,3.5,7.5-7.5L13.525,5.6Z"
                    transform="translate(-2.693 -4.893)"
                    fill="#238b10"
                    stroke="#238b15"
                    strokeWidth="1"
                  />
                </svg>
              </span>
              <p>
                <span className="easy-start__em">水没車・事故車・動かない車</span>
                も含めて買取査定に挑戦！
              </p>
            </div>
            <div className="easy-start__item">
              <span className="easy-start__check" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12.414 9.789"
                >
                  <path
                    d="M6.9,12.225,4.275,9.6l-.875.875,3.5,3.5,7.5-7.5L13.525,5.6Z"
                    transform="translate(-2.693 -4.893)"
                    fill="#238b10"
                    stroke="#238b15"
                    strokeWidth="1"
                  />
                </svg>
              </span>
              <p>車両・車種による買取相場目安情報も掲載！</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="section-head">
          <h2>こちらの車を買取強化中!!</h2>
        </div>
        <div className="container section__body">
          <div className="purchase-grid">
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

      <section className="goal">
        <div className="header-title">
          <div className="header-title__title">
            <h2 id="goal">「買取れない車ゼロ」を目指して</h2>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="goal__wrapper">
            <ul className="goal__title">
              <li>「車種・状態によっては買い取れない」</li>
              <li>「廃車の申し込みをしないといけない」</li>
            </ul>
            <p className="goal__text">
              そんな不満を解消する「Le Motor」は、どんな状態でも査定に向き合っています。あなたの愛車を世界のどこかで、誰かに使ってもらうため。私たちは、全力で安心・安全な買取をご提供します。
            </p>
          </div>
        </div>
      </section>

      <section className="section section--cream" id="faq-contact">
        <div className="section-head">
          <h2>よくある質問</h2>
        </div>
        <div className="container section__body">
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div>{f.a}</div>
              </details>
            ))}
          </div>

          <div className="contact-panel">
            <h3>お問い合わせ</h3>
            <p>査定・買取・販売・修理について、お気軽にご相談ください。</p>
            <div className="contact-panel__links">
              <a className="contact-link contact-link--tel" href="tel:09091563524">
                <span className="contact-link__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2Z" />
                  </svg>
                </span>
                090-9156-3524
              </a>
              <a
                className="contact-link contact-link--mail"
                href="mailto:lemotor.jp@gmail.com"
              >
                <span className="contact-link__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
                  </svg>
                </span>
                lemotor.jp@gmail.com
              </a>
              <a
                className="contact-link contact-link--facebook"
                href="https://www.facebook.com/B%C3%A1n-oto-c%C5%A9-t%E1%BA%A1i-nh%E1%BA%ADt-1505521209494167"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.85c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.19 2.12.19v2.33h-1.2c-1.18 0-1.55.74-1.55 1.49v1.79h2.64l-.42 2.9h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
                  </svg>
                </span>
                <span className="contact-link__text">Facebookでお問い合わせ</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <p>事故車や動かない車でもOK！
          <br />
          愛車を一番高く売ろう！</p>
          <a className="cta-btn" href="#form">
            <small>無料</small>今すぐ査定依頼
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <nav className="site-footer__menu" aria-label="フッターメニュー">
            <a
              href="https://www.carsensor.net/shop/saitama/331266001/#contents"
              target="_blank"
              rel="noreferrer"
            >
              会社概要
            </a>
            <a href="#faq-contact">よくある質問・お問合せ</a>
          </nav>

          <div className="site-footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lemotor/logo.png" alt="Le Motor" />
            <div>
              <strong>Le Motor</strong>
              <div>中古車の買取・販売・修理・整備</div>
              <p className="site-footer__desc">
                中古トラック（ダンプ、バス、積載車、トレーラー、パッカー車など）の買取にも対応。
                買取・売却相場のお見積もりもお気軽にご相談ください。
              </p>
              <a href="tel:09091563524">TEL: 090-9156-3524</a>
              <a href="mailto:lemotor.jp@gmail.com">Email: lemotor.jp@gmail.com</a>
              <a
                href="https://www.facebook.com/B%C3%A1n-oto-c%C5%A9-t%E1%BA%A1i-nh%E1%BA%ADt-1505521209494167"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
          <div className="site-footer__copy">
            © Le Motor. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
