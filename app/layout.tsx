import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "个性单词本 · Personal Wordbook",
  description: "支持 PDF 导入、考试分类、词缀整理与复习记录的个人单词本。",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "单词本", statusBarStyle: "default" },
  icons: {
    apple: "/icon-192.png",
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
