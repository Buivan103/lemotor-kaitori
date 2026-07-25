"use client";

import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const goForm = () => {
    setOpen(false);
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__campaign">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/campaign/digico_820.png" alt="対象者全員にデジタルギフト券20,000円分！" />
        </div>
        <div className="modal__body">
          <div className="modal__operator">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/image_nav.png" alt="" />
            <p>
              ご希望に沿った提案を致します。
              <br />
              あなたはどちらですか？
            </p>
          </div>
        </div>
        <div className="modal__buttons">
          <button type="button" className="modal__btn" onClick={goForm}>
            不要な車がある
          </button>
          <button type="button" className="modal__btn" onClick={goForm}>
            乗換を検討中
          </button>
        </div>
        <button type="button" className="modal__skip" onClick={() => setOpen(false)}>
          提案は必要ない
        </button>
      </div>
    </div>
  );
}
