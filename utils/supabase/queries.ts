import { SupabaseClient, createClient } from "@supabase/supabase-js";

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get genetic code from genetic tests
const getGeneticCodeFromTests = (tests: any[]) => {
  if (!Array.isArray(tests)) return "";
  const colorTest = tests.find(
    (test) => test.test_type === "color" && test.test_name === "Color Genetics"
  );
  return colorTest ? colorTest.result : "";
};

// Function to fetch cats with related data
export const fetchCatsWithDetails = async (
  gender: "male" | "female",
  supabase: SupabaseClient
) => {
  try {
    // First get all cats of specified gender
    const { data: cats, error } = await supabase
      .from("cats")
      .select("*")
      .eq("gender", gender)
      .eq("status", "alive")
      .eq("is_own_breeding_cat", true)
      .eq("is_breeding", true);

    if (error) {
      console.error("Error fetching cats:", error);
      return [];
    }

    if (!cats || cats.length === 0) {
      return [];
    }

    // Extract all cat IDs
    const catIds = cats.map((cat) => cat.id);

    // Fetch images for all cats
    const { data: images } = await supabase
      .from("images")
      .select("*")
      .in("cat_id", catIds)
      .order("display_order", { ascending: true })
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    // Fetch cat_colors for all cats
    const { data: catColors } = await supabase
      .from("cat_colors")
      .select("*")
      .in("cat_id", catIds);

    // Fetch cat_varieties for all cats
    const { data: catVarieties } = await supabase
      .from("cat_varieties")
      .select("*")
      .in("cat_id", catIds);

    // Fetch cat_blood_types for all cats
    const { data: catBloodTypes } = await supabase
      .from("cat_blood_types")
      .select("*")
      .in("cat_id", catIds);

    // Fetch genetic_tests for all cats
    const { data: geneticTests } = await supabase
      .from("genetic_tests")
      .select("*")
      .in("cat_id", catIds);

    // Fetch medical_tests for all cats
    const { data: medicalTests } = await supabase
      .from("medical_tests")
      .select("*")
      .in("cat_id", catIds)
      .order("test_date", { ascending: false });

    // Get unique IDs for colors, varieties, and blood types
    const colorIds = Array.from(
      new Set(catColors?.map((cc) => cc.color_id) || [])
    );
    const varietyIds = Array.from(
      new Set(catVarieties?.map((cv) => cv.variety_id) || [])
    );
    const bloodTypeIds = Array.from(
      new Set(catBloodTypes?.map((cbt) => cbt.blood_type_id) || [])
    );

    // Fetch colors
    const { data: colors } = await supabase
      .from("colors")
      .select("id, name_cs, name_en, name_de, code")
      .in("id", colorIds);

    // Fetch varieties
    const { data: varieties } = await supabase
      .from("varieties")
      .select("id, name_cs, name_en, name_de, code")
      .in("id", varietyIds);

    // Fetch blood types
    const { data: bloodTypes } = await supabase
      .from("blood_types")
      .select("id, type, genetic_code")
      .in("id", bloodTypeIds);

    // Now map everything together
    return cats.map((cat) => {
      // Get images for this cat and sort by primary first
      const catImages = (images || [])
        .filter((img) => img.cat_id === cat.id)
        .sort((a, b) => {
          // First sort by primary image
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          // Then sort by ID to ensure consistent ordering
          return a.id.localeCompare(b.id);
        });
      // Get colors for this cat (prioritize is_phenotype)
      const catColorRelations = (catColors || []).filter(
        (cc) => cc.cat_id === cat.id
      );
      const primaryColorId = catColorRelations.find(
        (cc) => cc.is_phenotype
      )?.color_id;
      const color = colors?.find((c) => c.id === primaryColorId);

      // Get varieties for this cat (prioritize is_phenotype)
      const catVarietyRelations = (catVarieties || []).filter(
        (cv) => cv.cat_id === cat.id
      );
      const primaryVarietyId = catVarietyRelations.find(
        (cv) => cv.is_phenotype
      )?.variety_id;
      const variety = varieties?.find((v) => v.id === primaryVarietyId);

      // Get blood type for this cat
      const catBloodTypeRelation = (catBloodTypes || []).find(
        (cbt) => cbt.cat_id === cat.id
      );
      const bloodType = bloodTypes?.find(
        (bt) => bt.id === catBloodTypeRelation?.blood_type_id
      );

      // Get genetic tests for this cat
      const catGeneticTests = (geneticTests || []).filter(
        (gt) => gt.cat_id === cat.id
      );
      const geneticCode = getGeneticCodeFromTests(catGeneticTests);

      // Get medical tests for this cat
      const catMedicalTests = (medicalTests || []).filter(
        (mt) => mt.cat_id === cat.id
      );

      return {
        ...cat,
        images: catImages || [],
        color: color || null,
        variety: variety || null,
        blood_type: bloodType || null,
        genetic_code: geneticCode,
        medical_tests: catMedicalTests,
      };
    });
  } catch (error) {
    console.error("Error in fetchCatsWithDetails:", error);
    return [];
  }
};

export const fetchCatsByIds = async (
  catIds: string[],
  supabase: SupabaseClient
) => {
  if (!catIds || catIds.length === 0) {
    return [];
  }

  try {
    // First get all cats
    const { data: cats, error } = await supabase
      .from("cats")
      .select("*")
      .in("id", catIds);

    if (error) {
      console.error("Error fetching cats by IDs:", error);
      return [];
    }

    if (!cats || cats.length === 0) {
      return [];
    }

    // Fetch images for all cats
    const { data: images } = await supabase
      .from("images")
      .select("*")
      .in("cat_id", catIds)
      .order("display_order", { ascending: true })
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    // Fetch cat_colors for all cats
    const { data: catColors } = await supabase
      .from("cat_colors")
      .select("*")
      .in("cat_id", catIds);

    // Fetch cat_varieties for all cats
    const { data: catVarieties } = await supabase
      .from("cat_varieties")
      .select("*")
      .in("cat_id", catIds);

    // Fetch cat_blood_types for all cats
    const { data: catBloodTypes } = await supabase
      .from("cat_blood_types")
      .select("*")
      .in("cat_id", catIds);

    // Fetch genetic_tests for all cats
    const { data: geneticTests } = await supabase
      .from("genetic_tests")
      .select("*")
      .in("cat_id", catIds);

    // Fetch medical_tests for all cats
    const { data: medicalTests } = await supabase
      .from("medical_tests")
      .select("*")
      .in("cat_id", catIds)
      .order("test_date", { ascending: false });

    // Get unique IDs for colors, varieties, and blood types
    const colorIds = Array.from(
      new Set(catColors?.map((cc) => cc.color_id) || [])
    );
    const varietyIds = Array.from(
      new Set(catVarieties?.map((cv) => cv.variety_id) || [])
    );
    const bloodTypeIds = Array.from(
      new Set(catBloodTypes?.map((cbt) => cbt.blood_type_id) || [])
    );

    // Fetch colors, varieties, and blood types in parallel
    const [{ data: colors }, { data: varieties }, { data: bloodTypes }] =
      await Promise.all([
        supabase
          .from("colors")
          .select("id, name_cs, name_en, name_de, code")
          .in("id", colorIds),
        supabase
          .from("varieties")
          .select("id, name_cs, name_en, name_de, code")
          .in("id", varietyIds),
        supabase
          .from("blood_types")
          .select("id, type, genetic_code")
          .in("id", bloodTypeIds),
      ]);

    // Now map everything together
    return cats.map((cat) => {
      const catImages = (images || [])
        .filter((img) => img.cat_id === cat.id)
        .sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return a.id.localeCompare(b.id);
        });

      const catColorRelations = (catColors || []).filter(
        (cc) => cc.cat_id === cat.id
      );
      const primaryColorId = catColorRelations.find(
        (cc) => cc.is_phenotype
      )?.color_id;
      const color = colors?.find((c) => c.id === primaryColorId);

      const catVarietyRelations = (catVarieties || []).filter(
        (cv) => cv.cat_id === cat.id
      );
      const primaryVarietyId = catVarietyRelations.find(
        (cv) => cv.is_phenotype
      )?.variety_id;
      const variety = varieties?.find((v) => v.id === primaryVarietyId);

      const catBloodTypeRelation = (catBloodTypes || []).find(
        (cbt) => cbt.cat_id === cat.id
      );
      const bloodType = bloodTypes?.find(
        (bt) => bt.id === catBloodTypeRelation?.blood_type_id
      );

      const catGeneticTests = (geneticTests || []).filter(
        (gt) => gt.cat_id === cat.id
      );
      const geneticCode = getGeneticCodeFromTests(catGeneticTests);

      const catMedicalTests = (medicalTests || []).filter(
        (mt) => mt.cat_id === cat.id
      );

      return {
        ...cat,
        images: catImages || [],
        color: color || null,
        variety: variety || null,
        blood_type: bloodType || null,
        genetic_code: geneticCode,
        medical_tests: catMedicalTests || [],
      };
    });
  } catch (error) {
    console.error("Error in fetchCatsByIds:", error);
    return [];
  }
};

export const fetchLittersByStatus = async (
  status: "current" | "planned" | "past",
  supabase: SupabaseClient,
  limit?: number
) => {
  try {
    let query = supabase.from("litters").select("*").eq("status", status);

    if (status === "planned") {
      query = query.order("expected_date", { ascending: true });
    } else {
      query = query.order("birth_date", { ascending: false });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: litters, error: littersError } = await query;

    if (littersError) {
      console.error(`Error fetching ${status} litters:`, littersError);
      return [];
    }

    if (!litters || litters.length === 0) {
      return [];
    }

    const litterIds = litters.map((litter) => litter.id);
    const parentIds = Array.from(
      new Set(litters.flatMap((litter) => [litter.mother_id, litter.father_id]))
    );

    const { data: catLitters, error: catLittersError } = await supabase
      .from("cat_litters")
      .select("cat_id, litter_id")
      .in("litter_id", litterIds);

    if (catLittersError) {
      console.error("Error fetching cat_litters:", catLittersError);
      return []; // Or handle error appropriately
    }

    const kittenIds = catLitters?.map((cl) => cl.cat_id) || [];
    const allCatIds = Array.from(new Set([...parentIds, ...kittenIds]));

    const allCatsData = await fetchCatsByIds(allCatIds, supabase);
    const catsById = new Map(allCatsData.map((cat) => [cat.id, cat]));

    return litters.map((litter) => {
      const kittens =
        catLitters
          ?.filter((cl) => cl.litter_id === litter.id)
          .map((cl) => catsById.get(cl.cat_id))
          .filter(Boolean) || [];

      return {
        ...litter,
        mother: catsById.get(litter.mother_id) || null,
        father: catsById.get(litter.father_id) || null,
        kittens,
      };
    });
  } catch (error) {
    console.error(`Error in fetchLittersByStatus for ${status}:`, error);
    return [];
  }
};
