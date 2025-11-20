/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["cs", "en", "de"],
    defaultLocale: "cs",
  },
  images: {
    remotePatterns: [
      {
        hostname: "tcdwmbbmqgeuzzubnjmg.supabase.co",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "127.0.0.1",
      },
    ],
  },

  staticPageGenerationTimeout: 300,
};

export default nextConfig;
