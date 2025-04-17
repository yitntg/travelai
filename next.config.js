/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 优化构建输出
  swcMinify: true,      // 使用SWC压缩
};

module.exports = nextConfig; 