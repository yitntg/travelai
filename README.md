# 智能旅行规划助手

基于AI的旅行规划对话平台，帮助用户快速规划个性化的旅行行程。

## 主要功能

- **智能对话规划**：通过自然语言对话，让AI助手了解您的旅行偏好
- **全屏地图展示**：在背景展示全屏地图，实时显示行程地点和路线
- **悬浮聊天界面**：可折叠的聊天界面，让您可以专注查看地图
- **多日行程规划**：支持多日旅行计划，不同天的行程用不同颜色区分
- **地点详情查看**：点击地图上的地点查看详细信息

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- 百度地图API

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## 部署到Cloudflare Pages

### 方法1：通过Cloudflare控制台设置

1. 登录Cloudflare Dashboard
2. 进入Pages项目设置
3. 配置以下设置:
   - **构建命令**: `npm run build`
   - **构建输出目录**: `out`
   - **环境变量**:
     - `NODE_VERSION`: `18`
     - `NPM_VERSION`: `9`

### 方法2：通过GitHub Actions自动部署

已配置GitHub Actions工作流，推送代码到main分支时会自动部署。

需要在GitHub仓库设置中添加以下密钥:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API令牌
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare账户ID

## 项目结构

- `src/app/` - Next.js应用路由和页面
- `src/components/` - React组件
  - `ui/` - 通用UI组件
  - `chat/` - 聊天相关组件
- `src/contexts/` - React上下文提供者
- `src/lib/` - 工具函数和hooks 