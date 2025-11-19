// Utility functions for generating Schema.org structured data (JSON-LD)
import type {
  WithContext,
  Organization,
  PetStore,
  BreadcrumbList,
  ItemList,
  Product,
  PostalAddress,
  ContactPoint,
  ListItem,
  Offer,
  PropertyValue,
  UnitPriceSpecification,
} from "schema-dts";

/**
 * Generate Organization structured data for Faelis cattery
 */
export const generateOrganizationSchema = (
  locale: string = "cs"
): WithContext<PetStore> => {
  const descriptions = {
    cs: "Chovatelská stanice Faelis - profesionální chov koček plemene Ragdoll v Praze",
    en: "Faelis Cattery - professional Ragdoll cat breeding in Prague",
    de: "Faelis Katzenzucht - professionelle Ragdoll Katzenzucht in Prag",
  };

  return {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: "Faelis",
    url: "https://www.ragdolls.cz",
    logo: "https://www.ragdolls.cz/images/Logo_v2.svg",
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.cs,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nad Nádražím 433/16",
      addressLocality: "Praha 10",
      postalCode: "103 00",
      addressCountry: "CZ",
    },
    telephone: "+420-602-278-682",
    email: "marta@ragdolls.cz",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+420-602-278-682",
      contactType: "customer service",
      email: "marta@ragdolls.cz",
      availableLanguage: ["cs", "en", "de"],
    },
    sameAs: [
      "https://www.facebook.com/FaelisRagdolls",
      "https://www.instagram.com/martafaelis",
    ],
  };
};

/**
 * Generate Breadcrumb structured data
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url?: string }>
): WithContext<BreadcrumbList> => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
};

/**
 * Generate ItemList structured data for cats
 * Note: Not using Product type to avoid Google's requirement for offers/reviews/rating
 */
export const generateCatListSchema = (
  cats: Array<{
    name: string;
    image?: string;
    description?: string;
    url?: string;
  }>
): WithContext<ItemList> => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cats.map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: cat.name,
        image: cat.image,
        description: cat.description,
        url: cat.url,
      },
    })),
  };
};

/**
 * Generate Product structured data for a kitten
 */
export const generateKittenProductSchema = (kitten: {
  name: string;
  description: string;
  images: string[];
  breed: string;
  color?: string;
  variety?: string;
  birthDate?: string;
  gender?: string;
  price?: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
}): WithContext<Product> => {
  const additionalProperties: PropertyValue[] = [
    {
      "@type": "PropertyValue",
      name: "Breed",
      value: kitten.breed,
    },
  ];

  if (kitten.color) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Color",
      value: kitten.color,
    });
  }

  if (kitten.variety) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Variety",
      value: kitten.variety,
    });
  }

  if (kitten.birthDate) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Birth Date",
      value: kitten.birthDate,
    });
  }

  if (kitten.gender) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Gender",
      value: kitten.gender,
    });
  }

  const schema: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kitten.name,
    description: kitten.description,
    image: kitten.images.length > 0 ? kitten.images : kitten.images[0],
    brand: {
      "@type": "Organization",
      name: "Faelis",
    },
    additionalProperty: additionalProperties,
  };

  // Add offers if price is provided, otherwise add a contact-based offer
  if (kitten.price) {
    schema.offers = {
      "@type": "Offer",
      price: kitten.price.toString(),
      priceCurrency: kitten.priceCurrency || "CZK",
      availability: `https://schema.org/${kitten.availability || "InStock"}`,
      url: kitten.url,
    };
  } else {
    // Add a minimal offer to satisfy Google's Product schema requirements
    // Price of 0 with priceSpecification means "contact for price"
    schema.offers = {
      "@type": "Offer",
      price: "0",
      priceCurrency: kitten.priceCurrency || "CZK",
      availability: `https://schema.org/${kitten.availability || "InStock"}`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "0",
        priceCurrency: kitten.priceCurrency || "CZK",
      },
    } as Offer;
  }

  return schema;
};
