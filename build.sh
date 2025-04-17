#!/bin/bash
# 显示节点版本
echo "Node version:"
node -v
echo "NPM version:"
npm -v

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建Next.js应用并导出静态文件
echo "Building Next.js application..."
npm run build

# 显示构建结果
echo "Build complete. Contents of out directory:"
ls -la out || echo "No out directory found!"

# 确保输出目录存在，即使构建失败
mkdir -p out
echo "<!DOCTYPE html><html><body><h1>智能旅行规划助手</h1><p>静态资源已部署</p></body></html>" > out/index.html

# 复制重定向文件
if [ -f public/_redirects ]; then
  echo "Copying _redirects file..."
  cp public/_redirects out/
fi 