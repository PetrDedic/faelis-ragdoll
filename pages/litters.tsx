import { useEffect, useState } from "react";
import {
  Accordion,
  AspectRatio,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatGalleryModal } from "../components/CatGalleryModal";
import Link from "next/link";
import { formatDate } from "../utils/catTranslations";
import Image from "next/image";

// Import translations
import csTranslations from "../locales/cs/litters.json";
import enTranslations from "../locales/en/litters.json";
import deTranslations from "../locales/de/litters.json";
import {
  IconCat,
  IconGenderFemale,
  IconGenderMale,
  IconLibraryPhoto,
} from "@tabler/icons-react";

// Define types for our litter data
interface Litter {
  id: string;
  name: string;
  mother_id: string;
  father_id: string;
  birth_date: string;
  number_of_kittens: number;
  number_of_males: number;
  number_of_females: number;
  description: string;
  details: string;
  pedigree_link: string;
  mother: Cat;
  father: Cat;
  kittens: Cat[];
  expected_date?: string; // For upcoming litters
  status: "planned" | "current" | "past";
}

interface Cat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  description: string;
  status: string;
  images: CatImage[];
  pedigree_link: string;
  color: {
    code: string;
    name_cs: string;
    name_en?: string;
    name_de?: string;
  };
  variety: {
    code: string;
    name_cs: string;
    name_en?: string;
    name_de?: string;
  };
}

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

