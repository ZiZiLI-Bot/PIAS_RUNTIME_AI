/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3002', pathname: '/file/**' },
      { protocol: 'https', hostname: 'api.paperread.chuhung.com', pathname: '/file/**' },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
