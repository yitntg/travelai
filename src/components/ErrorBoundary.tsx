/**
 * 文件名: src/components/ErrorBoundary.tsx
 * 功能描述: React错误边界组件
 * 
 * 包含内容:
 *   - 捕获子组件中的JavaScript错误
 *   - 提供优雅的错误显示界面
 *   - 防止整个应用因单个组件错误而崩溃
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('组件错误:', error);
    console.error('错误栈信息:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 m-4 bg-red-100 text-red-800 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-2">组件加载出错</h3>
          <p className="mb-2">抱歉，页面组件加载时遇到错误。</p>
          <p className="text-sm">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 