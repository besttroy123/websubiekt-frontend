/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Wyłącza błędy ESLint przy budowaniu na Railway
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/inventory',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
