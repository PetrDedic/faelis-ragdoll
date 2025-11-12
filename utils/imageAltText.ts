/**
 * Utility functions for generating SEO-friendly and accessible alt texts for images
 */

interface CatAltTextParams {
  name: string;
  gender?: string;
  color?: string;
  variety?: string;
  breed?: string;
  role?: "breeding_male" | "breeding_female" | "kitten";
  cattery?: string;
}

interface LocalizedTerms {
  male: string;
  female: string;
  kitten: string;
  breedingMale: string;
  breedingFemale: string;
  color: string;
  cattery: string;
}

const translations: Record<string, LocalizedTerms> = {
  cs: {
    male: "kocour",
    female: "kočka",
    kitten: "koťátko",
    breedingMale: "chovný kocour",
    breedingFemale: "chovná kočka",
    color: "v barvě",
    cattery: "chovatelské stanice",
  },
  en: {
    male: "male cat",
    female: "female cat",
    kitten: "kitten",
    breedingMale: "breeding male",
    breedingFemale: "breeding female",
    color: "in color",
    cattery: "cattery",
  },
  de: {
    male: "Kater",
    female: "Katze",
    kitten: "Kätzchen",
    breedingMale: "Zuchtkater",
    breedingFemale: "Zuchtkatze",
    color: "in Farbe",
    cattery: "Katzenzucht",
  },
};

/**
 * Generate SEO-friendly alt text for cat/kitten images
 *
 * Example outputs:
 * - CS: "Kocour Ragdoll George v barvě seal mitted, chovný kocour stanice Faelis"
 * - EN: "Ragdoll male cat George in color seal mitted, breeding male of Faelis cattery"
 * - DE: "Ragdoll Kater George in Farbe seal mitted, Zuchtkater der Faelis Katzenzucht"
 */
export const generateCatAltText = (
  params: CatAltTextParams,
  locale: string = "cs"
): string => {
  const t = translations[locale] || translations.cs;
  const breed = params.breed || "Ragdoll";
  const cattery = params.cattery || "Faelis";

  const parts: string[] = [];

  // 1. Gender and breed
  if (params.role === "breeding_male") {
    parts.push(t.breedingMale, breed, params.name);
  } else if (params.role === "breeding_female") {
    parts.push(t.breedingFemale, breed, params.name);
  } else if (params.role === "kitten") {
    parts.push(breed, t.kitten, params.name);
  } else if (params.gender === "male") {
    parts.push(breed, t.male, params.name);
  } else if (params.gender === "female") {
    parts.push(breed, t.female, params.name);
  } else {
    parts.push(breed, params.name);
  }

  // 2. Color and variety
  if (params.color || params.variety) {
    const colorParts: string[] = [];
    if (params.color) colorParts.push(params.color);
    if (params.variety) colorParts.push(params.variety);

    if (colorParts.length > 0) {
      parts.push(t.color, colorParts.join(" "));
    }
  }

  // 3. Cattery reference (for breeding cats)
  if (params.role === "breeding_male" || params.role === "breeding_female") {
    if (locale === "cs") {
      parts.push(`${t.cattery} ${cattery}`);
    } else if (locale === "en") {
      parts.push(`of ${cattery} ${t.cattery}`);
    } else if (locale === "de") {
      parts.push(`der ${cattery} ${t.cattery}`);
    }
  }

  return parts.join(" ");
};

/**
 * Generate alt text for general cat-related images
 */
export const generateGeneralCatAltText = (
  description: string,
  breed: string = "Ragdoll",
  cattery: string = "Faelis",
  locale: string = "cs"
): string => {
  const t = translations[locale] || translations.cs;

  if (locale === "cs") {
    return `${description}, ${breed} ze ${t.cattery} ${cattery}`;
  } else if (locale === "en") {
    return `${description}, ${breed} from ${cattery} ${t.cattery}`;
  } else if (locale === "de") {
    return `${description}, ${breed} aus der ${cattery} ${t.cattery}`;
  }

  return `${description}, ${breed} ${cattery}`;
};

/**
 * Generate alt text for location/facility images
 */
export const generateLocationAltText = (
  description: string,
  locale: string = "cs"
): string => {
  const locationTexts = {
    cs: "chovatelská stanice Faelis",
    en: "Faelis cattery",
    de: "Faelis Katzenzucht",
  };

  const location =
    locationTexts[locale as keyof typeof locationTexts] || locationTexts.cs;

  return `${description}, ${location}`;
};

/**
 * Helper function to clean up color/variety names from database
 * Removes codes and makes text more readable
 */
export const cleanColorName = (
  name: string | undefined
): string | undefined => {
  if (!name) return undefined;

  // Remove codes like "RAG n 03" or similar patterns
  return name
    .replace(/^[A-Z]{2,4}\s+[a-z0-9\s]+/i, "") // Remove breed codes
    .replace(/^\d+\s*/, "") // Remove leading numbers
    .trim();
};

/**
 * Get localized color/variety name from cat object
 */
export const getLocalizedColorVariety = (
  cat: {
    color?: { name_cs?: string; name_en?: string; name_de?: string };
    variety?: { name_cs?: string; name_en?: string; name_de?: string };
  },
  locale: string = "cs"
): { color?: string; variety?: string } => {
  const localeSuffix = locale === "cs" ? "cs" : locale === "en" ? "en" : "de";

  return {
    color: cat.color?.[`name_${localeSuffix}` as keyof typeof cat.color] as
      | string
      | undefined,
    variety: cat.variety?.[
      `name_${localeSuffix}` as keyof typeof cat.variety
    ] as string | undefined,
  };
};
