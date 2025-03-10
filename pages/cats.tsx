import { useEffect, useState } from "react";
import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { GetStaticProps } from "next";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatInfo } from "../components/CatInfo";

// Define types for our cat data
interface Cat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  description: string;
  details: string;
  is_breeding: boolean;
  status: string;
  images: CatImage[];
  color: {
    code: string;
    name_cs: string;
  };
  variety: {
    code: string;
    name_cs: string;
  };
  blood_type: {
    type: string;
    genetic_code: string;
  };
  genetic_code: string;
}

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

// Props interface
interface CatsPageProps {
  maleCats: Cat[];
  femaleCats: Cat[];
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function CatsPage({ maleCats, femaleCats }: CatsPageProps) {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        heading="Všechny naše koťata, kočky a kocouři"
        subtext="Chci mít vlastní kočičku."
      />
      <Stack
        px={32}
        py={128}
        justify="center"
        align="center"
        gap={64}
        maw={1280}
        mx="auto"
        w="100%"
      >
        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Ragdoll koťata
          </Title>
          <Text fw={700} size="xl" c="black" ta="center">
            Vrh O narozen 26/10/2024
          </Text>
          <Text size="lg" c="black" ta="center">
            Očkování, odčervení, rodokmen, kupní smlouva... to je samozřejmostí,
            s majiteli našich koťátek jsme v kontaktu i po prodeji. Rodiče jsou
            negativně testovaní na HCM a PKD, FeLV a FIV.
          </Text>
        </Stack>

        <FullscreenBackroundSection>
          <Stack align="center" w="100%" maw={720} py={32}>
            <Title order={2} size="h1" c="dark" ta="center">
              Mám zájem o svou kočičku
            </Title>
            <Text size="lg" c="black" ta="center">
              Pokud máte zájem zakoupit jednu z našich kočiček, tak nás
              kontaktujte pomocí telefonního čísla a nebo na níže uvedeném
              formuláři.
            </Text>
            <Button
              color="#47a3ee"
              size="compact-lg"
              fw={400}
              px={24}
              w={{ base: "100%", sm: "fit-content" }}
            >
              Zjistit více
            </Button>
          </Stack>
        </FullscreenBackroundSection>

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Ragdoll kocouři
          </Title>

          {maleCats.map((cat) => (
            <CatInfo
              key={cat.id}
              images={
                cat.images.length > 0
                  ? {
                      top: cat.images[0]?.url,
                      middle: cat.images[0]?.url,
                      right: cat.images[0]?.url,
                    }
                  : {
                      top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      middle:
                        "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      right:
                        "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }
              }
              name={`${cat.name} ${cat.description}`}
              info={
                <>
                  <Text>
                    Pohlaví: {cat.gender === "male" ? "kocour" : "kočka"}
                  </Text>
                  <Text>
                    Datum narození:{" "}
                    {new Date(cat.birth_date).toLocaleDateString("cs-CZ")}
                  </Text>
                  <Text>Barva: {cat.color?.name_cs}</Text>
                  <Text>Varianta: {cat.variety?.name_cs}</Text>
                  <Text>
                    Krevní skupina: {cat.blood_type?.type} /{" "}
                    {cat.blood_type?.type}
                  </Text>
                  <Text>Genetický kód barvy: {cat.genetic_code}</Text>
                  <Text mt="md">{cat.details}</Text>
                </>
              }
            />
          ))}
        </Stack>

        <FullscreenBackroundSection image="https://images.unsplash.com/photo-1586417752912-b0389b445a20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
          <Stack align="center" w="100%" maw={960} gap={48} py={32}>
            <Title order={2} size="h1">
              Pár faktů o našem chovu plemene Ragdoll
            </Title>
            <Grid w="100%" gutter={32}>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    50+
                  </Text>
                  <Text c="dark" ta="center">
                    Spokojených klientů
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    20+
                  </Text>
                  <Text c="dark" ta="center">
                    Let zkušeností a praxe
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    200+
                  </Text>
                  <Text c="dark" ta="center">
                    Šťastných
                    <br />
                    koček
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    30+
                  </Text>
                  <Text c="dark" ta="center">
                    Úspěšných
                    <br />
                    vrhů
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
            <Button
              color="#47a3ee"
              size="compact-lg"
              fw={400}
              px={24}
              w={{ base: "100%", sm: "fit-content" }}
            >
              Zjistit více
            </Button>
          </Stack>
        </FullscreenBackroundSection>

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Ragdoll kočky
          </Title>

          {femaleCats.map((cat) => (
            <CatInfo
              key={cat.id}
              images={
                cat.images.length > 0
                  ? {
                      top: cat.images[0]?.url,
                      middle: cat.images[0]?.url,
                      right: cat.images[0]?.url,
                    }
                  : {
                      top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      middle:
                        "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      right:
                        "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }
              }
              name={`${cat.name} ${cat.description}`}
              info={
                <>
                  <Text>
                    Pohlaví: {cat.gender === "male" ? "kocour" : "kočka"}
                  </Text>
                  <Text>
                    Datum narození:{" "}
                    {new Date(cat.birth_date).toLocaleDateString("cs-CZ")}
                  </Text>
                  <Text>Barva: {cat.color?.name_cs}</Text>
                  <Text>Varianta: {cat.variety?.name_cs}</Text>
                  <Text>
                    Krevní skupina: {cat.blood_type?.type} /{" "}
                    {cat.blood_type?.type}
                  </Text>
                  <Text>Genetický kód barvy: {cat.genetic_code}</Text>
                  <Text mt="md">{cat.details}</Text>
                </>
              }
            />
          ))}
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}

export const getStaticProps: GetStaticProps<CatsPageProps> = async () => {
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Function to get genetic code from genetic tests
  const getGeneticCodeFromTests = (tests: any[]) => {
    if (!Array.isArray(tests)) return "";
    const colorTest = tests.find(
      (test) =>
        test.test_type === "color" && test.test_name === "Color Genetics"
    );
    return colorTest ? colorTest.result : "";
  };

  // Function to fetch cats with related data
  const fetchCatsWithDetails = async (gender: "male" | "female") => {
    try {
      // First get all cats of specified gender
      const { data: cats, error } = await supabase
        .from("cats")
        .select("*")
        .eq("gender", gender)
        .eq("status", "alive")
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
        .in("cat_id", catIds);

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
        .select("id, name_cs, code")
        .in("id", colorIds);

      // Fetch varieties
      const { data: varieties } = await supabase
        .from("varieties")
        .select("id, name_cs, code")
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
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return 0;
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

        return {
          ...cat,
          images: catImages || [],
          color: color || null,
          variety: variety || null,
          blood_type: bloodType || null,
          genetic_code: geneticCode,
        };
      });
    } catch (error) {
      console.error("Error in fetchCatsWithDetails:", error);
      return [];
    }
  };

  try {
    // Fetch male and female cats
    const maleCats = await fetchCatsWithDetails("male");
    const femaleCats = await fetchCatsWithDetails("female");

    return {
      props: {
        maleCats,
        femaleCats,
      },
      // Revalidate every 24 hours (86400 seconds)
      revalidate: 86400,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        maleCats: [],
        femaleCats: [],
      },
      revalidate: 86400,
    };
  }
};
