/**
 * 文件名: src/app/layout.tsx
 * 功能描述: 智能旅行规划助手的Next.js布局组件
 * 
 * 包含内容:
 *   - 应用的根布局组件
 *   - 设置页面元数据和标题
 *   - 引入全局样式和字体
 */

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '智能旅行规划助手',
  description: 'AI驱动的旅行行程规划对话平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
      </body>
    </html>
  );
} 