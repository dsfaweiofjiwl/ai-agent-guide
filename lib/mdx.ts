import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);

  let html = result.toString();

  // Wrap code blocks with macOS-style header bar
  html = html.replace(
    /<pre><code class="hljs(?: language-(\w+))?">([\s\S]*?)<\/code><\/pre>/g,
    (_match, lang, code) => {
      const label = lang || "code";
      return `<div class="code-block"><div class="code-block-header"><span class="code-dot" style="background:#c64545"></span><span class="code-dot" style="background:#e8a55a"></span><span class="code-dot" style="background:#5db872"></span><span class="code-filename">${label}</span></div><pre><code class="hljs${lang ? ` language-${lang}` : ""}">${code}</code></pre></div>`;
    }
  );

  return html;
}
