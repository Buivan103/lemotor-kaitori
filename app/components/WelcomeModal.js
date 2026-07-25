"use client";

import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  const scrollToForm = () => {
    setOpen(false);
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="modal-overlay" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__promo">対象者全員にデジタルギフト券20,000円分！</div>
        <p className="modal__q">
          ご希望に沿った提案を致します。<br />あなたはどちらですか？
        </p>
        <div className="modal__buttons">
          <button className="modal__btn" onClick={scrollToForm}>不要な車がある</button>
          <button className="modal__btn" onClick={scrollToForm}>乗換を検討中</button>
        </div>
        <button className="modal__skip" onClick={() => setOpen(false)}>
          提案は必要ない
        </button>
      </div>
    </div>
  );
}
