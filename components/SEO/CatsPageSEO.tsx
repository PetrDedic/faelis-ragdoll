import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateCatItemListSchema,
} from "../../utils/structuredData";
import type { WithContext, Thing } from "schema-dts";

interface CatsPageSEOProps {
  cats?: Array<{
    name: string;
    image?: string;
    description?: string;
  }>;
}

const CatsPageSEO = ({ cats }: CatsPageSEOProps) => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.cats;

  const breadcrumbNames = {
    cs: { home: "Domů", current: "Kočky" },
    en: { home: "Home", current: "Cats" },
    de: { home: "Startseite", current: "Katzen" },
  };

  const names =
    breadcrumbNames[locale as keyof typeof breadcrumbNames] ||
    breadcrumbNames.cs;

  const structuredData: Array<WithContext<Thing>> = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      { name: names.home, url: "https://www.ragdolls.cz" },
      { name: names.current, url: "https://www.ragdolls.cz/cats" },
    ]),
  ];

  // Add ItemList if cats data is provided
  if (cats && cats.length > 0) {
    structuredData.push(generateCatItemListSchema(cats));
  }

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      ogImage="/og.png"
      ogUrl="https://www.ragdolls.cz/cats"
      ogType="website"
      twitterCard="summary_large_image"
      canonicalUrl="https://www.ragdolls.cz/cats"
      structuredData={structuredData}
    />
  );
};

export default CatsPageSEO;
