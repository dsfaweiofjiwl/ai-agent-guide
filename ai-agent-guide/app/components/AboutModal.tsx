"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: Props) {
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
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative bg-[var(--color-canvas)] rounded-xl shadow-2xl max-w-lg w-full mx-4 p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-muted-soft)] hover:bg-[var(--color-surface-card)] transition-colors text-sm"
        >
          ✕
        </button>

        <h3 className="text-[18px] font-semibold text-[var(--color-ink)] mb-4">
          关于
        </h3>

        <div className="text-[14px] text-[var(--color-body)] leading-relaxed space-y-3">
          <p>
            这是一个专注 <strong className="text-[var(--color-body-strong)]">AI Agent 智能体</strong> 的个人学习站点。
          </p>
          <p>
            我搭建这个网站，源于对 AI Agent 领域的长期关注与深耕。当下 AI 正从被动响应的工具，走向自主思考、目标驱动、持续执行、迭代优化的智能体时代，AI Agent 正是下一代人工智能的核心方向。
          </p>
          <p>
            我希望打造一个纯粹、体系化、可落地的 AI Agent 学习阵地，摒弃碎片化信息与空洞概念炒作，沉淀从入门认知、技术原理、框架实战到工程落地的完整内容，让学习更聚焦、实践更高效。
          </p>
          <p>
            这里没有冗余流量内容，只做持续更新、干货导向的 AI Agent 学习记录与分享，既是我个人的研究沉淀，也希望为所有关注智能体技术的学习者，提供一个干净、专业的学习空间。
          </p>
        </div>
      </div>
    </div>
  );
}
