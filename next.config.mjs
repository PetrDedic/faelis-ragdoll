/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    // These are all the locales you want to support
    locales: ["cs", "en", "de"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
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
    ],
  },
};

export default nextConfig;
