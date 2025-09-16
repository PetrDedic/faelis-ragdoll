import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Function to fetch cats with basic details
    const fetchCatDetails = async (catId: string) => {
      try {
        // First get the cat
        const { data: cat, error } = await supabase
          .from("cats")
          .select("*")
          .eq("id", catId)
          .single();

        if (error || !cat) {
          console.error("Error fetching cat:", error);
          return null;
        }

        // Fetch images for the cat
        const { data: images } = await supabase
          .from("images")
          .select("*")
          .eq("cat_id", catId)
          .order("display_order", { ascending: true })
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false });

        // Get cat color
        const { data: catColors } = await supabase
          .from("cat_colors")
          .select("*")
          .eq("cat_id", catId)
          .eq("is_phenotype", true);

        // Get cat variety
        const { data: catVarieties } = await supabase
          .from("cat_varieties")
          .select("*")
          .eq("cat_id", catId)
          .eq("is_phenotype", true);

        let color = null;
        let variety = null;

        if (catColors && catColors.length > 0) {
          const { data: colorData } = await supabase
            .from("colors")
            .select("*")
            .eq("id", catColors[0].color_id)
            .single();

          color = colorData;
        }

        if (catVarieties && catVarieties.length > 0) {
          const { data: varietyData } = await supabase
            .from("varieties")
            .select("*")
            .eq("id", catVarieties[0].variety_id)
            .single();

          variety = varietyData;
        }

        // Get medical tests for the cat
        const { data: medicalTests } = await supabase
          .from("medical_tests")
          .select("*")
          .eq("cat_id", catId)
          .order("test_date", { ascending: false });

        return {
          ...cat,
          images: images || [],
          color: color || null,
          variety: variety || null,
          medical_tests: medicalTests || [],
        };
      } catch (error) {
        console.error("Error fetching cat details:", error);
        return null;
      }
    };

    // Function to fetch kittens for a litter
    const fetchKittensForLitter = async (litterId: string) => {
      try {
        // Get all kitten IDs from the litter
        const { data: catLitters, error } = await supabase
          .from("cat_litters")
          .select("cat_id")
          .eq("litter_id", litterId);

        if (error || !catLitters || catLitters.length === 0) {
          return [];
        }

        // Fetch details for each kitten
        const kittens = await Promise.all(
          catLitters.map(async (cl) => await fetchCatDetails(cl.cat_id))
        );

        return kittens.filter(Boolean);
      } catch (error) {
        console.error("Error fetching kittens:", error);
        return [];
      }
    };

    // Get total count of past litters
    const { count: totalCount, error: countError } = await supabase
      .from("litters")
      .select("*", { count: "exact", head: true })
      .eq("status", "past");

    if (countError) {
      console.error("Error fetching count:", countError);
      return res.status(500).json({ error: "Failed to fetch count" });
    }

    // Fetch past litters with pagination
    const { data: pastLittersData, error: pastError } = await supabase
      .from("litters")
      .select("*")
      .eq("status", "past")
      .order("birth_date", { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (pastError) {
      console.error("Error fetching past litters:", pastError);
      return res.status(500).json({ error: "Failed to fetch past litters" });
    }

    // Process past litters
    const pastLitters = await Promise.all(
      (pastLittersData || []).map(async (litter) => {
        const mother = await fetchCatDetails(litter.mother_id);
        const father = await fetchCatDetails(litter.father_id);
        const kittens = await fetchKittensForLitter(litter.id);

        return {
          ...litter,
          mother,
          father,
          kittens,
        };
      })
    );

    const filteredLitters = pastLitters.filter(
      (litter) => litter.mother && litter.father
    );

    return res.status(200).json({
      litters: filteredLitters,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limitNum),
        hasMore: pageNum * limitNum < (totalCount || 0),
      },
    });
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
