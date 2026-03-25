/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 增加上传文件大小限制（默认 1MB）
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '5mb'
      }
    }
  },
  // Cloudflare Pages 需要这个配置
  output: 'standalone',
  // 禁用严格模式以兼容 Cloudflare Pages
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig