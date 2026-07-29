"use client";

import { useEffect, useRef, useState } from "react";
import {
  YEARS,
  MILEAGES,
  CAR_STATUS,
  SELLING_TIME,
  PREFECTURE_REGIONS,
  GRADES,
  COLORS,
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_USAGE,
  COMMERCIAL_YEARS,
  PREFECTURES,
} from "@/lib/constants";
import { isValidJapanesePhone, normalizeJapanesePhone } from "@/lib/phone";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { readWelcomeIntent } from "./WelcomeModal";

const empty = {
  vehicleKind: "passenger", // passenger | commercial
  makerCode: "",
  makerName: "",
  modelCode: "",
  modelName: "",
  commercialCategory: "",
  chassisModel: "",
  year: "",
  yearLabel: "",
  grade: "",
  mileage: "",
  color: "",
  colorLabel: "",
  carStatus: 1,
  sellingTime: 3,
  lastName: "",
  firstName: "",
  prefecture: "",
  city: "",
  zipcode: "",
  email: "",
  tel: "",
  contactTime: "",
  website: "", // honeypot — must stay empty
  _startedAt: 0, // anti-bot timing token (set on mount)
  welcomeIntent: "", // from WelcomeModal: 不要な車がある | 乗換を検討中 | 提案は必要ない
};

const WIZARD_STEPS = ["maker", "model", "year", "grade", "mileage", "color"];
const WIZARD_TITLES = {
  maker: "メーカーを選択",
  model: "車種を選択",
  year: "年式を選択",
  grade: "グレードを選択",
  mileage: "走行距離を選択",
  color: "車体色を選択",
};

const COMMERCIAL_WIZARD_STEPS = ["category", "year", "usage", "pref"];
const COMMERCIAL_WIZARD_TITLES = {
  category: "車種を選択",
  year: "年式を選択",
  usage: "走行距離 / 稼働時間を選択",
  pref: "都道府県を選択",
};

