/**
 * 文件名: src/components/ui/ResponsiveLayout.tsx
 * 功能描述: 响应式布局组件
 * 
 * 包含内容:
 *   - 移动端与桌面端响应式布局
 *   - 统一导航栏和页脚
 *   - 良好的内容区域结构
 */

'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';

interface ResponsiveLayoutProps {
  children: ReactNode;
  hideNavFooter?: boolean;
}

export default function ResponsiveLayout({ children, hideNavFooter = false }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavFooter && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-blue-600">智能旅行规划助手</span>
                </Link>
              </div>
              
              {/* 桌面导航 */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link href="/chat" className="px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800">
                  开始规划旅行
                </Link>
                <Link href="/examples" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  示例行程
                </Link>
              </div>
              
              {/* 移动导航 */}
              <MobileNav />
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!hideNavFooter && (
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} 智能旅行规划助手 · 由AI提供支持
              </p>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  首页
                </Link>
                <Link href="/chat" className="text-sm text-gray-500 hover:text-gray-700">
                  开始规划
                </Link>
                <Link href="/examples" className="text-sm text-gray-500 hover:text-gray-700">
                  示例行程
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
} 