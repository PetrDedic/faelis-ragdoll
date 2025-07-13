import supabase from "./supabase/client";

export interface HeroImage {
  id: string;
  page_name: string;
  background_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const getHeroImage = async (
  pageName: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("hero_images")
      .select("background_image_url")
      .eq("page_name", pageName)
      .single();

    if (error) {
      console.error("Error fetching hero image:", error);
      return null;
    }

    return data?.background_image_url || null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const getAllHeroImages = async (): Promise<HeroImage[]> => {
  try {
    const { data, error } = await supabase.from("hero_images").select("*");

    if (error) {
      console.error("Error fetching hero images:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};
