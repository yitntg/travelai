/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 关键修改：使用静态导出，这在Cloudflare Pages上非常可靠
  output: 'export',
  // 禁用图像优化
  images: {
    unoptimized: true,
  },
  // 为Cloudflare Pages特别添加
  trailingSlash: true,
};

module.exports = nextConfig; 