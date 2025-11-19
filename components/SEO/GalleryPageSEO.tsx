import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structuredData";

const GalleryPageSEO = () => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.gallery;

  const breadcrumbNames = {
    cs: { home: "Domů", current: "Galerie" },
    en: { home: "Home", current: "Gallery" },
    de: { home: "Startseite", current: "Galerie" },
  };

  const names = breadcrumbNames[locale as keyof typeof breadcrumbNames] || breadcrumbNames.cs;

  const baseUrl = "https://www.ragdolls.cz";
  const localePrefix = locale !== "cs" ? `/${locale}` : "";
  const canonicalUrl = `${baseUrl}${localePrefix}/gallery`;
  const homeUrl = `${baseUrl}${localePrefix}`;

  const structuredData = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      { name: names.home, url: homeUrl },
      { name: names.current, url: canonicalUrl },
    ]),
  ];

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      ogImage="/og.png"
      ogUrl={canonicalUrl}
      ogType="website"
      twitterCard="summary_large_image"
      canonicalUrl={canonicalUrl}
      structuredData={structuredData}
    />
  );
};

export default GalleryPageSEO;
