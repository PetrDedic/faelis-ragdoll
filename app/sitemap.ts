import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ragdolls.cz";
  const locales = ["cs", "en", "de"];
  const defaultLocale = "cs";

  // Define all public pages
  const publicPages = [
    "", // home page
    "about",
    "achievements",
    "cats",
    "contact",
    "gallery",
    "litters",
    "ragdoll",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for each page in each language
  publicPages.forEach((page) => {
    locales.forEach((locale) => {
      const route = page === "" ? "" : `/${page}`;
      const url =
        locale === defaultLocale
          ? `${baseUrl}${route}`
          : `${baseUrl}/${locale}${route}`;

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(page),
        priority: getPriority(page),
        alternates: {
          languages: generateAlternates(page, locales, baseUrl, defaultLocale),
        },
      });
    });
  });

  return sitemap;
}

function getChangeFrequency(
  page: string
): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" {
  // Home page and dynamic content pages change more frequently
  if (page === "" || page === "litters" || page === "cats") {
    return "weekly";
  }
  // Gallery and achievements update occasionally
  if (page === "gallery" || page === "achievements") {
    return "monthly";
  }
  // Static content pages
  return "yearly";
}

function getPriority(page: string): number {
  // Home page has highest priority
  if (page === "") return 1.0;

  // Main pages
  if (page === "cats" || page === "litters" || page === "ragdoll") {
    return 0.8;
  }

  // Secondary pages
  if (page === "about" || page === "achievements" || page === "gallery") {
    return 0.6;
  }

  // Contact page
  if (page === "contact") return 0.5;

  return 0.5;
}

function generateAlternates(
  page: string,
  locales: string[],
  baseUrl: string,
  defaultLocale: string
): Record<string, string> {
  const alternates: Record<string, string> = {};
  const route = page === "" ? "" : `/${page}`;

  locales.forEach((locale) => {
    const url =
      locale === defaultLocale
        ? `${baseUrl}${route}`
        : `${baseUrl}/${locale}${route}`;

    alternates[locale] = url;
  });

  // Add x-default for the default locale
  alternates["x-default"] = `${baseUrl}${route}`;

  return alternates;
}
