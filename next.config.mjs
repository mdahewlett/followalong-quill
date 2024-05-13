/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
      // adding signout redirect
      {
        source: "/sign-out",
        destination: "/api/auth/logout",
        permanent: true,
      }
      // end adding signout redirect
    ]
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },

  images: {
    domains: ['lh3.googleusercontent.com'], // to allow google auth
  },

};

export default nextConfig;
