import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "db", "data.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf-8");
  db.exec(schema);

  return db;
}

// Types
export interface Chapter {
  id: number;
  slug: string;
  title: string;
  order: number;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  chapter_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithChapter extends Article {
  chapter_title: string;
}

export interface Comment {
  id: number;
  article_id: number;
  parent_id: number | null;
  author: string;
  body: string;
  created_at: string;
  replies: Comment[];
}

// Query helpers
export function getChapters(): (Chapter & { articles: { slug: string; title: string }[] })[] {
  const d = getDb();
  const chapters = d.prepare("SELECT * FROM chapters ORDER BY \"order\"").all() as Chapter[];
  const articles = d.prepare("SELECT slug, title, chapter_id FROM articles ORDER BY \"order\"").all() as {
    slug: string;
    title: string;
    chapter_id: number;
  }[];

  return chapters.map((ch) => ({
    ...ch,
    articles: articles
      .filter((a) => a.chapter_id === ch.id)
      .map(({ chapter_id: _, ...rest }) => rest),
  }));
}

export function getChaptersWithArticles(): (Chapter & { articles: (Pick<Article, "slug" | "title" | "updated_at">)[] })[] {
  const d = getDb();
  const chapters = d.prepare("SELECT * FROM chapters ORDER BY \"order\"").all() as Chapter[];
  const articles = d.prepare("SELECT slug, title, chapter_id, updated_at FROM articles ORDER BY \"order\"").all() as {
    slug: string;
    title: string;
    chapter_id: number;
    updated_at: string;
  }[];

  return chapters.map((ch) => ({
    ...ch,
    articles: articles
      .filter((a) => a.chapter_id === ch.id)
      .map(({ chapter_id: _, ...rest }) => rest),
  }));
}

export function getArticleBySlug(slug: string): (Article & { chapter_title: string }) | undefined {
  const d = getDb();
  return d
    .prepare(
      `SELECT a.*, c.title as chapter_title
       FROM articles a
       JOIN chapters c ON a.chapter_id = c.id
       WHERE a.slug = ?`
    )
    .get(slug) as (Article & { chapter_title: string }) | undefined;
}

export function getAllArticleSlugs(): { slug: string; title: string }[] {
  const d = getDb();
  return d
    .prepare("SELECT slug, title FROM articles ORDER BY (SELECT \"order\" FROM chapters WHERE id = articles.chapter_id), \"order\"")
    .all() as { slug: string; title: string }[];
}

export function getComments(articleId: number): Comment[] {
  const d = getDb();
  const all = d
    .prepare("SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC")
    .all(articleId) as Comment[];

  return nestComments(all);
}

function nestComments(comments: Comment[]): Comment[] {
  const roots: Comment[] = [];
  const map = new Map<number, Comment>();

  for (const c of comments) {
    c.replies = [];
    map.set(c.id, c);
  }

  for (const c of comments) {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies.push(c);
    } else {
      roots.push(c);
    }
  }

  return roots;
}

export function createComment(
  articleId: number,
  parentId: number | null,
  author: string,
  body: string
): Comment {
  const d = getDb();
  const result = d
    .prepare("INSERT INTO comments (article_id, parent_id, author, body) VALUES (?, ?, ?, ?)")
    .run(articleId, parentId, author, body);

  return d.prepare("SELECT * FROM comments WHERE id = ?").get(result.lastInsertRowid) as Comment;
}
