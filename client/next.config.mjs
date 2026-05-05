import { fileURLToPath } from 'url';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://eventra-api-bd4i.onrender.com/api/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'https://eventra-api-bd4i.onrender.com/static/:path*',
      },
    ];
  },
};
export default nextConfig;