// Props interface
interface LittersPageProps {
  currentLitters: Litter[];
  upcomingLitters: Litter[];
  pastLitters: Litter[];
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function LittersPage({
  currentLitters,
  upcomingLitters,
  pastLitters,
}: LittersPageProps) {
  const router = useRouter();
  const { locale } = router;
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [selectedImages, setSelectedImages] = useState<CatImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  // Helper function to get the localized cat property (color, variety)
  const getLocalizedCatProperty = (
    cat: Cat,
    property: "color" | "variety",
    locale: string
  ) => {
    if (!cat || !cat[property]) return "";

    const localeProp = `name_${locale}` as "name_cs" | "name_en" | "name_de";
    return cat[property][localeProp] || cat[property].name_cs || "";
  };

  // Helper function to get the primary image for a cat or fallback
  const getCatImage = (cat: Cat) => {
    if (!cat || !cat.images || cat.images.length === 0) {
      return "https://images.unsplash.com/photo-1583399704033-3db671c65f5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }

    const primaryImage = cat.images.find((img) => img.is_primary);
    return primaryImage ? primaryImage.url : cat.images[0].url;
  };

  const handleOpenGallery = (images: CatImage[], initialIndex: number = 0) => {
    setSelectedImages(images);
    setSelectedImageIndex(initialIndex);
    setGalleryOpened(true);
  };

  // Helper function to get season from date
  const getSeasonFromDate = (dateString: string, locale: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // getMonth() returns 0-11

    let season: string;
    if (month >= 3 && month <= 5) {
      season =
        locale === "cs" ? "Jaro" : locale === "de" ? "Frühling" : "Spring";
    } else if (month >= 6 && month <= 8) {
      season = locale === "cs" ? "Léto" : locale === "de" ? "Sommer" : "Summer";
    } else if (month >= 9 && month <= 11) {
      season =
        locale === "cs" ? "Podzim" : locale === "de" ? "Herbst" : "Autumn";
    } else {
      season = locale === "cs" ? "Zima" : locale === "de" ? "Winter" : "Winter";
    }

    const year = date.getFullYear();
    return `${season} ${year}`;
  };

  // Helper function to render a litter card
  const renderLitterCard = (
    litter: Litter,
    type: "current" | "upcoming" | "past"
  ) => {
    const isPlanned = litter.status === "planned";
    const isCurrent = litter.status === "current";

    return (
      <Card key={litter.id} p="lg" mb="xl" w="100%">
        <Stack align="center">
          <Stack w="100%">
            <Title order={3} size="h1" ta="center">
              {litter.name}
            </Title>
            <Flex wrap="wrap" gap={16}>
              <Badge size="lg">
                {type === "upcoming"
                  ? t.upcomingLitters.expectedDate
                  : t.pastLitters.birthDate}
                :{" "}
                {type === "upcoming" && litter.expected_date
                  ? getSeasonFromDate(litter.expected_date, locale as string)
                  : formatDate(
                      type === "upcoming"
                        ? litter.expected_date!
                        : litter.birth_date,
                      locale as string
                    )}
              </Badge>
              {isPlanned && (
                <Badge color="orange" size="lg">
                  {t.commonLabels.planned || "Planned litter"}
                </Badge>
              )}
              {isCurrent && (
                <Badge color="green" size="lg">
                  {t.commonLabels.current || "Current litter"}
                </Badge>
              )}
            </Flex>

            {type !== "upcoming" && (
              <Flex w="100%" gap={8}>
                <Badge leftSection={<IconCat size={16} />} color="black">
                  {t.pastLitters.kittens}: {litter.number_of_kittens}
                </Badge>
                <Badge
                  leftSection={<IconGenderMale size={16} />}
                  variant="light"
                  color="black"
                >
                  {t.pastLitters.males}: {litter.number_of_males}
                </Badge>
                <Badge
                  leftSection={<IconGenderFemale size={16} />}
                  variant="light"
                  color="black"
                >
                  {t.pastLitters.females}: {litter.number_of_females}
                </Badge>
              </Flex>
            )}
          </Stack>

          {type !== "upcoming" &&
            litter.kittens &&
            litter.kittens.length > 0 && (
              <Stack w="100%">
                <Grid>
                  {litter.kittens.map((kitten) => (
                    <Grid.Col
                      key={kitten.id}
                      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    >
                      <Card
                        pb={24}
                        style={{ position: "relative" }}
                        padding="lg"
                        radius="lg"
                        bg="#d6e6f3"
                      >
                        <Stack gap="xs">
                          <AspectRatio
                            ratio={4 / 3}
                            style={{
                              position: "relative",
                              alignItems: "center",
                              aspectRatio: "4/3",
                            }}
                            w="100%"
                            h="100%"
                          >
                            {kitten.gender && (
                              <Badge
                                w={32}
                                h={32}
                                px={0}
                                pt={4}
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpenGallery(kitten.images)}
                              >
                                {kitten.gender === "male" ? (
                                  <IconGenderMale size={20} />
                                ) : (
                                  <IconGenderFemale size={20} />
                                )}
                              </Badge>
                            )}
                            <Image
                              src={getCatImage(kitten)}
                              fill
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                                cursor: "pointer",
                              }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={kitten.name}
                              onClick={() => handleOpenGallery(kitten.images)}
                            />
                          </AspectRatio>
                          <Badge color="blue">
                            {getLocalizedCatProperty(
                              kitten,
                              "color",
                              locale as string
                            )}{" "}
                            {getLocalizedCatProperty(
                              kitten,
                              "variety",
                              locale as string
                            )}
                          </Badge>
                          <Text fw={500} size="sm">
                            {kitten.name}
                          </Text>
                          <Text size="xs">
                            {kitten.gender === "male"
                              ? t.commonLabels.male
                              : t.commonLabels.female}
                          </Text>
                          {kitten.images.length > 0 && (
                            <Button
                              color="#47a3ee"
                              variant="outline"
                              size="xs"
                              fullWidth
                              leftSection={<IconLibraryPhoto size={16} />}
                              onClick={() => handleOpenGallery(kitten.images)}
                            >
                              {t.commonLabels.gallery}
                            </Button>
                          )}
                          <Button
                            color="#47a3ee"
                            variant="light"
                            size="xs"
                            fullWidth
                            component={Link}
                            href={kitten.pedigree_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t.commonLabels.pedigree}
                          </Button>
                          {kitten.status !== "sold" && (
                            <Button
                              component={
                                kitten.status !== "reserved" ? Link : undefined
                              }
                              href={`#form`}
                              color={
                                kitten.status === "reserved"
                                  ? "orange"
                                  : kitten.status === "sold"
                                  ? "red"
                                  : "green"
                              }
                              variant={
                                kitten.status === "reserved"
                                  ? "light"
                                  : kitten.status === "sold"
                                  ? "light"
                                  : "filled"
                              }
                              size="xs"
                              fullWidth
                            >
                              {kitten.status === "reserved"
                                ? t.commonLabels.reserved
                                : t.commonLabels.available}
                            </Button>
                          )}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            )}

          {litter.details && (
            <Stack w="100%" gap={8}>
              <Text>{litter.details}</Text>
            </Stack>
          )}

          {litter.pedigree_link && (
            <Stack w="100%" gap={8}>
              <Button
                component="a"
                href={litter.pedigree_link}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                color="blue"
                size="sm"
              >
                {locale === "cs"
                  ? "Zobrazit rodokmen"
                  : locale === "de"
                  ? "Stammbaum anzeigen"
                  : "View Pedigree"}
              </Button>
            </Stack>
          )}

          <Accordion
            variant="contained"
            radius="md"
            w="100%"
            defaultValue={type === "upcoming" ? "parent" : undefined}
          >
            <Accordion.Item value="parent">
              <Accordion.Control>
                <Title order={3} size="h3">
                  {t.commonLabels.parents}
                </Title>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid gutter={32} w="100%">
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Card
                      padding="lg"
                      radius="lg"
                      bg="#d6e6f3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenGallery(litter.father.images)}
                    >
                      <Stack gap="xs">
                        <AspectRatio
                          ratio={16 / 9}
                          style={{
                            position: "relative",
                            alignItems: "center",
                            aspectRatio: "16/9",
                          }}
                          w="100%"
                          h="100%"
                        >
                          <Image
                            src={getCatImage(litter.father)}
                            fill
                            style={{
                              objectFit: "cover",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={litter.father.name}
                          />
                        </AspectRatio>
                        <Text fw={700} fz="lg">
                          {litter.father.name}
                        </Text>
                        <Text>{litter.father.description}</Text>
                        <Badge>
                          {getLocalizedCatProperty(
                            litter.father,
                            "color",
                            locale as string
                          )}{" "}
                          {getLocalizedCatProperty(
                            litter.father,
                            "variety",
                            locale as string
                          )}
                        </Badge>
                      </Stack>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Card
                      padding="lg"
                      radius="lg"
                      bg="#d6e6f3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenGallery(litter.mother.images)}
                    >
                      <Stack gap="xs">
                        <AspectRatio
                          ratio={16 / 9}
                          style={{
                            position: "relative",
                            alignItems: "center",
                            aspectRatio: "16/9",
                          }}
                          w="100%"
                          h="100%"
                        >
                          <Image
                            src={getCatImage(litter.mother)}
                            fill
                            style={{
                              objectFit: "cover",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={litter.mother.name}
                          />
                        </AspectRatio>
                        <Text fw={700} fz="lg">
                          {litter.mother.name}
                        </Text>
                        <Text>{litter.mother.description}</Text>
                        <Badge>
                          {getLocalizedCatProperty(
                            litter.mother,
                            "color",
                            locale as string
                          )}{" "}
                          {getLocalizedCatProperty(
                            litter.mother,
                            "variety",
                            locale as string
                          )}
                        </Badge>
                      </Stack>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Card>
    );
  };

  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        heading={t.hero.heading}
        subtext={t.hero.subtext}
        backgroundImage="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/IMG_1271.webp"
      />
      <Flex
        w="100%"
        justify="center"
        gap={16}
        align="center"
        my={32}
        wrap="wrap"
      >
        {currentLitters.length > 0 && (
          <Button color="#47a3ee" size="lg" component={Link} href="#current">
            {t.currentLitters.title}
          </Button>
        )}
        {upcomingLitters.length > 0 && (
          <Button color="#47a3ee" size="lg" component={Link} href="#upcoming">
            {t.upcomingLitters.title}
          </Button>
        )}
        <Button color="#47a3ee" size="lg" component={Link} href="#past">
          {t.pastLitters.title}
        </Button>
      </Flex>
      <Stack
        px={32}
        pb={128}
        justify="center"
        align="center"
        gap={64}
        maw={1280}
        mx="auto"
        w="100%"
      >
        {/* Upcoming Litters Section */}
        {upcomingLitters.length > 0 && (
          <Stack w="100%" align="center" gap={32}>
            <Title
              order={2}
              size="h1"
              c="#47a3ee"
              ta="center"
              id="upcoming"
              style={{ scrollMarginTop: 100 }}
            >
              {t.upcomingLitters.title}
            </Title>
            <Text size="lg" c="black" ta="center">
              {t.upcomingLitters.description}
            </Text>

            {upcomingLitters.map((litter) =>
              renderLitterCard(litter, "upcoming")
            )}
          </Stack>
        )}

        {/* Current Litters Section */}
        {currentLitters.length > 0 && (
          <Stack w="100%" align="center" gap={32}>
            <Title
              order={2}
              size="h1"
              c="#47a3ee"
              ta="center"
              id="current"
              style={{ scrollMarginTop: 100 }}
            >
              {t.currentLitters?.title || "Current Litters"}
            </Title>
            <Text size="lg" c="black" ta="center">
              {t.currentLitters?.description ||
                "Our latest litters with available kittens."}
            </Text>

            {currentLitters.map((litter) =>
              renderLitterCard(litter, "current")
            )}
          </Stack>
        )}

        {/* Past Litters Section */}
        {pastLitters.length > 0 && (
          <Stack w="100%" align="center" gap={32}>
            <Title
              order={2}
              size="h1"
              c="#47a3ee"
              ta="center"
              id="past"
              style={{ scrollMarginTop: 100 }}
            >
              {t.pastLitters.title}
            </Title>
            <Text size="lg" c="black" ta="center">
              {t.pastLitters.description}
            </Text>

            {pastLitters.map((litter) => renderLitterCard(litter, "past"))}
          </Stack>
        )}

        <Form />
      </Stack>

      <CatGalleryModal
        images={selectedImages}
        opened={galleryOpened}
        onClose={() => setGalleryOpened(false)}
        initialImageIndex={selectedImageIndex}
      />
    </Stack>
  );
}

export const getStaticProps: GetStaticProps<LittersPageProps> = async () => {
  // Initialize Supabase client
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

      return {
        ...cat,
        images: images || [],
        color: color || null,
        variety: variety || null,
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

      return kittens.filter(Boolean) as Cat[];
    } catch (error) {
      console.error("Error fetching kittens:", error);
      return [];
    }
  };

  try {
    // Fetch current litters
    const { data: currentLittersData, error: currentError } = await supabase
      .from("litters")
      .select("*")
      .eq("status", "current")
      .order("birth_date", { ascending: false });

    if (currentError) {
      console.error("Error fetching current litters:", currentError);
      return {
        props: { currentLitters: [], upcomingLitters: [], pastLitters: [] },
      };
    }

    // Fetch upcoming litters
    const { data: upcomingLittersData, error: upcomingError } = await supabase
      .from("litters")
      .select("*")
      .eq("status", "planned")
      .order("expected_date", { ascending: true });

    if (upcomingError) {
      console.error("Error fetching upcoming litters:", upcomingError);
      return {
        props: { currentLitters: [], upcomingLitters: [], pastLitters: [] },
      };
    }

    // Fetch past litters
    const { data: pastLittersData, error: pastError } = await supabase
      .from("litters")
      .select("*")
      .eq("status", "past")
      .order("birth_date", { ascending: false });

    if (pastError) {
      console.error("Error fetching past litters:", pastError);
      return {
        props: { currentLitters: [], upcomingLitters: [], pastLitters: [] },
      };
    }

    // Process current litters
    const currentLitters = await Promise.all(
      (currentLittersData || []).map(async (litter) => {
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

    // Process upcoming litters
    const upcomingLitters = await Promise.all(
      (upcomingLittersData || []).map(async (litter) => {
        const mother = await fetchCatDetails(litter.mother_id);
        const father = await fetchCatDetails(litter.father_id);

        return {
          ...litter,
          mother,
          father,
          kittens: [],
        };
      })
    );

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

    return {
      props: {
        currentLitters: currentLitters.filter(
          (litter) => litter.mother && litter.father
        ),
        upcomingLitters: upcomingLitters.filter(
          (litter) => litter.mother && litter.father
        ),
        pastLitters: pastLitters.filter(
          (litter) => litter.mother && litter.father
        ),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        currentLitters: [],
        upcomingLitters: [],
        pastLitters: [],
      },
      revalidate: 60,
    };
  }
};
