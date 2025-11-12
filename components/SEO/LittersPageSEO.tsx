import SEO from "../SEO";
import { useRouter } from "next/router";
import csSEO from "../../locales/cs/seo.json";
import enSEO from "../../locales/en/seo.json";
import deSEO from "../../locales/de/seo.json";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateKittenProductSchema,
} from "../../utils/structuredData";
import type { WithContext, Thing } from "schema-dts";

interface Kitten {
  name: string;
  description?: string;
  images: string[];
  color?: string;
  variety?: string;
  birthDate?: string;
  gender?: string;
  status?: string;
}

interface LittersPageSEOProps {
  kittens?: Kitten[];
}

const LittersPageSEO = ({ kittens }: LittersPageSEOProps) => {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csSEO,
    en: enSEO,
    de: deSEO,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const seo = t.litters;

  const breadcrumbNames = {
    cs: { home: "Domů", current: "Vrhy" },
    en: { home: "Home", current: "Litters" },
    de: { home: "Startseite", current: "Würfe" },
  };

  const names =
    breadcrumbNames[locale as keyof typeof breadcrumbNames] ||
    breadcrumbNames.cs;

  const structuredData: Array<WithContext<Thing>> = [
    generateOrganizationSchema(locale as string),
    generateBreadcrumbSchema([
      { name: names.home, url: "https://www.ragdolls.cz" },
      { name: names.current, url: "https://www.ragdolls.cz/litters" },
    ]),
  ];

  // Add Product schema for available kittens
  if (kittens && kittens.length > 0) {
    kittens.forEach((kitten) => {
      // Only add Product schema for available kittens
      if (kitten.status !== "sold" && kitten.status !== "reserved") {
        const kittenDescription =
          kitten.description || `${kitten.name} - Ragdoll kitten`;
        structuredData.push(
          generateKittenProductSchema({
            name: kitten.name,
            description: kittenDescription,
            images: kitten.images,
            breed: "Ragdoll",
            color: kitten.color,
            variety: kitten.variety,
            birthDate: kitten.birthDate,
            gender: kitten.gender,
            availability:
              kitten.status === "available" ? "InStock" : "PreOrder",
          })
        );
      }
    });
  }

  return (
    <SEO
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      ogImage="/og.png"
      ogUrl="https://www.ragdolls.cz/litters"
      ogType="website"
      twitterCard="summary_large_image"
      canonicalUrl="https://www.ragdolls.cz/litters"
      structuredData={structuredData}
    />
  );
};

export default LittersPageSEO;
