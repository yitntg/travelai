/**
 * 文件名: src/components/trips/TripDisplay.tsx
 * 功能描述: 旅行行程展示组件
 * 
 * 包含内容:
 *   - 展示AI生成的旅行行程详情
 *   - 显示每日活动、景点和提示
 *   - 支持保存行程的功能
 *   - 空状态下显示引导信息
 */

'use client';

import React, { useState } from 'react';
import { Trip } from '@/lib/types';
import { saveTrip } from '@/lib/services/apiService';

interface TripDisplayProps {
  trip: Trip | null;
}

export default function TripDisplay({ trip }: TripDisplayProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // 处理保存行程
  const handleSaveTrip = async () => {
    if (!trip) return;
    
    setIsSaving(true);
    try {
      const result = await saveTrip(trip);
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
        // 复制链接到剪贴板
        navigator.clipboard.writeText(result.shareUrl)
          .then(() => alert('分享链接已复制到剪贴板'))
          .catch(err => console.error('复制失败:', err));
      }
    } catch (error) {
      console.error('保存行程失败:', error);
      alert('保存行程失败，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理打印行程
  const handlePrintTrip = () => {
    // 为打印添加当前日期
    document.body.setAttribute('data-print-date', new Date().toLocaleDateString('zh-CN'));
    window.print();
  };

  if (!trip) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">您的行程将在这里显示</h3>
          <p className="text-gray-600">
            通过左侧聊天框告诉AI助手您的旅行计划，系统将自动生成定制化行程并在此展示。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{trip.destination} 行程规划</h2>
        <p className="text-sm text-gray-500">
          {trip.duration} • {trip.travelType}
        </p>
        <div className="flex mt-2">
          <button 
            onClick={handlePrintTrip} 
            className="text-sm flex items-center text-blue-600 hover:text-blue-800 mr-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            打印行程
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {trip.days.map((day, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-md font-medium bg-blue-50 p-2 rounded text-blue-800 mb-3">
              第{index + 1}天: {day.title}
            </h3>
            
            <div className="space-y-4">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="border-l-2 border-blue-200 pl-4 pb-4">
                  <div className="flex items-start">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 flex-1">
                      <p className="font-medium text-gray-800 mb-1">{activity.time} - {activity.title}</p>
                      <p className="text-gray-600 text-sm">{activity.description}</p>
                      
                      {activity.location && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {trip.notes && trip.notes.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h3 className="text-md font-medium text-yellow-800 mb-2">旅行提示与建议</h3>
            <ul className="space-y-2">
              {trip.notes.map((note, index) => (
                <li key={index} className="text-gray-700 text-sm flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        {shareUrl ? (
          <div className="text-center mb-4">
            <p className="text-green-600 mb-2">已成功生成分享链接！</p>
            <a 
              href={shareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {shareUrl}
            </a>
          </div>
        ) : null}

        <button 
          onClick={handleSaveTrip}
          disabled={isSaving}
          className={`w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              保存并分享行程
            </>
          )}
        </button>
      </div>
    </div>
  );
} 