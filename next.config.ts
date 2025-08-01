/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
      source: '/',
      headers: [
        {
        key: 'Cache-Control',
        value: 's-maxage=1, stale-while-revalidate=59',
        },
      ],
      },
      {
      source: '/faq',
      headers: [
        {
        key: 'Cache-Control',
        value: 's-maxage=1, stale-while-revalidate=59',
        },
      ],
      },
      {
      source: '/about',
      headers: [
        {
        key: 'Cache-Control',
        value: 's-maxage=1, stale-while-revalidate=59',
        },
      ],
      },
      {
      source: '/this-year',
      headers: [
        {
        key: 'Cache-Control',
        value: 's-maxage=1, stale-while-revalidate=59',
        },
      ],
      },
      {
      source: '/legal/:path*',
      headers: [
        {
        key: 'Cache-Control',
        value: 's-maxage=1, stale-while-revalidate=59',
        },
      ],
      },
      {
      source: '/user/:path*',
      headers: [
        {
        key: 'Cache-Control',
        value: 'no-store',
        },
      ],
      },
      {
      source: '/api/:path*',
      headers: [
        {
        key: 'Cache-Control',
        value: 'no-store',
        },
      ],
      },
      {
      source: '/:path*',
      headers: [
        {
        key: 'Cache-Control',
        value: 'no-store',
        },
      ],
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    viewTransition: true,
  },
};

module.exports = nextConfig;