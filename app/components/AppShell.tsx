"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import NavActions from "./NavActions";

interface ArticleItem {
  slug: string;
  title: string;
}

interface Chapter {
  id: number;
  slug: string;
  title: string;
  articles: ArticleItem[];
}

export default function AppShell({
  chapters,
  children,
}: {
  chapters: Chapter[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Top navigation bar */}
      <nav className="flex items-center justify-between px-4 md:px-6 h-[56px] bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Hamburger button - mobile only */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 -ml-1 rounded hover:bg-[var(--color-surface-card)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-base text-[var(--color-ink)]">✦</span>
          <span className="font-semibold text-[14px] text-[var(--color-ink)] tracking-tight">
            AI Agent 开发指南
          </span>
        </div>
        <NavActions />
      </nav>

      {/* Sidebar + Main content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          chapters={chapters}
          isMobileOpen={sidebarOpen}
          onMobileClose={closeSidebar}
        />
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 px-4 md:px-12 py-6 md:py-8">{children}</div>
          <footer className="text-center py-6 px-8 text-[11px] text-[var(--color-muted-soft)] border-t border-[var(--color-hairline)]">
            AI Agent 开发指南 · 用热爱打磨每一篇教程
          </footer>
        </main>
      </div>
    </>
  );
}
