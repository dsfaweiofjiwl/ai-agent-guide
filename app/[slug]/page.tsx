import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticleSlugs, getComments } from "@/lib/db";
import ArticleContent from "../components/ArticleContent";
import CommentSection from "../components/CommentSection";
import type { Metadata } from "next";

// Group parent slugs — these are containers, skip in prev/next navigation
const GROUP_SLUGS = new Set(["popular-agents", "skill-recommend"]);

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "未找到" };
  return { title: `${article.title} — AI Agent 开发指南` };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getAllArticleSlugs().filter((a) => !GROUP_SLUGS.has(a.slug));
  const idx = allArticles.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? allArticles[idx - 1] : null;
  const next = idx < allArticles.length - 1 ? allArticles[idx + 1] : null;

  const comments = getComments(article.id);

  return (
    <div>
      <div className="text-[11px] text-[var(--color-muted-soft)] mb-1">
        {article.chapter_title} / {article.title}
      </div>

      <ArticleContent
        title={article.title}
        content={article.content}
        date={article.updated_at}
        prev={prev}
        next={next}
      />

      <CommentSection
        articleId={article.id}
        initialComments={comments.map((c) => ({
          id: c.id,
          author: c.author,
          body: c.body,
          createdAt: c.created_at,
          replies: c.replies.map((r) => ({
            id: r.id,
            author: r.author,
            body: r.body,
            createdAt: r.created_at,
          })),
        }))}
      />
    </div>
  );
}
