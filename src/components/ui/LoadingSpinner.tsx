/**
 * 文件名: src/components/ui/LoadingSpinner.tsx
 * 功能描述: 加载动画组件
 * 
 * 包含内容:
 *   - 可自定义大小的加载动画
 *   - 支持不同颜色主题
 *   - 带有可选文本提示
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  // 定义大小映射
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // 定义颜色映射
  const colorMap = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };
  
  const spinnerElement = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-full' : ''}`}>
      <svg 
        className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 text-sm ${colorMap[color]}`}>{text}</p>}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinnerElement}
      </div>
    );
  }
  
  return spinnerElement;
} 