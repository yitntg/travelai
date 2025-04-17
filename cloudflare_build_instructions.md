# Cloudflare Pages 构建说明

请按照以下步骤在Cloudflare Pages上正确配置项目：

## 1. 在 Cloudflare Pages 中设置构建命令

登录 Cloudflare Dashboard，进入 Pages 项目设置，然后添加以下配置：

- **构建命令**: `npm run build`
- **构建输出目录**: `out`
- **环境变量**:
  - `NODE_VERSION`: `18`
  - `NPM_VERSION`: `9`

## 2. 如果上述配置不起作用，尝试以下方法

在 Cloudflare Pages 中的项目设置里：

1. 点击前往"Settings" > "Builds & deployments"
2. 构建配置区域，添加以下构建命令：
   ```
   npm install && npm run build
   ```
3. 设置构建输出目录为：`out`
4. 在环境变量部分添加：
   - `NODE_VERSION`: `18`

## 3. 在GitHub Actions中设置自动构建和部署

为了使 GitHub Actions 工作正常，需要在 GitHub 仓库的设置中添加以下密钥：

- `CLOUDFLARE_API_TOKEN`: 您的 Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID`: 您的 Cloudflare 账户 ID

可以通过以下步骤设置：
1. 前往 GitHub 仓库
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Secrets and variables" > "Actions"
4. 点击 "New repository secret" 添加上述密钥

## 4. 手动触发部署

如果您想立即看到变化效果，可以：

1. 前往 Cloudflare Dashboard
2. 进入 Pages > 您的项目
3. 点击 "Deployments" 标签
4. 找到最近的部署，点击 "..." > "Retry deployment" 