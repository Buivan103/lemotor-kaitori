"use client";

import { useEffect, useState } from "react";
import {
  YEARS,
  MILEAGES,
  CAR_STATUS,
  SELLING_TIME,
  CONTACT_TIME,
  PREFECTURES,
} from "@/lib/constants";

const empty = {
  makerCode: "",
  makerName: "",
  modelCode: "",
  modelName: "",
  year: "",
  mileage: "",
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
};

export default function AppraisalForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(empty);
  const [makers, setMakers] = useState({ domestic: [], imported: [] });
  const [models, setModels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const step1Valid = form.makerCode && form.year && form.mileage;
  const step2Valid = form.lastName && form.firstName && form.prefecture;
  const step3Valid = form.email && form.tel && form.contactTime;

  const onMakerChange = (code) => {
    const all = [...makers.domestic, ...makers.imported];
    const m = all.find((x) => x.code === code);
    set({ makerCode: code, makerName: m?.name || "", modelCode: "", modelName: "" });
  };

  const onModelChange = (code) => {
    const m = models.find((x) => x.code === code);
    set({ modelCode: code, modelName: m?.name || "" });
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました。");
      } else {
        setResult(data);
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="result">
        <div className="result__badge">🎉</div>
        <h2>査定依頼を受け付けました</h2>
        <p className="result__price">
          {form.makerName} {form.modelName} の相場価格は
          <b>{result.estimate.min}</b>~<b>{result.estimate.max}</b>万円です
        </p>
        <p className="hint">
          ※当社にて独自算出した相場価格です。買取価格を保証するものではありません。
        </p>
        <p style={{ marginTop: 16 }}>担当より順次ご連絡いたします。（受付番号 #{result.id}）</p>
        <button
          className="btn-back"
          onClick={() => {
            setForm(empty);
            setStep(1);
            setResult(null);
          }}
        >
          最初からやり直す
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="formcard__head">
        <h2>買取・査定をする車両の情報を入力ください</h2>
        <span className="formcard__timer">29秒で入力完了！愛車の査定、承ります。</span>
      </div>

      <div className="steps-indicator">
        <span className={step >= 1 ? "on" : ""} />
        <span className={step >= 2 ? "on" : ""} />
        <span className={step >= 3 ? "on" : ""} />
      </div>

      {step === 1 && (
        <>
          <div className="field">
            <div className="field__label">
              メーカー <span className={"req" + (form.makerCode ? " ok" : "")}>{form.makerCode ? "OK" : "必須"}</span>
            </div>
            <select
              className="control"
              value={form.makerCode}
              onChange={(e) => onMakerChange(e.target.value)}
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

          <div className="field">
            <div className="field__label">
              車種 <span className={"req" + (form.modelCode ? " ok" : "")}>{form.modelCode ? "OK" : "任意"}</span>
            </div>
            <select
              className="control"
              value={form.modelCode}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={!form.makerCode}
            >
              <option value="">選択してください</option>
              {models.map((m) => (
                <option key={m.code} value={m.code}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <div className="field__label">
              年式 <span className={"req" + (form.year ? " ok" : "")}>{form.year ? "OK" : "必須"}</span>
            </div>
            <select
              className="control"
              value={form.year}
              onChange={(e) => set({ year: e.target.value.match(/^\d{4}/)?.[0] || e.target.value, })}
            >
              <option value="">選択してください</option>
              {YEARS.map((y) => (
                <option key={y} value={y.match(/^\d{4}/)?.[0] || y}>{y}</option>
              ))}
            </select>
            <div className="hint">不明の場合はだいたいでOK</div>
          </div>

          <div className="field">
            <div className="field__label">
              走行距離 <span className={"req" + (form.mileage ? " ok" : "")}>{form.mileage ? "OK" : "必須"}</span>
            </div>
            <select
              className="control"
              value={form.mileage}
              onChange={(e) => set({ mileage: e.target.value })}
            >
              <option value="">選択してください</option>
              {MILEAGES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="hint">不明の場合はだいたいでOK</div>
          </div>

          <div className="field">
            <div className="field__label">車の状態</div>
            <div className="radios">
              {CAR_STATUS.map((s) => (
                <div
                  key={s.value}
                  className={"radio-pill" + (form.carStatus === s.value ? " on" : "")}
                  onClick={() => set({ carStatus: s.value })}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field__label">売却希望時期</div>
            <div className="radios">
              {SELLING_TIME.map((s) => (
                <div
                  key={s.value}
                  className={"radio-pill" + (form.sellingTime === s.value ? " on" : "")}
                  onClick={() => set({ sellingTime: s.value })}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>
            <small>無料</small>次へ (29秒で完了)
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="hint">お客様情報が一般に公開されることはありません。</p>
          <div className="field">
            <div className="field__label">
              お名前 <span className={"req" + (step2Valid ? " ok" : "")}>必須</span>
            </div>
            <div className="grid-2">
              <input
                className="control"
                placeholder="姓"
                value={form.lastName}
                onChange={(e) => set({ lastName: e.target.value })}
              />
              <input
                className="control"
                placeholder="名"
                value={form.firstName}
                onChange={(e) => set({ firstName: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <div className="field__label">
              都道府県 <span className={"req" + (form.prefecture ? " ok" : "")}>必須</span>
            </div>
            <select
              className="control"
              value={form.prefecture}
              onChange={(e) => set({ prefecture: e.target.value })}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="field">
              <div className="field__label">市区町村</div>
              <input
                className="control"
                placeholder="市区町村"
                value={form.city}
                onChange={(e) => set({ city: e.target.value })}
              />
            </div>
            <div className="field">
              <div className="field__label">郵便番号</div>
              <input
                className="control"
                placeholder="ハイフン不要"
                value={form.zipcode}
                onChange={(e) => set({ zipcode: e.target.value })}
              />
            </div>
          </div>

          <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>
            <small>無料</small>次に進む
          </button>
          <button className="btn-back" onClick={() => setStep(1)}>戻る</button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="field">
            <div className="field__label">
              メールアドレス <span className={"req" + (form.email ? " ok" : "")}>必須</span>
            </div>
            <input
              type="email"
              className="control"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </div>

          <div className="field">
            <div className="field__label">
              電話番号 <span className={"req" + (form.tel ? " ok" : "")}>必須</span>
            </div>
            <input
              type="tel"
              className="control"
              placeholder="09012345678"
              value={form.tel}
              onChange={(e) => set({ tel: e.target.value })}
            />
          </div>

          <div className="field">
            <div className="field__label">
              希望連絡時間帯 <span className={"req" + (form.contactTime ? " ok" : "")}>必須</span>
            </div>
            <div className="radios">
              {CONTACT_TIME.map((c) => (
                <div
                  key={c.value}
                  className={"radio-pill" + (form.contactTime === c.value ? " on" : "")}
                  onClick={() => set({ contactTime: c.value })}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {error && <p style={{ color: "var(--red)", fontSize: 14 }}>{error}</p>}

          <button className="btn-next" disabled={!step3Valid || submitting} onClick={submit}>
            <small>無料</small>{submitting ? "送信中..." : "査定額を見る"}
          </button>
          <button className="btn-back" onClick={() => setStep(2)}>戻る</button>

          <div className="protect">
            <span>🔒</span>
            <span>ご利用により個人情報が許可なく公開されることはございません。</span>
          </div>
        </>
      )}

      <p className="form-note">
        お問い合わせ後、ご入力いただいた番号宛に買取業者より査定案内の連絡があります。
      </p>
    </div>
  );
}
