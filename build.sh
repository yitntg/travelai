#!/bin/bash
# 显示节点版本
echo "Node version:"
node -v
echo "NPM version:"
npm -v

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建Next.js应用
echo "Building Next.js application..."
npm run build

# 显示构建结果
echo "Build complete. Contents of .next directory:"
ls -la .next || echo "No .next directory found!" 