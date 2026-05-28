import { renderMarkdown } from "@/lib/mdx";

interface Props {
  title: string;
  content: string;
  date: string;
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

export default async function ArticleContent({ title, content, date, prev, next }: Props) {
  const html = await renderMarkdown(content);

  return (
    <article className="max-w-[720px] mx-auto">
      <h1 className="font-serif text-[24px] md:text-[32px] font-normal text-[var(--color-ink)] leading-tight tracking-tighter mb-2">
        {title}
      </h1>
      <time className="text-xs text-[var(--color-muted-soft)] mb-8 block">
        {new Date(date).toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </time>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Prev / Next navigation */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-12 pt-6 border-t border-[var(--color-hairline)]">
        {prev ? (
          <a
            href={`/${prev.slug}`}
            className="text-[13px] text-[var(--color-primary)] no-underline hover:opacity-70 transition-colors"
          >
            ← {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a
            href={`/${next.slug}`}
            className="text-[13px] text-[var(--color-primary)] no-underline hover:opacity-70 transition-colors"
          >
            {next.title} →
          </a>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
