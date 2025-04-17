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
import Script from 'next/script';

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
        {/* Leaflet地图CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <TravelMapProvider>
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
              {children}
            </main>
          </TravelMapProvider>
        </NotificationProvider>
        {/* Leaflet地图JavaScript */}
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
} 