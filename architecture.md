# 智能旅行规划助手 - 架构设计文档

## 架构概述

本项目采用模块化、松耦合的架构设计，通过事件总线(Event Bus)模式实现组件间的通信，确保各功能模块独立运行的同时保持必要的数据流动。

## 核心设计理念

1. **关注点分离(Separation of Concerns)**
   - 每个组件专注于单一职责
   - 业务逻辑、UI展示、数据管理分离

2. **松耦合(Loose Coupling)**
   - 组件间通过事件通信而非直接引用
   - 减少组件间的依赖关系，提高可维护性

3. **可测试性(Testability)**
   - 组件逻辑独立，便于单元测试
   - 模块间接口清晰，便于集成测试

4. **可扩展性(Extensibility)**
   - 新功能可以通过订阅现有事件或发布新事件轻松集成
   - 核心模块变更不影响周边功能

## 主要组件

### 1. 聊天模块
- **ChatInterface**: 负责用户交互和消息显示
- **ChatService**: 处理消息收发和AI对话逻辑

### 2. 地图模块
- **TravelMap**: 显示地点和路线
- **TravelMapContext**: 管理地图数据状态

### 3. 事件总线
- **EventBus**: 提供全局事件发布/订阅机制
- 定义标准事件类型，实现组件间通信

### 4. 行程数据模块
- **TripDisplay**: 展示行程详情
- **Trip相关类型**: 定义行程数据结构

## 通信流程

系统采用基于事件的通信机制，主要事件流程如下：

```
用户输入 -> ChatInterface -> ChatService -> API调用
                                       -> 接收响应
                                       -> 发布事件(CHAT_RESPONSE_RECEIVED)
                                       
                                       如有行程数据:
                                       -> 发布事件(CHAT_TRIP_GENERATED)
                                       -> 发布事件(MAP_LOCATIONS_UPDATED)
                                       
ChatPage <- 订阅事件(CHAT_TRIP_GENERATED) <- 
TravelMap <- 订阅事件(MAP_LOCATIONS_UPDATED) <-

用户点击地图标记 -> TravelMap -> 发布事件(MAP_LOCATION_SELECTED)
                              -> ChatPage <- 订阅事件(MAP_LOCATION_SELECTED)
                              -> 显示地点详情
```

## 事件类型

系统定义了以下标准事件：

```typescript
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
```

## 错误处理

系统采用集中式错误处理机制：

1. 组件内部捕获错误并通过事件总线发布错误事件
2. 应用顶层组件订阅错误事件并统一处理显示
3. 使用React Error Boundary处理渲染错误

## 性能考虑

1. 使用React的`useCallback`和`useMemo`避免不必要的重渲染
2. 将复杂计算和状态逻辑抽离到自定义Hook中
3. 事件处理使用防抖和节流技术

## 扩展方向

1. **离线支持**: 添加本地缓存和离线行程管理
2. **多语言支持**: 引入i18n框架支持多语言
3. **用户账户**: 集成用户认证和个人行程存储
4. **增强地图功能**: 添加多种地图源、路线规划、地点搜索等功能

## 安全考虑

1. **API安全**: 采用适当的认证和授权机制
2. **数据验证**: 前后端都进行输入验证
3. **XSS防护**: 使用React的安全机制，避免不安全的HTML注入

## 结论

本架构设计通过事件总线实现组件间松耦合通信，确保各功能模块既能独立运行又能高效协作。这种设计提高了代码的可维护性和可扩展性，同时保持系统的稳定性和性能。 