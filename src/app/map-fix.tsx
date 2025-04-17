'use client';

/**
 * 地图加载修复脚本 - 临时解决方案
 * 这个脚本将在客户端自动运行，检查和修复地图加载问题
 */

import { useEffect } from 'react';

// 为Window添加Leaflet类型
declare global {
  interface Window {
    L: any;
  }
}

export default function MapFix() {
  useEffect(() => {
    // 检查Leaflet是否已加载
    if (typeof window !== 'undefined' && !window.L) {
      console.log('Leaflet未加载，尝试手动加载...');
      
      // 添加Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // 添加Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = 'anonymous';
      
      // 加载完成后刷新页面
      script.onload = () => {
        console.log('Leaflet加载成功，等待初始化...');
        setTimeout(() => {
          console.log('重新渲染页面...');
          // 触发React重新渲染
          window.dispatchEvent(new Event('resize'));
        }, 1000);
      };
      
      document.body.appendChild(script);
    }
  }, []);
  
  // 这个组件不渲染任何内容
  return null;
} 