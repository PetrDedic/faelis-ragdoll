import { MetadataRoute } from "next";
import supabase from "../utils/supabase/client";

// Helper to encode paths (matches your existing logic)
const encodeGalleryPath = (path: string) => {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
};

// Global counter for logging progress during build
let totalProcessed = 0;

async function getGalleryRoutes(prefix = ""): Promise<string[]> {
  try {
    // Fetch items in the current folder
    const { data, error } = await supabase.storage
      .from("gallery")
      .list(prefix, { limit: 1000 });

    if (error || !data) {
      console.error(`[Sitemap] Error fetching ${prefix}:`, error);
      return [];
    }

    // Filter out system files and the excluded folder immediately
    const validItems = data.filter(
      (item) =>
        item.name !== ".emptyFolderPlaceholder" &&
        item.name !== "downloaded_gallery" // <--- EXCLUSION HERE
    );

    // Process items in PARALLEL to avoid timeouts
    const results = await Promise.all(
      validItems.map(async (item) => {
        const itemRawPath = prefix ? `${prefix}/${item.name}` : item.name;

        // Basic check: if it has metadata.size, it's likely a file. Otherwise treat as folder.
        // (Adjust this logic if your Supabase setup differs)
        const isImage =
          /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.name) &&
          item.metadata;

        // Logging progress every 50 items
        totalProcessed++;
        if (totalProcessed % 50 === 0) {
          console.log(`[Sitemap] Crawled ${totalProcessed} gallery items...`);
        }

        if (isImage) {
          // Return the image path
          return [itemRawPath];
        } else {
          // If it's a folder, recurse deeper
          // We return the folder path itself AND its children
          const childrenPaths = await getGalleryRoutes(itemRawPath);
          return [itemRawPath, ...childrenPaths];
        }
      })
    );

    // Flatten the array of arrays
    return results.flat();
  } catch (e) {
    console.error("[Sitemap] Recursive crawl error:", e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("[Sitemap] Starting generation...");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ragdolls.cz";
  const locales = ["cs", "en", "de"];
  const defaultLocale = "cs";

  const staticPages = [
    "",
    "about",
    "achievements",
    "cats",
    "contact",
    "gallery",
    "litters",
    "ragdoll",
  ];

  // Fetch dynamic gallery routes
  // This will now run faster and skip 'downloaded_gallery'
  const galleryRawPaths = await getGalleryRoutes();
  console.log(
    `[Sitemap] Finished crawling. Found ${galleryRawPaths.length} gallery items.`
  );

  const galleryPages = galleryRawPaths.map(
    (path) => `gallery/${encodeGalleryPath(path)}`
  );
  const allPages = [...staticPages, ...galleryPages];

  const sitemap: MetadataRoute.Sitemap = [];

  allPages.forEach((page) => {
    locales.forEach((locale) => {
      const route = page === "" ? "" : `/${page}`;
      const url =
        locale === defaultLocale
          ? `${baseUrl}${route}`
          : `${baseUrl}/${locale}${route}`;

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.startsWith("gallery/") ? "monthly" : "weekly",
        priority: page === "" ? 1.0 : 0.7,
        alternates: {
          languages: locales.reduce(
            (acc, loc) => {
              const altUrl =
                loc === defaultLocale
                  ? `${baseUrl}${route}`
                  : `${baseUrl}/${loc}${route}`;
              return { ...acc, [loc]: altUrl };
            },
            { "x-default": `${baseUrl}${route}` }
          ),
        },
      });
    });
  });

  return sitemap;
}
