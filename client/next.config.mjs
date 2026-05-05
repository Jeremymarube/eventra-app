import { fileURLToPath } from 'url';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'http://localhost:5000/static/:path*',
      },
    ];
  },
};
export default nextConfig;
