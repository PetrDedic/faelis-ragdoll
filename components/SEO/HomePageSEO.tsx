import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structuredData";

const HomePageSEO = () => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.home;

  const breadcrumbNames = {
    cs: "Domů",
    en: "Home",
    de: "Startseite",
  };

  const baseUrl = "https://www.ragdolls.cz";
  const localePrefix = locale !== "cs" ? `/${locale}` : "";
  const canonicalUrl = `${baseUrl}${localePrefix}`;

  const structuredData = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      {
        name:
          breadcrumbNames[locale as keyof typeof breadcrumbNames] ||
          breadcrumbNames.cs,
        url: canonicalUrl,
      },
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

export default HomePageSEO;
