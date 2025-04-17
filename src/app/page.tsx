/**
 * 文件名: src/app/page.tsx
 * 功能描述: 智能旅行规划助手的Next.js首页组件
 * 
 * 包含内容:
 *   - 网站首页的React组件
 *   - 展示应用介绍和使用步骤
 *   - 提供导航到聊天页面的链接按钮
 */

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        智能旅行规划助手
      </h1>
      <p className="text-xl text-center text-gray-700 mb-12">
        通过AI对话，轻松规划您的完美旅行行程
      </p>
      
      <div className="flex justify-center">
        <Link href="/chat" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
          开始规划我的旅行
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">智能对话</h2>
          <p className="text-gray-700">通过自然语言交流，告诉AI您的旅行偏好、日期和目的地</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">个性化行程</h2>
          <p className="text-gray-700">获取根据您的兴趣和需求定制的详细旅行计划</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">可视化地图</h2>
          <p className="text-gray-700">在地图上查看您的行程路线和景点位置</p>
        </div>
      </div>
    </div>
  );
} 