import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // 301 redirect (SEO friendly)
      },
    ];
  },
};

export default nextConfig;
