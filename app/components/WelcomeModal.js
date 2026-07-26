"use client";

import { useEffect, useState } from "react";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);

  const goForm = () => {
    setOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__campaign">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/campaign/lemotor_cashback.png" alt="対象者全員 キャッシュバック2,000円分がもらえる！ Le Motorからの申込限定" />
        </div>
        <div className="modal__body">
          <div className="modal__operator">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lemotor/logo.png" alt="" />
            <p>
              ご希望に沿ったご提案をいたします。
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
        <button type="button" className="modal__skip" onClick={close}>
          提案は必要ない
        </button>
      </div>
    </div>
  );
}
