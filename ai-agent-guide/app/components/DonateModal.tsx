"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DonateModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div
        className="relative bg-[var(--color-canvas)] rounded-xl shadow-2xl max-w-sm w-full mx-4 p-5 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-muted-soft)] hover:bg-[var(--color-surface-card)] transition-colors text-sm"
        >
          ✕
        </button>

        <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-2">
          感谢你的支持
        </h3>
        <p className="text-[13px] text-[var(--color-muted)] mb-5 leading-relaxed">
          如果这些教程对你有帮助，欢迎请作者喝杯咖啡。
          <br />
          每一份支持都是我持续更新的动力 ✨
        </p>

        <img
          src="/images/qr-donate.jpg"
          alt="微信收款码"
          className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg"
        />

        <p className="text-[11px] text-[var(--color-muted-soft)] mt-4">
          微信扫码 · 金额随意
        </p>
      </div>
    </div>
  );
}
