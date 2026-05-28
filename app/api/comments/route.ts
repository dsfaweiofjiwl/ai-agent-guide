import { NextRequest, NextResponse } from "next/server";
import { getComments, createComment } from "@/lib/db";

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "articleId required" }, { status: 400 });
  }

  const comments = getComments(parseInt(articleId));
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { articleId, parentId, author, body: commentBody } = body;

  if (!articleId || !author?.trim() || !commentBody?.trim()) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  if (author.trim().length > 50) {
    return NextResponse.json({ error: "昵称不能超过50字" }, { status: 400 });
  }

  if (commentBody.trim().length > 5000) {
    return NextResponse.json({ error: "评论不能超过5000字" }, { status: 400 });
  }

  const comment = createComment(
    parseInt(String(articleId)),
    parentId ? parseInt(String(parentId)) : null,
    author.trim(),
    commentBody.trim()
  );

  return NextResponse.json(comment);
}
