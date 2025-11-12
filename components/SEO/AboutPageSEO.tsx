import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structuredData";

const AboutPageSEO = () => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.about;

  const breadcrumbNames = {
    cs: { home: "Domů", current: "O nás" },
    en: { home: "Home", current: "About" },
    de: { home: "Startseite", current: "Über uns" },
  };

  const names = breadcrumbNames[locale as keyof typeof breadcrumbNames] || breadcrumbNames.cs;

  const structuredData = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      { name: names.home, url: "https://www.ragdolls.cz" },
      { name: names.current, url: "https://www.ragdolls.cz/about" },
    ]),
  ];

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      ogImage="/og.png"
      ogUrl="https://www.ragdolls.cz/about"
      ogType="website"
      twitterCard="summary_large_image"
      canonicalUrl="https://www.ragdolls.cz/about"
      structuredData={structuredData}
    />
  );
};

export default AboutPageSEO;
