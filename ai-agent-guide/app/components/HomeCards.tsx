"use client";

import { useState } from "react";
import DonateModal from "./DonateModal";
import VideoModal from "./VideoModal";
import AboutModal from "./AboutModal";

const cardBase =
  "bg-[var(--color-surface-card)] rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md";

export default function HomeCards() {
  const [showDonate, setShowDonate] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className={cardBase} onClick={() => setShowVideos(true)}>
          <div className="text-lg mb-1.5">📺</div>
          <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-1">推荐视频</h3>
          <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">
            图文还不够直观？右上角「教程」收录了配套讲解视频，随时补充学习。
          </p>
        </div>
        <div className={cardBase} onClick={() => setShowAbout(true)}>
          <div className="text-lg mb-1.5">📖</div>
          <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-1">关于本站</h3>
          <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">
            右上角「关于」了解本站的初衷 — 一个纯粹的 AI Agent 学习与沉淀空间。
          </p>
        </div>
        <div className={cardBase} onClick={() => setShowDonate(true)}>
          <div className="text-lg mb-1.5">☕</div>
          <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-1">支持作者</h3>
          <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">
            教程对你有帮助？右上角「支持作者」请杯咖啡，每一份鼓励都被记住。
          </p>
        </div>
      </div>
      <DonateModal open={showDonate} onClose={() => setShowDonate(false)} />
      <VideoModal open={showVideos} onClose={() => setShowVideos(false)} />
      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
