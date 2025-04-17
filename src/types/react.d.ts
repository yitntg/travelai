/**
 * 文件名: src/types/react.d.ts
 * 功能描述: React类型声明文件
 * 
 * 包含内容:
 *   - 为React模块添加必要的类型声明
 *   - 解决TypeScript中React hooks使用问题
 */

import 'react';

declare module 'react' {
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  function useRef<T>(initialValue: T): { current: T };
  function useContext<T>(context: React.Context<T>): T;
}

declare module 'react-dom';
declare module 'next/link';
declare module 'next/font/google';
declare module 'next/server'; 