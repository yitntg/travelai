/**
 * 文件名: src/components/ui/MobileNav.tsx
 * 功能描述: 移动端导航栏组件
 * 
 * 包含内容:
 *   - 响应式移动导航栏
 *   - 汉堡菜单切换
 *   - 在小屏幕上显示主导航项
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden">
      {/* 汉堡菜单按钮 */}
      <button 
        onClick={toggleMenu}
        className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
        aria-label="导航菜单"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 移动菜单 */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-10 border-t border-gray-200">
          <div className="py-2 px-4">
            <Link 
              href="/" 
              className="block py-2 text-blue-600 hover:bg-blue-50 rounded px-3"
              onClick={() => setIsOpen(false)}
            >
              首页
            </Link>
            <Link 
              href="/chat" 
              className="block py-2 text-blue-600 hover:bg-blue-50 rounded px-3"
              onClick={() => setIsOpen(false)}
            >
              开始规划旅行
            </Link>
            <Link 
              href="/examples" 
              className="block py-2 text-blue-600 hover:bg-blue-50 rounded px-3"
              onClick={() => setIsOpen(false)}
            >
              示例行程
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 