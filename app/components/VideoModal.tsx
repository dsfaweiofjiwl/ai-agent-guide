"use client";

import { useEffect, useState } from "react";

interface Video {
  name: string;
  url: string;
}

const videos: Video[] = [
  { name: "安装 Git", url: "https://www.bilibili.com/video/BV15SwJzBEa6/?spm_id_from=333.337.search-card.all.click" },
  { name: "安装 Node.js", url: "https://www.bilibili.com/video/BV1Y8TLzYE53/?spm_id_from=333.337.search-card.all.click" },
  { name: "安装 Python", url: "https://www.bilibili.com/video/BV1f3411t73m/?spm_id_from=333.337.search-card.all.click" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VideoModal({ open, onClose }: Props) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  if (!open) return null;

  const filtered = videos.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative bg-[var(--color-canvas)] rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">
            推荐视频
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-muted-soft)] hover:bg-[var(--color-surface-card)] transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="搜索视频..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[var(--color-hairline)] rounded-md py-2 px-3 text-sm bg-[var(--color-canvas)] text-[var(--color-body)] outline-none focus:border-[var(--color-primary)] transition-colors mb-4"
        />

        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-[13px] text-[var(--color-muted-soft)] text-center py-6">
              没有找到相关视频
            </p>
          ) : (
            filtered.map((v) => (
              <a
                key={v.url}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--color-surface-card)] transition-colors no-underline group"
              >
                <span className="text-[var(--color-primary)] text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                  ▶
                </span>
                <span className="text-[13px] text-[var(--color-body)] group-hover:text-[var(--color-ink)] transition-colors">
                  {v.name}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
