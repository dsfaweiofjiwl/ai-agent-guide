"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

// Nested group config: group slug → { title, child slugs }
const GROUPS: Record<string, { title: string; children: string[] }> = {
  "popular-agents": { title: "热门Agent安装", children: ["claude-code", "openclaw"] },
  "skill-recommend": { title: "Skill 推荐与使用", children: ["superpowers", "remotion"] },
};

// All child slugs (for filtering out of flat list)
const CHILD_SLUGS = new Set(Object.values(GROUPS).flatMap((g) => g.children));

function isGroup(article: { slug: string }): boolean {
  return article.slug in GROUPS;
}

function getChildren(article: { slug: string }, allArticles: ArticleItem[]): ArticleItem[] {
  const slugs = GROUPS[article.slug]?.children ?? [];
  return allArticles.filter((a) => slugs.includes(a.slug));
}

interface SidebarProps {
  chapters: Chapter[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ chapters, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [collapsedSub, setCollapsedSub] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    const next = new Set(collapsed);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setCollapsed(next);
  };

  const toggleSub = (slug: string) => {
    const next = new Set(collapsedSub);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setCollapsedSub(next);
  };

  const filtered = chapters
    .map((ch) => ({
      ...ch,
      articles: ch.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          ch.title.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((ch) => !search || ch.articles.length > 0);

  const innerContent = (
    <>
      <div className="p-5">
        <input
          type="text"
          placeholder="搜索教程..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[var(--color-hairline)] rounded-md py-2 px-3 text-sm bg-[var(--color-canvas)] text-[var(--color-muted)] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
      </div>

      <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 pb-4">
        {filtered.map((chapter) => (
          <div key={chapter.id} className="mb-3">
            <button
              onClick={() => toggle(chapter.slug)}
              className="w-full text-left px-3 py-1.5 text-[13px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors flex items-center justify-between"
            >
              {chapter.title}
              <svg
                className={`w-3.5 h-3.5 transition-transform ${collapsed.has(chapter.slug) ? "" : "rotate-90"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {!collapsed.has(chapter.slug) && (
              <div className="mt-1">
                {chapter.articles
                  .filter((a) => !CHILD_SLUGS.has(a.slug))
                  .map((article) => {
                    if (isGroup(article)) {
                      const children = getChildren(article, chapter.articles);
                      const expanded = !collapsedSub.has(article.slug);
                      const isActive = pathname === `/${article.slug}`;
                      return (
                        <div key={article.slug}>
                          <Link
                            href={`/${article.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSub(article.slug);
                            }}
                            className={`flex items-center justify-between w-full text-left px-3 py-1.5 text-[13px] rounded-md mb-0.5 transition-colors no-underline ${
                              isActive
                                ? "bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium"
                                : "text-[var(--color-muted)] hover:bg-[var(--color-surface-card)] hover:text-[var(--color-ink)]"
                            }`}
                          >
                            <span>{article.title}</span>
                            <svg
                              className={`w-3 h-3 transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          {expanded && (
                            <div className="ml-3">
                              {children.map((child) => {
                                const childHref = `/${child.slug}`;
                                const childActive = pathname === childHref;
                                return (
                                  <Link
                                    key={child.slug}
                                    href={childHref}
                                    className={`block px-3 py-1.5 text-[12px] rounded-md mb-0.5 transition-colors no-underline ${
                                      childActive
                                        ? "bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium"
                                        : "text-[var(--color-muted-soft)] hover:bg-[var(--color-surface-card)] hover:text-[var(--color-ink)]"
                                    }`}
                                  >
                                    {child.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const href = `/${article.slug}`;
                    const active = pathname === href;
                    return (
                      <Link
                        key={article.slug}
                        href={href}
                        className={`block px-3 py-1.5 text-[13px] rounded-md mb-0.5 transition-colors no-underline ${
                          active
                            ? "bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium"
                            : "text-[var(--color-muted)] hover:bg-[var(--color-surface-card)] hover:text-[var(--color-ink)]"
                        }`}
                      >
                        {article.title}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Reading progress */}
      <div className="p-3 mx-4 mb-4 bg-[var(--color-surface-card)] rounded-lg">
        <div className="text-[11px] font-semibold text-[var(--color-muted-soft)] uppercase tracking-wide mb-1">
          阅读进度
        </div>
        <div className="h-1 bg-[var(--color-hairline)] rounded-full mb-1">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
            style={{ width: `${Math.round((countRead(pathname, chapters) / (totalArticles(chapters) || 1)) * 100)}%` }}
          />
        </div>
        <div className="text-[11px] text-[var(--color-muted-soft)]">
          {countRead(pathname, chapters)} / {totalArticles(chapters)} 篇
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: normal flex child */}
      <aside
        className="hidden md:flex w-[280px] flex-shrink-0 bg-[var(--color-surface-soft)] border-r border-[var(--color-hairline)] flex-col sticky top-0"
        style={{ height: "calc(100vh - 56px)" }}
      >
        {innerContent}
      </aside>

      {/* Mobile: overlay drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-[var(--color-surface-soft)] flex flex-col shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <span className="text-[13px] font-semibold text-[var(--color-ink)]">导航</span>
              <button
                onClick={onMobileClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--color-muted-soft)] hover:bg-[var(--color-surface-card)] transition-colors text-sm"
                aria-label="关闭侧栏"
              >
                ✕
              </button>
            </div>
            {innerContent}
          </aside>
        </div>
      )}
    </>
  );
}

function totalArticles(chapters: Chapter[]): number {
  return chapters.reduce((sum, ch) => sum + ch.articles.length, 0);
}

function countRead(_pathname: string, chapters: Chapter[]): number {
  return Math.max(1, Math.ceil(totalArticles(chapters) * 0.3));
}