/** Full-screen step-by-step car picker (sell.tc-v.com mobile #form-car). */
function CarWizard({
  open,
  step,
  onClose,
  onBack,
  form,
  makers,
  models,
  otherDomesticOpen,
  setOtherDomesticOpen,
  onPickMaker,
  onPickModel,
  onPickYear,
  onPickGrade,
  onPickMileage,
  onPickColor,
}) {
  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  if (!open) return null;

  const primaryDomestic = makers.domestic.slice(0, 9);
  const otherDomestic = makers.domestic.slice(9);
  const title = WIZARD_TITLES[step] || "";
  const canBack = step !== "maker";

  return (
    <div className="picker-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="picker-modal__header">
        {canBack && (
          <button type="button" className="picker-modal__back" onClick={onBack} aria-label="戻る">
            ‹
          </button>
        )}
        <div className="picker-modal__title">{title}</div>
        <button type="button" className="picker-modal__close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>
      <div className="picker-modal__body">
        {step === "maker" && (
          <>
            <div className="picker-section">
              <div className="picker-section__title">国産車</div>
              <ul className="picker-list">
                {primaryDomestic.map((m) => (
                  <li key={m.code}>
                    <button
                      type="button"
                      className={
                        "picker-list__item" + (form.makerCode === m.code ? " is-selected" : "")
                      }
                      onClick={() => onPickMaker(m.code)}
                    >
                      <span>{m.name}</span>
                      {form.makerCode === m.code && (
                        <span className="picker-list__check" aria-hidden>✓</span>
                      )}
                    </button>
                  </li>
                ))}
                {otherDomestic.length > 0 && (
                  <li>
                    <button
                      type="button"
                      className="picker-list__item picker-list__item--toggle"
                      onClick={() => setOtherDomesticOpen((v) => !v)}
                      aria-expanded={otherDomesticOpen}
                    >
                      <span>その他国産車</span>
                      <span className="picker-list__plus">{otherDomesticOpen ? "−" : "+"}</span>
                    </button>
                    {otherDomesticOpen && (
                      <ul className="picker-list picker-list--nested">
                        {otherDomestic.map((m) => (
                          <li key={m.code}>
                            <button
                              type="button"
                              className={
                                "picker-list__item" +
                                (form.makerCode === m.code ? " is-selected" : "")
                              }
                              onClick={() => onPickMaker(m.code)}
                            >
                              <span>{m.name}</span>
                              {form.makerCode === m.code && (
                                <span className="picker-list__check" aria-hidden>✓</span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
            <div className="picker-section">
              <div className="picker-section__title">輸入車</div>
              <ul className="picker-list">
                {makers.imported.map((m) => (
                  <li key={m.code}>
                    <button
                      type="button"
                      className={
                        "picker-list__item" + (form.makerCode === m.code ? " is-selected" : "")
                      }
                      onClick={() => onPickMaker(m.code)}
                    >
                      <span>{m.name}</span>
                      {form.makerCode === m.code && (
                        <span className="picker-list__check" aria-hidden>✓</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {step === "model" && (
          <div className="picker-section">
            <div className="picker-section__title">{form.makerName || "車種"}</div>
            <ul className="picker-list">
              {models.length === 0 && (
                <li className="picker-list__empty">車種を読み込み中…</li>
              )}
              {models.map((m) => (
                <li key={m.code}>
                  <button
                    type="button"
                    className={
                      "picker-list__item" + (form.modelCode === m.code ? " is-selected" : "")
                    }
                    onClick={() => onPickModel(m.code)}
                  >
                    <span>{m.name}</span>
                    {form.modelCode === m.code && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "year" && (
          <div className="picker-section">
            <ul className="picker-list">
              {YEARS.map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    className={
                      "picker-list__item" + (form.yearLabel === y ? " is-selected" : "")
                    }
                    onClick={() => onPickYear(y)}
                  >
                    <span>{y}</span>
                    {form.yearLabel === y && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "grade" && (
          <div className="picker-section">
            <div className="picker-section__title">
              {form.makerName} {form.modelName}
              <span className="picker-section__note"> 不明の場合は「不明」でOK</span>
            </div>
            <ul className="picker-list">
              {GRADES.map((g) => (
                <li key={g}>
                  <button
                    type="button"
                    className={"picker-list__item" + (form.grade === g ? " is-selected" : "")}
                    onClick={() => onPickGrade(g)}
                  >
                    <span>{g}</span>
                    {form.grade === g && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "mileage" && (
          <div className="picker-section">
            <ul className="picker-list">
              {MILEAGES.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    className={"picker-list__item" + (form.mileage === m ? " is-selected" : "")}
                    onClick={() => onPickMileage(m)}
                  >
                    <span>{m}</span>
                    {form.mileage === m && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "color" && (
          <div className="picker-section">
            <div className="picker-section__title">
              車体色<span className="picker-section__note"> 近しい色を選んでください</span>
            </div>
            <div className="color-grid">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={
                    "color-grid__item" + (form.color === c.value ? " is-selected" : "")
                  }
                  onClick={() => onPickColor(c)}
                >
                  <span
                    className="color-grid__swatch"
                    style={{
                      background: c.swatch,
                      border: c.border ? "1px solid #ccc" : undefined,
                    }}
                  />
                  <span className="color-grid__label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Full-screen commercial vehicle picker (same UX as passenger CarWizard). */
function CommercialWizard({
  open,
  step,
  onClose,
  onBack,
  form,
  onPickCategory,
  onPickYear,
  onPickUsage,
  onPickPref,
}) {
  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  if (!open) return null;

  const title = COMMERCIAL_WIZARD_TITLES[step] || "";
  const canBack = step !== "category";

  return (
    <div className="picker-modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="picker-modal__header">
        {canBack && (
          <button type="button" className="picker-modal__back" onClick={onBack} aria-label="戻る">
            ‹
          </button>
        )}
        <div className="picker-modal__title">{title}</div>
        <button type="button" className="picker-modal__close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>
      <div className="picker-modal__body">
        {step === "category" && (
          <div className="picker-section">
            <ul className="picker-list">
              {COMMERCIAL_CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    className={
                      "picker-list__item" +
                      (form.commercialCategory === c ? " is-selected" : "")
                    }
                    onClick={() => onPickCategory(c)}
                  >
                    <span>{c}</span>
                    {form.commercialCategory === c && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "year" && (
          <div className="picker-section">
            <ul className="picker-list">
              {COMMERCIAL_YEARS.map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    className={
                      "picker-list__item" + (form.yearLabel === y ? " is-selected" : "")
                    }
                    onClick={() => onPickYear(y)}
                  >
                    <span>{y}</span>
                    {form.yearLabel === y && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "usage" && (
          <div className="picker-section">
            <div className="picker-section__title">
              走行距離または稼働時間
              <span className="picker-section__note"> 近いものを選んでください</span>
            </div>
            <ul className="picker-list">
              {COMMERCIAL_USAGE.map((u) => (
                <li key={u}>
                  <button
                    type="button"
                    className={
                      "picker-list__item" + (form.mileage === u ? " is-selected" : "")
                    }
                    onClick={() => onPickUsage(u)}
                  >
                    <span>{u}</span>
                    {form.mileage === u && (
                      <span className="picker-list__check" aria-hidden>✓</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "pref" && (
          <div className="picker-section">
            {PREFECTURE_REGIONS.map((region) => (
              <div key={region.title}>
                <div className="picker-section__title">{region.title}</div>
                <ul className="picker-list">
                  {region.items.map((p) => (
                    <li key={p}>
                      <button
                        type="button"
                        className={
                          "picker-list__item" +
                          (form.prefecture === p ? " is-selected" : "")
                        }
                        onClick={() => onPickPref(p)}
                      >
                        <span>{p}</span>
                        {form.prefecture === p && (
                          <span className="picker-list__check" aria-hidden>✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PickerTrigger({ value, placeholder = "選択してください", disabled, onClick }) {
  return (
    <button
      type="button"
      className={
        "control control--picker" +
        (disabled ? " is-disabled" : "") +
        (value ? " has-value" : "")
      }
      disabled={disabled}
      onClick={onClick}
    >
      <span>{value || placeholder}</span>
    </button>
  );
}

export default function AppraisalForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    ...empty,
    _startedAt: Date.now(),
  }));
  const [makers, setMakers] = useState({ domestic: [], imported: [] });
  const [models, setModels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const [error, setError] = useState("");
  const [wizardStep, setWizardStep] = useState(null);
  const [commercialWizardStep, setCommercialWizardStep] = useState(null);
  const [otherDomesticOpen, setOtherDomesticOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [addressMode, setAddressMode] = useState("prefCity"); // prefCity | zip
  const [addressPicker, setAddressPicker] = useState(null); // pref | city | null
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [zipError, setZipError] = useState("");

  useEffect(() => {
    fetch("/api/makers")
      .then((r) => r.json())
      .then(setMakers)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.makerCode) {
      setModels([]);
      return;
    }
    fetch(`/api/car-models?maker=${form.makerCode}`)
      .then((r) => r.json())
      .then((d) => setModels(d.models || []))
      .catch(() => setModels([]));
  }, [form.makerCode]);

  useEffect(() => {
    if (!addressPicker && !contactOpen) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [addressPicker, contactOpen]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const isCommercial = form.vehicleKind === "commercial";

  const switchVehicleKind = (kind) => {
    if (kind === form.vehicleKind) return;
    setForm({ ...empty, vehicleKind: kind, _startedAt: Date.now() });
    setStep(1);
    setWizardStep(null);
    setCommercialWizardStep(null);
    setContactOpen(false);
    setAddressPicker(null);
    setModels([]);
    setError("");
  };

  const carBasicsDone = Boolean(
    form.makerCode &&
      form.modelCode &&
      form.year &&
      form.grade &&
      form.mileage &&
      form.color
  );
  const commercialBasicsDone = Boolean(
    form.commercialCategory && form.yearLabel && form.mileage && form.prefecture
  );
  const step1Valid = isCommercial
    ? commercialBasicsDone && form.lastName && form.firstName
    : carBasicsDone &&
      form.lastName &&
      form.firstName &&
      form.prefecture &&
      form.city;
  const telValid = isValidJapanesePhone(form.tel);
  const emailValid = isValidEmail(form.email);
  const step2Valid = Boolean(emailValid && telValid);

  const carLabel = isCommercial
    ? form.commercialCategory || form.modelName || "車両"
    : form.modelName || form.makerName || "愛車";
  const resultTitle = isCommercial
    ? [form.commercialCategory, form.makerName, form.modelName]
        .filter(Boolean)
        .join(" ")
    : `${form.makerName} ${form.modelName}`.trim();
  const makerModelLabel =
    form.makerName && form.modelName
      ? `${form.makerName} ${form.modelName}`
      : form.makerName || "";

  const openWizard = (at = "maker") => setWizardStep(at);
  const openCommercialWizard = (at = "category") => setCommercialWizardStep(at);

  const commercialWizardBack = () => {
    const idx = COMMERCIAL_WIZARD_STEPS.indexOf(commercialWizardStep);
    if (idx <= 0) setCommercialWizardStep(null);
    else setCommercialWizardStep(COMMERCIAL_WIZARD_STEPS[idx - 1]);
  };

  const onPickCommercialCategory = (commercialCategory) => {
    set({
      commercialCategory,
      year: "",
      yearLabel: "",
      mileage: "",
      prefecture: "",
      city: "",
      zipcode: "",
    });
    setCommercialWizardStep("year");
  };

  const onPickCommercialYear = (label) => {
    const y = label.match(/(19|20)\d{2}/)?.[0] || "";
    set({ yearLabel: label, year: y, mileage: "", prefecture: "", city: "", zipcode: "" });
    setCommercialWizardStep("usage");
  };

  const onPickCommercialUsage = (mileage) => {
    set({ mileage, prefecture: "", city: "", zipcode: "" });
    setCommercialWizardStep("pref");
  };

  const onPickCommercialPref = (prefecture) => {
    set({ prefecture, city: "", zipcode: "" });
    setCommercialWizardStep(null);
  };

  const prefCityLabel =
    form.prefecture && form.city
      ? `${form.prefecture} ${form.city}`
      : form.prefecture || "";

  const openPrefPicker = () => setAddressPicker("pref");

  const onPickPrefecture = async (pref) => {
    set({ prefecture: pref, city: "", zipcode: "" });
    setCities([]);
    setCitiesLoading(true);
    setAddressPicker("city");
    try {
      const res = await fetch(`/api/cities?prefecture=${encodeURIComponent(pref)}`);
      const data = await res.json();
      setCities(data.cities || []);
    } catch {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  };

  const onPickCity = (city) => {
    set({ city });
    setAddressPicker(null);
  };

  const onZipcodeChange = async (raw) => {
    const zip = raw.replace(/\D/g, "").slice(0, 7);
    set({ zipcode: zip });
    setZipError("");
    if (zip.length < 7) return;
    try {
      const res = await fetch(`/api/zipcode?zipcode=${zip}`);
      const data = await res.json();
      if (!data.ok) {
        setZipError(
          data.error === "not_found"
            ? "郵便番号は存在しません。"
            : "郵便番号を確認してください。"
        );
        return;
      }
      set({
        prefecture: data.prefecture || "",
        city: data.city || "",
        zipcode: data.zipcode || zip,
      });
    } catch {
      setZipError("郵便番号の取得に失敗しました。");
    }
  };

  const wizardBack = () => {
    const idx = WIZARD_STEPS.indexOf(wizardStep);
    if (idx <= 0) {
      setWizardStep(null);
      return;
    }
    setWizardStep(WIZARD_STEPS[idx - 1]);
  };

  const onPickMaker = (code) => {
    const all = [...makers.domestic, ...makers.imported];
    const m = all.find((x) => x.code === code);
    setModels([]);
    set({
      makerCode: code,
      makerName: m?.name || "",
      modelCode: "",
      modelName: "",
      year: "",
      yearLabel: "",
      grade: "",
      mileage: "",
      color: "",
      colorLabel: "",
    });
    setWizardStep("model");
  };

  const onPickModel = (code) => {
    const m = models.find((x) => x.code === code);
    set({
      modelCode: code,
      modelName: m?.name || "",
      year: "",
      yearLabel: "",
      grade: "",
      mileage: "",
      color: "",
      colorLabel: "",
    });
    setWizardStep("year");
  };

  const onPickYear = (label) => {
    set({
      yearLabel: label,
      year: label.match(/^\d{4}/)?.[0] || label,
      grade: "",
      mileage: "",
      color: "",
      colorLabel: "",
    });
    setWizardStep("grade");
  };

  const onPickGrade = (grade) => {
    set({ grade, mileage: "", color: "", colorLabel: "" });
    setWizardStep("mileage");
  };

  const onPickMileage = (mileage) => {
    set({ mileage, color: "", colorLabel: "" });
    setWizardStep("color");
  };

  const onPickColor = (c) => {
    set({ color: c.value, colorLabel: c.label });
    setWizardStep(null); // back to main form
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...form,
        welcomeIntent: form.welcomeIntent || readWelcomeIntent(),
      };
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました。");
        return;
      }
      // Close overlay first so the result at #form is visible (not buried under home).
      setContactOpen(false);
      setAddressPicker(null);
      setWizardStep(null);
      setResult(data);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.classList.toggle("is-result-view", Boolean(result));
    return () => document.body.classList.remove("is-result-view");
  }, [result]);

  useEffect(() => {
    if (!result) return;
    const id = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [result]);

  if (result) {
    return (
      <div className="result" ref={resultRef}>
        <p className="result__badge">査定依頼を受け付けました</p>

        <div className="result__card">
          <p className="result__car">
            {resultTitle}
            {form.yearLabel ? `（${form.yearLabel}）` : ""}
          </p>
          <p className="result__label">
            {isCommercial
              ? "＼ あなたの車両の相場価格 ／"
              : "＼ あなたの愛車の相場価格 ／"}
          </p>
          <p className="result__price">
            <b>{result.estimate.min}</b>
            <span className="result__tilde">〜</span>
            <b>{result.estimate.max}</b>
            <span className="result__unit">万円</span>
          </p>
          <p className="result__note">
            ※当社にて独自算出した相場価格です。買取価格を保証するものではありません。
          </p>
        </div>

        <p className="result__lead">担当より順次ご連絡いたします。</p>

        {isCommercial && (
          <div className="result__line">
            <p className="result__line-badge">法人・トラックのご相談</p>
            <h3 className="result__line-title">LINEでお問い合わせ</h3>
            <p className="result__line-text">
              QRから友だち追加のうえ、車両写真をお送りください。
              <br />
              担当よりご案内いたします。
            </p>

            <div className="result__line-samples">
              <p className="result__line-samples-label">お送りいただきたい写真の例</p>
              <ul className="result__line-samples-grid">
                {[
                  {
                    src: "/assets/line/samples/sample-2444.jpg",
                    label: "車両全体",
                    alt: "車両全体の写真例",
                  },
                  {
                    src: "/assets/line/samples/sample-2445.jpg",
                    label: "メーター",
                    alt: "メーター（稼働時間）の写真例",
                  },
                  {
                    src: "/assets/line/samples/sample-2446.jpg",
                    label: "仕様表",
                    alt: "仕様表・型式の写真例",
                  },
                ].map((item) => (
                  <li key={item.src} className="result__line-sample">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.alt} width={280} height={210} loading="lazy" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="result__line-qr-block">
              <div className="result__line-qr-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="result__line-qr"
                  src="/assets/line/qr-code.jpg"
                  alt="LINE友だち追加用QRコード"
                  width={160}
                  height={160}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const ph = e.currentTarget.nextElementSibling;
                    if (ph) ph.hidden = false;
                  }}
                />
                <div className="result__line-qr-ph" hidden>
                  <span>LINE</span>
                  <small>QRコード準備中</small>
                </div>
              </div>
              <p className="result__line-hint">スマホでQRをスキャン → 友だち追加</p>
            </div>
          </div>
        )}

        <a className="result__call" href="tel:09091563524">
          <span className="result__call-label">お急ぎの方はお電話ください</span>
          <span className="result__call-number">📞 090-9156-3524</span>
        </a>

        <button
          type="button"
          className="btn-back"
          onClick={() => {
            setForm({
              ...empty,
              vehicleKind: form.vehicleKind || "passenger",
              _startedAt: Date.now(),
            });
            setStep(1);
            setContactOpen(false);
            setResult(null);
            document.body.classList.remove("is-result-view");
            requestAnimationFrame(() => {
              document.getElementById("form")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          }}
        >
          最初からやり直す
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="form-tabs" role="tablist" aria-label="査定車両の種類">
        <button
          type="button"
          role="tab"
          aria-selected={!isCommercial}
          className={"form-tab" + (!isCommercial ? " is-active" : "")}
          onClick={() => switchVehicleKind("passenger")}
        >
          乗用車
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isCommercial}
          className={"form-tab" + (isCommercial ? " is-active" : "")}
          onClick={() => switchVehicleKind("commercial")}
        >
          トラック・重機
        </button>
      </div>

      <div className="chat-operator">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="chat-operator__img" src="/assets/icons/image_nav.png" alt="" />
        <div className="chat-operator__text">
          {isCommercial
            ? "トラック・重機も無料査定！相場をお伝えします。"
            : "29秒で入力完了！愛車の査定、承ります。"}
        </div>
      </div>

      {step === 1 && isCommercial && (
        <>
          <div className="form-row">
            <div className="form-label">
              車種
              <span className={"req" + (form.commercialCategory ? " ok" : "")}>
                {form.commercialCategory ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.commercialCategory}
              onChange={(e) =>
                set({
                  commercialCategory: e.target.value,
                  year: "",
                  yearLabel: "",
                  mileage: "",
                  prefecture: "",
                  city: "",
                  zipcode: "",
                })
              }
            >
              <option value="">選択してください</option>
              {COMMERCIAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <PickerTrigger
              value={form.commercialCategory}
              onClick={() => openCommercialWizard("category")}
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              年式
              <span className={"req" + (form.yearLabel ? " ok" : "")}>
                {form.yearLabel ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.yearLabel}
              disabled={!form.commercialCategory}
              onChange={(e) => {
                const label = e.target.value;
                const y = label.match(/(19|20)\d{2}/)?.[0] || "";
                set({
                  yearLabel: label,
                  year: y,
                  mileage: "",
                  prefecture: "",
                  city: "",
                  zipcode: "",
                });
              }}
            >
              <option value="">選択してください</option>
              {COMMERCIAL_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <PickerTrigger
              value={form.yearLabel}
              disabled={!form.commercialCategory}
              onClick={() =>
                openCommercialWizard(form.commercialCategory ? "year" : "category")
              }
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              走行距離 / 稼働時間
              <span className={"req" + (form.mileage ? " ok" : "")}>
                {form.mileage ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.mileage}
              disabled={!form.yearLabel}
              onChange={(e) =>
                set({
                  mileage: e.target.value,
                  prefecture: "",
                  city: "",
                  zipcode: "",
                })
              }
            >
              <option value="">選択してください</option>
              {COMMERCIAL_USAGE.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <PickerTrigger
              value={form.mileage}
              disabled={!form.yearLabel}
              onClick={() =>
                openCommercialWizard(form.yearLabel ? "usage" : "category")
              }
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              都道府県
              <span className={"req" + (form.prefecture ? " ok" : "")}>
                {form.prefecture ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.prefecture}
              disabled={!form.mileage}
              onChange={(e) =>
                set({ prefecture: e.target.value, city: "", zipcode: "" })
              }
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <PickerTrigger
              value={form.prefecture}
              disabled={!form.mileage}
              onClick={() =>
                openCommercialWizard(form.mileage ? "pref" : "category")
              }
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              メーカー・車名 <span className="req soft">任意</span>
            </div>
            <input
              className="control"
              placeholder="例: いすゞ エルフ / 日野 レンジャー"
              value={form.makerName}
              onChange={(e) => set({ makerName: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              型式 <span className="req soft">任意</span>
            </div>
            <input
              className="control"
              placeholder="例: NKR85"
              value={form.chassisModel}
              onChange={(e) => set({ chassisModel: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-label">
              お名前
              <span className={"req" + (form.lastName && form.firstName ? " ok" : "")}>
                {form.lastName && form.firstName ? "OK" : "必須"}
              </span>
            </div>
            <div className="name-row">
              <span>姓</span>
              <input
                className="control"
                placeholder="セイ"
                value={form.lastName}
                onChange={(e) => set({ lastName: e.target.value })}
              />
              <span>名</span>
              <input
                className="control"
                placeholder="メイ"
                value={form.firstName}
                onChange={(e) => set({ firstName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-label">
              売却希望時期 <span className="req ok">OK</span>
            </div>
            <div className="radios" role="radiogroup" aria-label="売却希望時期">
              {SELLING_TIME.map((s) => (
                <label
                  key={s.value}
                  className={"radio" + (form.sellingTime === s.value ? " on" : "")}
                >
                  <input
                    type="radio"
                    name="selling_time_commercial"
                    value={s.value}
                    checked={form.sellingTime === s.value}
                    onChange={() => set({ sellingTime: s.value })}
                  />
                  <span className="radio__text">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-submit"
              disabled={!step1Valid}
              onClick={() => setContactOpen(true)}
            >
              <span className="sub">無料</span>
              査定額を見る（連絡先へ）
            </button>
          </div>

          <CommercialWizard
            open={Boolean(commercialWizardStep)}
            step={commercialWizardStep}
            onClose={() => setCommercialWizardStep(null)}
            onBack={commercialWizardBack}
            form={form}
            onPickCategory={onPickCommercialCategory}
            onPickYear={onPickCommercialYear}
            onPickUsage={onPickCommercialUsage}
            onPickPref={onPickCommercialPref}
          />
        </>
      )}

      {step === 1 && !isCommercial && (
        <>
          {/* ===== Mobile: combined maker/model opens step-by-step wizard ===== */}
          <div className="form-row form-row--mobile-only">
            <div className="form-label">
              メーカー/車種
              <span className={"req" + (form.makerCode && form.modelCode ? " ok" : "")}>
                {form.makerCode && form.modelCode ? "OK" : "必須"}
              </span>
            </div>
            <PickerTrigger
              value={makerModelLabel}
              onClick={() => openWizard("maker")}
            />
          </div>

          {/* ===== Desktop: separate selects ===== */}
          <div className="form-row form-row--desktop-only">
            <div className="form-label">
              メーカー
              <span className={"req" + (form.makerCode ? " ok" : "")}>
                {form.makerCode ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control"
              value={form.makerCode}
              onChange={(e) => {
                const code = e.target.value;
                const all = [...makers.domestic, ...makers.imported];
                const m = all.find((x) => x.code === code);
                set({
                  makerCode: code,
                  makerName: m?.name || "",
                  modelCode: "",
                  modelName: "",
                  grade: "",
                  color: "",
                  colorLabel: "",
                });
              }}
            >
              <option value="">選択してください</option>
              <optgroup label="国産車">
                {makers.domestic.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </optgroup>
              <optgroup label="輸入車">
                {makers.imported.map((m) => (
                  <option key={m.code} value={m.code}>{m.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="form-row form-row--desktop-only">
            <div className="form-label">
              車種
              <span className={"req" + (form.modelCode ? " ok" : "")}>
                {form.modelCode ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control"
              value={form.modelCode}
              onChange={(e) => {
                const code = e.target.value;
                const m = models.find((x) => x.code === code);
                set({ modelCode: code, modelName: m?.name || "" });
              }}
              disabled={!form.makerCode}
            >
              <option value="">選択してください</option>
              {models.map((m) => (
                <option key={m.code} value={m.code}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-label">
              年式
              <span className={"req" + (form.year ? " ok" : "")}>
                {form.year ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.yearLabel}
              onChange={(e) => {
                const label = e.target.value;
                set({
                  yearLabel: label,
                  year: label.match(/^\d{4}/)?.[0] || label,
                });
              }}
            >
              <option value="">選択してください</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <PickerTrigger
              value={form.yearLabel}
              onClick={() => openWizard(form.makerCode ? "year" : "maker")}
            />
          </div>
          <div className="hint">不明の場合はだいたいでOK</div>

          <div className="form-row">
            <div className="form-label">
              グレード
              <span className={"req" + (form.grade ? " ok" : "")}>
                {form.grade ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.grade}
              onChange={(e) => set({ grade: e.target.value })}
              disabled={!form.year}
            >
              <option value="">選択してください</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <PickerTrigger
              value={form.grade}
              disabled={!form.year}
              onClick={() => openWizard(form.year ? "grade" : "maker")}
            />
          </div>
          <div className="hint">不明の場合はだいたいでOK</div>

          <div className="form-row">
            <div className="form-label">
              走行距離
              <span className={"req" + (form.mileage ? " ok" : "")}>
                {form.mileage ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.mileage}
              onChange={(e) => set({ mileage: e.target.value })}
            >
              <option value="">選択してください</option>
              {MILEAGES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <PickerTrigger
              value={form.mileage}
              onClick={() => openWizard(form.grade ? "mileage" : "maker")}
            />
          </div>
          <div className="hint">不明の場合はだいたいでOK</div>

          <div className="form-row">
            <div className="form-label">
              車体色
              <span className={"req" + (form.color ? " ok" : "")}>
                {form.color ? "OK" : "必須"}
              </span>
            </div>
            <select
              className="control control--desktop"
              value={form.color}
              onChange={(e) => {
                const c = COLORS.find((x) => x.value === e.target.value);
                set({ color: e.target.value, colorLabel: c?.label || "" });
              }}
            >
              <option value="">選択してください</option>
              {COLORS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <PickerTrigger
              value={form.colorLabel}
              onClick={() => openWizard(form.mileage ? "color" : "maker")}
            />
          </div>

          {carBasicsDone && (
            <>
              <div className="chat-operator">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="chat-operator__img" src="/assets/icons/image_nav.png" alt="" />
                <div className="chat-operator__text">
                  {carLabel}の最新の相場額をWEB上でチェックできます！
                </div>
              </div>

              <div className="form-row">
                <div className="form-label">
                  車の状態 <span className="req ok">OK</span>
                </div>
                <div className="radios" role="radiogroup" aria-label="車の状態">
                  {CAR_STATUS.map((s) => (
                    <label
                      key={s.value}
                      className={"radio" + (form.carStatus === s.value ? " on" : "")}
                    >
                      <input
                        type="radio"
                        name="car_status"
                        value={s.value}
                        checked={form.carStatus === s.value}
                        onChange={() => set({ carStatus: s.value })}
                      />
                      <span className="radio__text">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-label">
                  売却希望時期 <span className="req ok">OK</span>
                </div>
                <div className="radios" role="radiogroup" aria-label="売却希望時期">
                  {SELLING_TIME.map((s) => (
                    <label
                      key={s.value}
                      className={"radio" + (form.sellingTime === s.value ? " on" : "")}
                    >
                      <input
                        type="radio"
                        name="selling_time"
                        value={s.value}
                        checked={form.sellingTime === s.value}
                        onChange={() => set({ sellingTime: s.value })}
                      />
                      <span className="radio__text">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-label">
                  お名前
                  <span className={"req" + (form.lastName && form.firstName ? " ok" : "")}>
                    {form.lastName && form.firstName ? "OK" : "必須"}
                  </span>
                </div>
                <div className="name-row">
                  <span>姓</span>
                  <input
                    className="control"
                    placeholder="セイ"
                    value={form.lastName}
                    onChange={(e) => set({ lastName: e.target.value })}
                  />
                  <span>名</span>
                  <input
                    className="control"
                    placeholder="メイ"
                    value={form.firstName}
                    onChange={(e) => set({ firstName: e.target.value })}
                  />
                </div>
              </div>

              <div className="chat-operator">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="chat-operator__img" src="/assets/icons/image_nav.png" alt="" />
                <div className="chat-operator__text">近隣エリアの優良買取店をご紹介します！</div>
              </div>

              {addressMode === "prefCity" ? (
                <div className="form-row form-row--address">
                  <div className="form-label">
                    都道府県/市区町村
                    <span className={"req" + (form.prefecture && form.city ? " ok" : "")}>
                      {form.prefecture && form.city ? "OK" : "必須"}
                    </span>
                  </div>
                  <div className="address-field">
                    <button
                      type="button"
                      className={
                        "control control--picker-always" +
                        (prefCityLabel ? " has-value" : "")
                      }
                      onClick={openPrefPicker}
                    >
                      <span>{prefCityLabel || "選択してください"}</span>
                    </button>
                    <span className="sub-label">郵便番号が自動入力されます</span>
                  </div>
                  <button
                    type="button"
                    className="address-toggle"
                    onClick={() => {
                      setAddressMode("zip");
                      setZipError("");
                    }}
                  >
                    郵便番号で入力する
                  </button>
                </div>
              ) : (
                <div className="form-row form-row--address">
                  <div className="form-label form-label--zip">
                    <span>
                      郵便番号
                      <br />
                      (ハイフン不要)
                    </span>
                    <span className={"req" + (form.zipcode.length >= 7 && form.prefecture ? " ok" : "")}>
                      {form.zipcode.length >= 7 && form.prefecture ? "OK" : "必須"}
                    </span>
                  </div>
                  <div className="address-field">
                    <input
                      type="tel"
                      className="control"
                      inputMode="numeric"
                      maxLength={7}
                      placeholder="1000001"
                      value={form.zipcode}
                      onChange={(e) => onZipcodeChange(e.target.value)}
                    />
                    <span className="sub-label">
                      {form.prefecture && form.city
                        ? `${form.prefecture}${form.city}`
                        : "市区町村が自動入力されます"}
                    </span>
                    {zipError && <span className="sub-label sub-label--error">{zipError}</span>}
                  </div>
                  <button
                    type="button"
                    className="address-toggle"
                    onClick={() => {
                      setAddressMode("prefCity");
                      setZipError("");
                      openPrefPicker();
                    }}
                  >
                    都道府県から調べる
                  </button>
                </div>
              )}

              <button
                type="button"
                className="btn-submit"
                disabled={!step1Valid}
                onClick={() => {
                  setContactOpen(true);
                }}
              >
                <span className="sub">無料</span>
                次へ (29秒で完了)
              </button>
            </>
          )}
        </>
      )}

      {/* 連絡先 popup — sell.tc-v.com modal-tel-code */}
      {contactOpen && (
        <div className="contact-modal-overlay" role="presentation">
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-label="連絡先"
          >
            <div className="contact-modal__header">
              <div className="contact-modal__title">連絡先</div>
              <button
                type="button"
                className="contact-modal__close"
                onClick={() => setContactOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="contact-modal__body">
              <div className="contact-modal__campaign">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/campaign/lemotor_cashback.png"
                  alt="対象者全員 キャッシュバック2,000円分がもらえる！"
                />
              </div>

              {/* Honeypot — leave empty; bots that autofill get rejected server-side */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="contact-website">ウェブサイト</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set({ website: e.target.value })}
                />
              </div>

              <div className="chat-operator contact-modal__operator">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="chat-operator__img" src="/assets/icons/image_nav.png" alt="" />
                <div className="chat-operator__text">
                  お見積りをお伝えする連絡先を
                  <br />
                  入力して下さい。
                </div>
              </div>

              <div className="contact-modal__field">
                <label className="contact-modal__label" htmlFor="contact-email">
                  メールアドレス
                  <span className={"req" + (emailValid ? " ok" : "")}>
                    {emailValid ? "OK" : "必須"}
                  </span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="control"
                  value={form.email}
                  onChange={(e) => set({ email: normalizeEmail(e.target.value) })}
                  autoComplete="email"
                  inputMode="email"
                />
                {form.email && !emailValid && (
                  <p className="contact-modal__hint contact-modal__hint--error">
                    正しいメールアドレスを入力してください（例: name@example.com）
                  </p>
                )}
              </div>

              <div className="contact-modal__field">
                <label className="contact-modal__label" htmlFor="contact-tel">
                  電話番号
                  <span className={"req" + (telValid ? " ok" : "")}>
                    {telValid ? "OK" : "必須"}
                  </span>
                </label>
                <input
                  id="contact-tel"
                  type="tel"
                  className="control"
                  placeholder="09012345678"
                  value={form.tel}
                  onChange={(e) => set({ tel: normalizeJapanesePhone(e.target.value) })}
                  autoComplete="tel"
                  inputMode="tel"
                />
                {form.tel && !telValid && (
                  <p className="contact-modal__hint contact-modal__hint--error">
                    正しい日本の電話番号を入力してください（例: 09012345678）
                  </p>
                )}
                <p className="contact-modal__hint">
                  お問い合わせ後、ご入力いただいた番号宛にLe Motorより査定案内の電話があります。
                </p>
              </div>

              <p className="contact-modal__terms">
                Le Motorのサービス利用および個人情報の取り扱いにご同意の上、お申込み下さい。
              </p>

              {error && (
                <p className="contact-modal__error">{error}</p>
              )}

              <div className="contact-modal__cta">
                <div className="contact-modal__bubble">
                  対象者全員にキャッシュバック2,000円！
                </div>
                <button
                  type="button"
                  className="btn-submit contact-modal__submit"
                  disabled={!step2Valid || submitting}
                  onClick={submit}
                >
                  <span className="sub">無料</span>
                  {submitting ? "送信中..." : "査定額を見る"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="form-note">
        お問い合わせ後、ご入力いただいた番号宛にLe Motorより査定案内の電話があります。
      </p>

      <div className="protect">
        <span>🔒 個人情報が許可なく公開されることはございません。</span>
      </div>

      <a className="call-btn" href="tel:09091563524">
        <span className="call-btn__label">直接お電話でもご相談いただけます</span>
        <span className="call-btn__number">📞 090-9156-3524</span>
        <span className="call-btn__hint">タップして発信</span>
      </a>

      <div className="campaign" style={{ paddingTop: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/campaign/lemotor_cashback.png"
          alt="対象者全員 キャッシュバック2,000円分がもらえる！ Le Motorからの申込限定"
        />
      </div>

      <CarWizard
        open={Boolean(wizardStep)}
        step={wizardStep}
        onClose={() => setWizardStep(null)}
        onBack={wizardBack}
        form={form}
        makers={makers}
        models={models}
        otherDomesticOpen={otherDomesticOpen}
        setOtherDomesticOpen={setOtherDomesticOpen}
        onPickMaker={onPickMaker}
        onPickModel={onPickModel}
        onPickYear={onPickYear}
        onPickGrade={onPickGrade}
        onPickMileage={onPickMileage}
        onPickColor={onPickColor}
      />

      {/* 都道府県/市区町村 picker (sell.tc-v.com # modalZipcodeSelect) */}
      {addressPicker && (
        <div
          className="picker-modal picker-modal--address"
          role="dialog"
          aria-modal="true"
          aria-label={addressPicker === "pref" ? "都道府県" : "市区町村名"}
        >
          <div className="picker-modal__header">
            {addressPicker === "city" && (
              <button
                type="button"
                className="picker-modal__back"
                onClick={() => setAddressPicker("pref")}
                aria-label="戻る"
              >
                ‹
              </button>
            )}
            <div className="picker-modal__title">
              {addressPicker === "pref" ? "都道府県" : "市区町村名"}
            </div>
            <button
              type="button"
              className="picker-modal__close"
              onClick={() => setAddressPicker(null)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
          <div className="address-indicator">
            <button
              type="button"
              className={"address-indicator__tab" + (addressPicker === "pref" ? " is-active" : "")}
              onClick={() => setAddressPicker("pref")}
            >
              都道府県
              <span>{form.prefecture || "未選択"}</span>
            </button>
            <button
              type="button"
              className={"address-indicator__tab" + (addressPicker === "city" ? " is-active" : "")}
              onClick={() => form.prefecture && setAddressPicker("city")}
              disabled={!form.prefecture}
            >
              市区町村名
              <span>{form.city || "未選択"}</span>
            </button>
          </div>
          <div className="picker-modal__body">
            {addressPicker === "pref" &&
              PREFECTURE_REGIONS.map((region) => (
                <div className="picker-section" key={region.title}>
                  <div className="picker-section__title">{region.title}</div>
                  <ul className="picker-list">
                    {region.items.map((p) => (
                      <li key={p}>
                        <button
                          type="button"
                          className={
                            "picker-list__item" + (form.prefecture === p ? " is-selected" : "")
                          }
                          onClick={() => onPickPrefecture(p)}
                        >
                          <span>{p}</span>
                          {form.prefecture === p && (
                            <span className="picker-list__check" aria-hidden>✓</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {addressPicker === "city" && (
              <div className="picker-section">
                <div className="picker-section__title">{form.prefecture}</div>
                <ul className="picker-list">
                  {citiesLoading && (
                    <li className="picker-list__empty">市区町村を読み込み中…</li>
                  )}
                  {!citiesLoading && cities.length === 0 && (
                    <li className="picker-list__empty">
                      <input
                        className="control"
                        placeholder="市区町村を入力"
                        value={form.city}
                        onChange={(e) => set({ city: e.target.value })}
                        onBlur={() => form.city && setAddressPicker(null)}
                        autoFocus
                      />
                    </li>
                  )}
                  {cities.map((c) => (
                    <li key={c}>
                      <button
                        type="button"
                        className={
                          "picker-list__item" + (form.city === c ? " is-selected" : "")
                        }
                        onClick={() => onPickCity(c)}
                      >
                        <span>{c}</span>
                        {form.city === c && (
                          <span className="picker-list__check" aria-hidden>✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
