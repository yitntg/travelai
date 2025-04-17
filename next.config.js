/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 移除standalone输出模式，使用默认
  swcMinify: true,
  // 添加Cloudflare Pages特定配置
  images: {
    unoptimized: true, // 在Cloudflare上禁用图像优化
  },
};

module.exports = nextConfig; 