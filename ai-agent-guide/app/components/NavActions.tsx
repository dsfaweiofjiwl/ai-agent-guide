"use client";

import { useState } from "react";
import DonateModal from "./DonateModal";
import VideoModal from "./VideoModal";
import AboutModal from "./AboutModal";

export default function NavActions() {
  const [showDonate, setShowDonate] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="flex gap-2 sm:gap-5 text-[11px] sm:text-[13px] text-[var(--color-muted)]">
        <a href="/" className="no-underline text-[var(--color-ink)] font-medium transition-colors hover:opacity-70">首页</a>
        <span
          className="transition-colors hover:text-[var(--color-ink)] cursor-pointer"
          onClick={() => setShowVideos(true)}
        >
          教程
        </span>
        <span
          className="transition-colors hover:text-[var(--color-ink)] cursor-pointer"
          onClick={() => setShowAbout(true)}
        >
          关于
        </span>
        <span
          className="transition-colors hover:text-[var(--color-primary)] cursor-pointer"
          onClick={() => setShowDonate(true)}
        >
          支持作者
        </span>
      </div>
      <DonateModal open={showDonate} onClose={() => setShowDonate(false)} />
      <VideoModal open={showVideos} onClose={() => setShowVideos(false)} />
      <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
