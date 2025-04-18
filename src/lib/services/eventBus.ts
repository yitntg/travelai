/**
 * 文件名: src/lib/services/eventBus.ts
 * 功能描述: 事件总线服务
 * 
 * 包含内容:
 *   - 提供全局事件订阅和发布机制
 *   - 允许组件间松耦合通信
 *   - 支持类型安全的事件处理
 */

'use client';

// 事件类型定义
export const APP_EVENTS = {
  // 地图相关事件
  MAP_LOCATIONS_UPDATED: 'map:locations_updated',
  MAP_LOCATION_SELECTED: 'map:location_selected',
  MAP_ACTIVE_DAY_CHANGED: 'map:active_day_changed',
  
  // 聊天相关事件
  CHAT_MESSAGE_SENT: 'chat:message_sent',
  CHAT_RESPONSE_RECEIVED: 'chat:response_received',
  CHAT_TRIP_GENERATED: 'chat:trip_generated',
  
  // 通用应用事件
  APP_ERROR: 'app:error',
  APP_LOADING: 'app:loading',
  APP_READY: 'app:ready'
};

type EventCallback = (detail: any) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns 取消订阅的函数
   */
  subscribe(eventName: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    const callbacks = this.listeners.get(eventName)!;
    callbacks.push(callback);
    
    // 返回取消订阅的函数
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param detail 事件数据
   */
  publish(eventName: string, detail: any): void {
    if (!this.listeners.has(eventName)) {
      return;
    }
    
    const callbacks = this.listeners.get(eventName)!;
    callbacks.forEach(callback => {
      try {
        callback(detail);
      } catch (error) {
        console.error(`事件处理错误 (${eventName}):`, error);
      }
    });
    
    // 同时触发DOM事件，用于跨组件通信
    this.dispatchDOMEvent(eventName, detail);
  }
  
  /**
   * 分发DOM自定义事件
   * @param eventName 事件名称
   * @param detail 事件数据
   */
  private dispatchDOMEvent(eventName: string, detail: any): void {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }
  
  /**
   * 监听DOM事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns 取消监听的函数
   */
  listenToDOM(eventName: string, callback: EventCallback): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };
    
    window.addEventListener(eventName, handler);
    return () => {
      window.removeEventListener(eventName, handler);
    };
  }
  
  /**
   * 清除特定事件的所有监听器
   * @param eventName 事件名称
   */
  clear(eventName: string): void {
    if (this.listeners.has(eventName)) {
      this.listeners.delete(eventName);
    }
  }
  
  /**
   * 清除所有事件监听器
   */
  clearAll(): void {
    this.listeners.clear();
  }
}

// 创建单例实例
const eventBus = new EventBus();

// 导出单例实例
export default eventBus; 