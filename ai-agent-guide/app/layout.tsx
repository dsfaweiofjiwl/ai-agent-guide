import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./components/AppShell";
import { getChapters } from "@/lib/db";
export const metadata: Metadata = {
  title: "AI Agent 开发指南",
  description: "从零开始学习 AI Agent 开发 — LLM、Prompt 工程、Function Calling、Agent 架构",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chapters = getChapters();

  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <AppShell chapters={chapters}>{children}</AppShell>
      </body>
    </html>
  );
}
