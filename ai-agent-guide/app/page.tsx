import Link from "next/link";
import { getChaptersWithArticles } from "@/lib/db";
import HomeCards from "./components/HomeCards";

export const dynamic = "force-dynamic";

export default function Home() {
  const chapters = getChaptersWithArticles();

  const allArticles = chapters.flatMap((ch) =>
    ch.articles.map((a) => ({ ...a, chapterSlug: ch.slug }))
  );
  const latest = allArticles.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )[0];

  return (
    <div className="w-full md:w-[60%] mx-auto">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-serif text-[28px] md:text-[36px] font-normal text-[var(--color-ink)] leading-tight mb-3">
          AI Agent 开发指南
        </h1>
        <p className="text-[15px] text-[var(--color-muted)] leading-relaxed max-w-lg">
          从零开始学习 AI Agent 开发。涵盖 LLM 基础、Prompt 工程、Function Calling、
          Agent 架构设计、记忆系统、RAG 等核心主题。每篇教程都配有可运行的代码示例。
        </p>
        {latest && (
          <div className="mt-4">
            <Link
              href={`/${latest.slug}`}
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-[14px] font-medium py-2.5 px-5 rounded-lg no-underline hover:bg-[var(--color-primary-active)] transition-colors"
            >
              开始阅读
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <HomeCards />

      {/* Chapter list */}
      <div className="space-y-8">
        {chapters.map((chapter) => (
          <section key={chapter.id}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-serif text-[20px] font-normal text-[var(--color-ink)]">
                {chapter.title}
              </h2>
              <span className="text-[11px] text-[var(--color-muted-soft)]">
                {chapter.articles.length} 篇文章
              </span>
            </div>
            <div>
              {chapter.articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${article.slug}`}
                  className="flex items-center justify-between py-3 px-2 -mx-1 border-b border-[var(--color-hairline)] no-underline hover:bg-[var(--color-surface-soft)] transition-colors rounded-md"
                >
                  <span className="text-[14px] text-[var(--color-body)] font-medium">
                    {article.title}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-soft)]">
                    {new Date(article.updated_at).toLocaleDateString("zh-CN")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--color-muted-soft)] text-sm">内容正在准备中，敬请期待</p>
        </div>
      )}
    </div>
  );
}
