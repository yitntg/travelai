/**
 * 文件名: src/contexts/NotificationContext.tsx
 * 功能描述: 通知上下文提供者
 * 
 * 包含内容:
 *   - 管理应用中的通知状态
 *   - 提供显示不同类型通知的方法
 *   - 处理通知的显示和隐藏逻辑
 */

'use client';

import React from 'react';
import Notification, { NotificationType } from '../components/ui/Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  hideNotification: (id: string) => void;
  // 便捷方法
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification 必须在 NotificationProvider 内部使用');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);

  const showNotification = (type: NotificationType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 便捷方法
  const showSuccess = (message: string, duration?: number) => 
    showNotification('success', message, duration);
  
  const showError = (message: string, duration?: number) => 
    showNotification('error', message, duration);
  
  const showInfo = (message: string, duration?: number) => 
    showNotification('info', message, duration);
  
  const showWarning = (message: string, duration?: number) => 
    showNotification('warning', message, duration);

  const value = {
    notifications,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
} 