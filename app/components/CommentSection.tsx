"use client";

import { useState } from "react";

interface CommentData {
  id: number;
  author: string;
  body: string;
  createdAt: string;
  replies?: CommentData[];
}

export default function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: number;
  initialComments: CommentData[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (parentId: number | null) => {
    if (!author.trim() || !body.trim()) {
      setError("请填写昵称和评论内容");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, parentId, author: author.trim(), body: body.trim() }),
    });

    if (res.ok) {
      const newComment = await res.json();
      if (parentId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
          )
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      setAuthor("");
      setBody("");
      setReplyTo(null);
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--color-hairline)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-normal text-[var(--color-ink)]">
          评论 ({comments.length})
        </h2>
        <button
          onClick={() => { setShowForm(!showForm); setReplyTo(null); }}
          className="text-[13px] text-[var(--color-primary)] bg-transparent border-none cursor-pointer hover:underline font-medium"
        >
          {showForm ? "取消" : "写评论"}
        </button>
      </div>

      {showForm && (
        <CommentForm
          author={author}
          body={body}
          error={error}
          submitting={submitting}
          replyTo={null}
          onAuthorChange={setAuthor}
          onBodyChange={setBody}
          onSubmit={() => handleSubmit(null)}
        />
      )}

      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replyTo={replyTo}
            author={author}
            body={body}
            error={error}
            submitting={submitting}
            onReply={(id) => { setReplyTo(id); setShowForm(true); }}
            onAuthorChange={setAuthor}
            onBodyChange={setBody}
            onSubmit={handleSubmit}
          />
        ))}
        {comments.length === 0 && !showForm && (
          <p className="text-sm text-[var(--color-muted-soft)]">暂无评论，来写第一条吧</p>
        )}
      </div>
    </div>
  );
}

function CommentForm({
  author,
  body,
  error,
  submitting,
  replyTo,
  onAuthorChange,
  onBodyChange,
  onSubmit,
}: {
  author: string;
  body: string;
  error: string;
  submitting: boolean;
  replyTo: number | null;
  onAuthorChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className={`mb-5 ${replyTo ? "ml-4 pl-2 md:ml-6 md:pl-4 border-l-2 border-[var(--color-primary)]" : ""}`}>
      {replyTo && (
        <p className="text-xs text-[var(--color-muted)] mb-2">回复评论中...</p>
      )}
      <input
        type="text"
        placeholder="你的昵称"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        className="w-full border border-[var(--color-hairline)] rounded-md py-2 px-3 text-sm bg-[var(--color-canvas)] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] mb-2 transition-colors"
      />
      <textarea
        placeholder="写下你的想法...（支持 Markdown）"
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        rows={3}
        className="w-full border border-[var(--color-hairline)] rounded-md py-2 px-3 text-sm bg-[var(--color-canvas)] text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)] mb-2 resize-y transition-colors"
      />
      {error && <p className="text-xs text-[var(--color-error)] mb-2">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-[var(--color-primary)] text-white text-[13px] font-medium py-1.5 px-4 rounded-md border-none cursor-pointer hover:bg-[var(--color-primary-active)] disabled:opacity-50 transition-colors"
        >
          {submitting ? "提交中..." : "提交"}
        </button>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  replyTo,
  author,
  body,
  error,
  submitting,
  onReply,
  onAuthorChange,
  onBodyChange,
  onSubmit,
}: {
  comment: CommentData;
  replyTo: number | null;
  author: string;
  body: string;
  error: string;
  submitting: boolean;
  onReply: (id: number) => void;
  onAuthorChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onSubmit: (parentId: number) => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-[var(--color-surface-card)] flex items-center justify-center text-[11px] font-medium text-[var(--color-muted)] flex-shrink-0">
          {comment.author[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-[var(--color-ink)]">
              {comment.author}
            </span>
            <time className="text-[11px] text-[var(--color-muted-soft)]">
              {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
            </time>
          </div>
          <div className="text-sm text-[var(--color-body)] leading-relaxed whitespace-pre-wrap">
            {comment.body}
          </div>
          <button
            onClick={() => onReply(comment.id)}
            className="text-[12px] text-[var(--color-muted)] bg-transparent border-none cursor-pointer hover:text-[var(--color-primary)] mt-1 transition-colors"
          >
            回复
          </button>

          {replyTo === comment.id && (
            <div className="mt-3">
              <CommentForm
                author={author}
                body={body}
                error={error}
                submitting={submitting}
                replyTo={comment.id}
                onAuthorChange={onAuthorChange}
                onBodyChange={onBodyChange}
                onSubmit={() => onSubmit(comment.id)}
              />
            </div>
          )}

          {(comment.replies || []).length > 0 && (
            <div className="mt-3 space-y-3 ml-2 pl-2 md:pl-4 border-l-2 border-[var(--color-hairline)]">
              {(comment.replies || []).map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-surface-card)] flex items-center justify-center text-[10px] font-medium text-[var(--color-muted)] flex-shrink-0">
                    {reply.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[12px] font-medium text-[var(--color-ink)]">
                        {reply.author}
                      </span>
                      <time className="text-[10px] text-[var(--color-muted-soft)]">
                        {new Date(reply.createdAt).toLocaleDateString("zh-CN")}
                      </time>
                    </div>
                    <div className="text-[13px] text-[var(--color-body)] leading-relaxed whitespace-pre-wrap">
                      {reply.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
