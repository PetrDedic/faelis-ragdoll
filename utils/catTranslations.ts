// Utility function to get the localized property name based on locale
export const getLocalizedProperty = (
  locale: string,
  propertyType: string
): string => {
  if (propertyType === "name") {
    switch (locale) {
      case "en":
        return "name_en";
      case "de":
        return "name_de";
      case "cs":
      default:
        return "name_cs";
    }
  }

  // For other property types or future expansion
  return "";
};

// Function to format date based on locale
export const formatDate = (dateString: string, locale: string): string => {
  try {
    const date = new Date(dateString);

    switch (locale) {
      case "en":
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      case "de":
        return date.toLocaleDateString("de-DE", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
      case "cs":
      default:
        return date.toLocaleDateString("cs-CZ", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
    }
  } catch (error) {
    console.error(`Error formatting date ${dateString}:`, error);
    return dateString;
  }
};

// Function to get localized gender text
export const getGenderText = (gender: string, translations: any): string => {
  if (gender === "male") {
    return translations.catInfo.genderMale;
  } else {
    return translations.catInfo.genderFemale;
  }
};

// Function to get localized property value from cat object
export const getLocalizedCatProperty = (
  cat: any,
  propertyKey: string,
  locale: string
): string => {
  if (!cat || !cat[propertyKey]) return "";

  const property = cat[propertyKey];
  const localizedField = getLocalizedProperty(locale, "name");

  // If the property has localized name fields
  if (property[localizedField]) {
    return property[localizedField];
  }

  // Fallback to name_cs
  if (property.name_cs) {
    return property.name_cs;
  }

  // Final fallback to any available name field
  return property.name || property.code || "";
};
