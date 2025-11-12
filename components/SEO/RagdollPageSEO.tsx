import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "../../utils/structuredData";

const RagdollPageSEO = () => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.ragdoll;

  const breadcrumbNames = {
    cs: { home: "Domů", current: "Ragdoll" },
    en: { home: "Home", current: "Ragdoll" },
    de: { home: "Startseite", current: "Ragdoll" },
  };

  const names =
    breadcrumbNames[locale as keyof typeof breadcrumbNames] ||
    breadcrumbNames.cs;

  const structuredData = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      { name: names.home, url: "https://www.ragdolls.cz" },
      { name: names.current, url: "https://www.ragdolls.cz/ragdoll" },
    ]),
  ];

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      ogImage="/og.png"
      ogUrl="https://www.ragdolls.cz/ragdoll"
      ogType="article"
      twitterCard="summary_large_image"
      canonicalUrl="https://www.ragdolls.cz/ragdoll"
      structuredData={structuredData}
    />
  );
};

export default RagdollPageSEO;
