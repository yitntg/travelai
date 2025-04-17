/**
 * 文件名: src/app/layout.tsx
 * 功能描述: 智能旅行规划助手的Next.js布局组件
 * 
 * 包含内容:
 *   - 应用的根布局组件
 *   - 设置页面元数据和标题
 *   - 引入全局样式和字体
 */

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '../contexts/NotificationContext';
import { TravelMapProvider } from '../contexts/TravelMapContext';

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
      <head>
        {/* 
          注意：这是测试密钥，仅用于开发环境
          在生产环境中，应使用您自己申请的百度地图API密钥
          请访问 http://lbsyun.baidu.com/ 申请
        */}
        <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=rGqFAjHlqKe8hiP3GIpG1tDqeQMdjjZ8"></script>
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <TravelMapProvider>
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
              {children}
            </main>
          </TravelMapProvider>
        </NotificationProvider>
      </body>
    </html>
  );
} 