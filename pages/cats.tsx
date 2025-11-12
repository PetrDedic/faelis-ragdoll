import { useEffect, useState } from "react";
import {
  Accordion,
  AspectRatio,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { getHeroImage } from "../utils/heroImagesServer";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatInfo } from "../components/CatInfo";
import {
  formatDate,
  getGenderText,
  getLocalizedCatProperty,
} from "../utils/catTranslations";

// Import translations
import csTranslations from "../locales/cs/cats.json";
import enTranslations from "../locales/en/cats.json";
import deTranslations from "../locales/de/cats.json";
import Link from "next/link";
import {
  IconCat,
  IconFileInfo,
  IconGenderFemale,
  IconGenderMale,
  IconLibraryPhoto,
  IconStethoscope,
} from "@tabler/icons-react";
import { CatGalleryModal } from "../components/CatGalleryModal";
import { MedicalTestsModal } from "../components/MedicalTestsModal";
import Image from "next/image";
import CatsPageSEO from "../components/SEO/CatsPageSEO";
import {
  generateCatAltText,
  getLocalizedColorVariety,
} from "../utils/imageAltText";

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
    name_en?: string;
    name_de?: string;
  };
  variety: {
    code: string;
    name_cs: string;
    name_en?: string;
    name_de?: string;
  };
  blood_type: {
    type: string;
    genetic_code: string;
  };
  genetic_code: string;
  pedigree_link: string;
  youtube_video_link?: string;
  medical_tests?: MedicalTest[];
}

interface MedicalTest {
  id: string;
  test_name: string;
  test_result: string;
  test_date: string;
  valid_from: string;
  valid_until: string | null;
  laboratory: string;
  certificate_number: string;
  notes: string;
}

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface Litter {
  id: string;
  mother_id: string;
  father_id: string;
  birth_date: string;
  number_of_kittens: number;
  number_of_males: number;
  number_of_females: number;
  description: string;
  details: string;
  kittens: Cat[];
  expected_date?: string; // For upcoming litters
  status: "planned" | "current" | "past";
}

// Props interface
interface CatsPageProps {
  maleCats: Cat[];
  femaleCats: Cat[];
  currentLitters: Litter[];
  upcomingLitters: Litter[];
  pastLitters: Litter[];
  heroImage: string | null;
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function CatsPage({
  maleCats,
  femaleCats,
  currentLitters,
  upcomingLitters,
  pastLitters,
  heroImage,
}: CatsPageProps) {
  const router = useRouter();
  const { locale } = router;

  const [galleryOpened, setGalleryOpened] = useState(false);
  const [selectedImages, setSelectedImages] = useState<CatImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [medicalTestsOpened, setMedicalTestsOpened] = useState(false);
  const [selectedMedicalTests, setSelectedMedicalTests] = useState<
    MedicalTest[]
  >([]);
  const [selectedCatName, setSelectedCatName] = useState("");

  const handleOpenGallery = (images: CatImage[], initialIndex: number = 0) => {
    setSelectedImages(images);
    setSelectedImageIndex(initialIndex);
    setGalleryOpened(true);
  };

  const handleOpenMedicalTests = (tests: MedicalTest[], catName: string) => {
    setSelectedMedicalTests(tests);
    setSelectedCatName(catName);
    setMedicalTestsOpened(true);
  };

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  const renderLitterCard = (
    litter: Litter,
    type: "current" | "upcoming" | "past"
  ) => {
    const isPlanned = litter.status === "planned";
    const isCurrent = litter.status === "current";

    // Helper function to safely get cat images
    const getCatImage = (cat: Cat) => {
      if (cat.images && cat.images.length > 0) {
        return cat.images[0].url;
      }
      return "/images/placeholder.svg";
    };

    const getSeasonFromDate = (dateString: string, locale: string): string => {
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // getMonth() returns 0-11

      let season: string;
      if (month >= 3 && month <= 5) {
        season =
          locale === "cs" ? "Jaro" : locale === "de" ? "Frühling" : "Spring";
      } else if (month >= 6 && month <= 8) {
        season =
          locale === "cs" ? "Léto" : locale === "de" ? "Sommer" : "Summer";
      } else if (month >= 9 && month <= 11) {
        season =
          locale === "cs" ? "Podzim" : locale === "de" ? "Herbst" : "Autumn";
      } else {
        season =
          locale === "cs" ? "Zima" : locale === "de" ? "Winter" : "Winter";
      }

      const year = date.getFullYear();
      return `${season} ${year}`;
    };

    return (
      <Card key={litter.id} p="lg" mb="xl" w="100%">
        <Stack align="center">
          <Stack w="100%">
            <Title order={3} size="h1" ta="center">
              {litter.description}
            </Title>
            <Flex wrap="wrap" gap={16}>
              <Badge size="lg">
                {type === "upcoming"
                  ? t.upcomingLitters?.expectedDate || "Expected date"
                  : t.pastLitters?.birthDate || "Birth date"}
                :{" "}
                {type === "upcoming"
                  ? getSeasonFromDate(litter.expected_date!, locale as string)
                  : formatDate(litter.birth_date, locale as string)}
              </Badge>
              {isPlanned && (
                <Badge color="orange" size="lg">
                  {t.commonLabels?.planned || "Planned litter"}
                </Badge>
              )}
              {isCurrent && (
                <Badge color="green" size="lg">
                  {t.commonLabels?.current || "Current litter"}
                </Badge>
              )}
            </Flex>

            {type !== "upcoming" && (
              <Flex w="100%" gap={8}>
                <Badge leftSection={<IconCat size={16} />} color="black">
                  {t.pastLitters?.kittens || "Kittens"}:{" "}
                  {litter.number_of_kittens}
                </Badge>
                <Badge
                  leftSection={<IconGenderMale size={16} />}
                  variant="light"
                  color="black"
                >
                  {t.pastLitters?.males || "Males"}: {litter.number_of_males}
                </Badge>
                <Badge
                  leftSection={<IconGenderFemale size={16} />}
                  variant="light"
                  color="black"
                >
                  {t.pastLitters?.females || "Females"}:{" "}
                  {litter.number_of_females}
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
                                borderRadius: 16,
                                cursor: "pointer",
                              }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={generateCatAltText(
                                {
                                  name: kitten.name,
                                  gender: kitten.gender,
                                  ...getLocalizedColorVariety(
                                    kitten,
                                    locale as string
                                  ),
                                  role: "kitten",
                                },
                                locale as string
                              )}
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
                              ? t.commonLabels?.male || "Male"
                              : t.commonLabels?.female || "Female"}
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
                              {t.commonLabels?.gallery || "Gallery"}
                            </Button>
                          )}
                          {kitten.status !== "sold" && (
                            <Button
                              color="#47a3ee"
                              variant="light"
                              size="xs"
                              fullWidth
                            >
                              {kitten.status === "reserved"
                                ? t.commonLabels?.reserved || "Reserved"
                                : kitten.status === "under_breeding_evaluation"
                                ? t.commonLabels?.underBreedingEvaluation ||
                                  "Under breeding evaluation"
                                : kitten.status === "preliminarily_reserved"
                                ? t.commonLabels?.preliminarilyReserved ||
                                  "Preliminarily reserved"
                                : t.commonLabels?.available || "Available"}
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

          <Link
            href="/litters"
            style={{ textDecoration: "inherit", color: "inherit" }}
          >
            <Button
              color="#47a3ee"
              size="compact-lg"
              fw={400}
              px={24}
              w={{ base: "100%", sm: "fit-content" }}
            >
              {t.contact.button}
            </Button>
          </Link>
        </Stack>
      </Card>
    );
  };

  // Prepare data for SEO
  const allCats = [...maleCats, ...femaleCats];
  const catsForSEO = allCats.map((cat) => ({
    name: cat.name,
    image: cat.images && cat.images.length > 0 ? cat.images[0].url : undefined,
    description: cat.description || cat.details,
  }));

  return (
    <>
      <CatsPageSEO cats={catsForSEO} />
      <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
        <HeroImageBackgroundWithData
          heading={t.hero.heading}
          subtext={t.hero.subtext}
          backgroundImage={heroImage || undefined}
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
          <Stack
            w="100%"
            align="center"
            gap={32}
            id="female-cats"
            style={{ scrollMargin: "100px" }}
          >
            <Title order={2} size="h1" c="#47a3ee" ta="center">
              {t.cats.femaleCats}
            </Title>

            {femaleCats.map((cat) => (
              <CatInfo
                key={cat.id}
                images={
                  cat.images.length > 0
                    ? {
                        top: cat.images[0]?.url,
                        middle:
                          cat.images.length > 1
                            ? cat.images[1]?.url
                            : cat.images[0]?.url,
                        right:
                          cat.images.length > 2
                            ? cat.images[2]?.url
                            : cat.images[0]?.url,
                      }
                    : {
                        top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        middle:
                          "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        right:
                          "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      }
                }
                name={cat.name}
                info={
                  <Stack gap={4}>
                    <Text span>{cat.description}</Text>
                    <Text span>
                      {t.catInfo.gender}: {getGenderText(cat.gender, t)}
                    </Text>
                    <Text span>
                      {t.catInfo.birthDate}:{" "}
                      {formatDate(cat.birth_date, locale as string)}
                    </Text>
                    <Text span>
                      {t.catInfo.color}:{" "}
                      {getLocalizedCatProperty(cat, "color", locale as string)}
                    </Text>
                    <Text span>
                      {t.catInfo.variety}:{" "}
                      {getLocalizedCatProperty(
                        cat,
                        "variety",
                        locale as string
                      )}
                    </Text>
                    <Text span>
                      {t.catInfo.bloodGroup}: {cat.blood_type?.type} /{" "}
                      {cat.blood_type?.type}
                    </Text>
                    <Text span>
                      {t.catInfo.geneticCode}: {cat.genetic_code}
                    </Text>
                    <Text mt="md" span>
                      {cat.details}
                    </Text>
                    <Flex align="center" gap={8}>
                      {cat.images.length > 0 && (
                        <Button
                          w="max-content"
                          px={16}
                          color="#47a3ee"
                          variant="outline"
                          size="xs"
                          leftSection={<IconLibraryPhoto size={16} />}
                          onClick={() => handleOpenGallery(cat.images)}
                        >
                          {t.gallery.heading}
                        </Button>
                      )}
                      {cat.pedigree_link && (
                        <Button
                          component={Link}
                          href={cat.pedigree_link}
                          target="_blank"
                          w="max-content"
                          px={16}
                          color="#47a3ee"
                          variant="outline"
                          size="xs"
                          leftSection={<IconFileInfo size={16} />}
                        >
                          {t.pedigree.heading}
                        </Button>
                      )}
                      {cat.medical_tests && cat.medical_tests.length > 0 && (
                        <Button
                          w="max-content"
                          px={16}
                          color="#47a3ee"
                          variant="outline"
                          size="xs"
                          leftSection={<IconStethoscope size={16} />}
                          onClick={() =>
                            handleOpenMedicalTests(cat.medical_tests!, cat.name)
                          }
                        >
                          {t.medicalTests?.heading || "Medical Tests"}
                        </Button>
                      )}
                    </Flex>
                  </Stack>
                }
              />
            ))}
          </Stack>

          <FullscreenBackroundSection image="https://images.unsplash.com/photo-1586417752912-b0389b445a20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
            <Stack align="center" w="100%" maw={960} gap={48} py={32}>
              <Title order={2} size="h1">
                {t.facts.heading}
              </Title>
              <Grid w="100%" gutter={32}>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      {t.facts.stat1.number}
                    </Text>
                    <Text c="dark" ta="center">
                      {t.facts.stat1.text}
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      {t.facts.stat2.number}
                    </Text>
                    <Text c="dark" ta="center">
                      {t.facts.stat2.text}
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      {t.facts.stat3.number}
                    </Text>
                    <Text c="dark" ta="center">
                      {t.facts.stat3.text}
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      {t.facts.stat4.number}
                    </Text>
                    <Text c="dark" ta="center">
                      {t.facts.stat4.text}
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
              <Link
                href="/about"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                <Button
                  color="#47a3ee"
                  size="compact-lg"
                  fw={400}
                  px={24}
                  w={{ base: "100%", sm: "fit-content" }}
                >
                  {t.facts.button}
                </Button>
              </Link>
            </Stack>
          </FullscreenBackroundSection>

          <Stack
            w="100%"
            align="center"
            gap={32}
            id="male-cats"
            style={{ scrollMargin: "100px" }}
          >
            <Title order={2} size="h1" c="#47a3ee" ta="center">
              {t.cats.maleCats}
            </Title>

            {maleCats.map((cat) => {
              return (
                <CatInfo
                  key={cat.id}
                  images={
                    cat.images.length > 0
                      ? {
                          // Use different images for each position when available
                          top: cat.images[0]?.url,
                          middle:
                            cat.images.length > 1
                              ? cat.images[1]?.url
                              : cat.images[0]?.url,
                          right:
                            cat.images.length > 2
                              ? cat.images[2]?.url
                              : cat.images[0]?.url,
                        }
                      : {
                          // Fallback images
                          top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          middle:
                            "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                          right:
                            "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }
                  }
                  name={cat.name}
                  info={
                    <Stack gap={4}>
                      <Text span>{cat.description}</Text>
                      <Text span>
                        {t.catInfo.gender}: {getGenderText(cat.gender, t)}
                      </Text>
                      <Text span>
                        {t.catInfo.birthDate}:{" "}
                        {formatDate(cat.birth_date, locale as string)}
                      </Text>
                      <Text span>
                        {t.catInfo.color}:{" "}
                        {getLocalizedCatProperty(
                          cat,
                          "color",
                          locale as string
                        )}
                      </Text>
                      <Text span>
                        {t.catInfo.variety}:{" "}
                        {getLocalizedCatProperty(
                          cat,
                          "variety",
                          locale as string
                        )}
                      </Text>
                      <Text span>
                        {t.catInfo.bloodGroup}: {cat.blood_type?.type} /{" "}
                        {cat.blood_type?.type}
                      </Text>
                      <Text span>
                        {t.catInfo.geneticCode}: {cat.genetic_code}
                      </Text>
                      <Text mt="md" span>
                        {cat.details}
                      </Text>
                      <Flex align="center" gap={8}>
                        {cat.images.length > 0 && (
                          <Button
                            w="max-content"
                            px={16}
                            color="#47a3ee"
                            variant="outline"
                            size="xs"
                            leftSection={<IconLibraryPhoto size={16} />}
                            onClick={() => handleOpenGallery(cat.images)}
                          >
                            {t.gallery.heading}
                          </Button>
                        )}
                        {cat.pedigree_link && (
                          <Button
                            component={Link}
                            href={cat.pedigree_link}
                            target="_blank"
                            w="max-content"
                            px={16}
                            color="#47a3ee"
                            variant="outline"
                            size="xs"
                            leftSection={<IconFileInfo size={16} />}
                          >
                            {t.pedigree.heading}
                          </Button>
                        )}
                        {cat.medical_tests && cat.medical_tests.length > 0 && (
                          <Button
                            w="max-content"
                            px={16}
                            color="#47a3ee"
                            variant="outline"
                            size="xs"
                            leftSection={<IconStethoscope size={16} />}
                            onClick={() =>
                              handleOpenMedicalTests(
                                cat.medical_tests!,
                                cat.name
                              )
                            }
                          >
                            {t.medicalTests?.heading || "Medical Tests"}
                          </Button>
                        )}
                      </Flex>
                    </Stack>
                  }
                />
              );
            })}
          </Stack>

          <FullscreenBackroundSection>
            <Stack align="center" w="100%" maw={720} py={32}>
              <Title order={2} size="h1" c="dark" ta="center">
                {t.contact.heading}
              </Title>
              <Text size="lg" c="black" ta="center">
                {t.contact.subtext}
              </Text>
              <Link
                href="/litters"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                <Button
                  color="#47a3ee"
                  size="compact-lg"
                  fw={400}
                  px={24}
                  w={{ base: "100%", sm: "fit-content" }}
                >
                  {t.contact.button}
                </Button>
              </Link>
            </Stack>
          </FullscreenBackroundSection>

          {/* Add this section after the kittens title */}
          <Stack w="100%" align="center" gap={32}>
            <Title order={2} size="h1" c="#47a3ee" ta="center">
              {t.kittens.title}
            </Title>

            {upcomingLitters.length > 0 ? (
              <Stack w="100%" align="center" gap={16}>
                <Title order={2} c="#47a3ee" ta="center">
                  {t.upcomingLitters.title || "Upcoming Litters"}
                </Title>
                <Text size="lg" c="black" ta="center">
                  {t.upcomingLitters.description ||
                    "We're excited to share our planned litters. Contact us to reserve a kitten from these upcoming litters."}
                </Text>

                {upcomingLitters.map((litter) =>
                  renderLitterCard(litter, "upcoming")
                )}
              </Stack>
            ) : currentLitters.length > 0 ? (
              <Stack w="100%" align="center" gap={16}>
                <Title order={2} c="#47a3ee" ta="center">
                  {t.currentLitters.title || "Current Litters"}
                </Title>
                <Text size="lg" c="black" ta="center">
                  {t.currentLitters.description ||
                    "Browse through our current litters to see our beautiful kittens."}
                </Text>

                {currentLitters.map((litter) =>
                  renderLitterCard(litter, "current")
                )}
              </Stack>
            ) : pastLitters.length > 0 ? (
              <Stack w="100%" align="center" gap={16}>
                <Title order={2} c="#47a3ee" ta="center">
                  {t.pastLitters.title || "Past Litters"}
                </Title>
                <Text size="lg" c="black" ta="center">
                  {t.pastLitters.description ||
                    "Browse through our previous litters to see the beautiful kittens we've produced."}
                </Text>

                {renderLitterCard(pastLitters[0], "past")}
              </Stack>
            ) : (
              <Text c="dimmed" ta="center">
                {t.litters?.noLitters || "We currently don't have any litters"}
              </Text>
            )}
          </Stack>

          <Form />
        </Stack>

        <CatGalleryModal
          images={selectedImages}
          opened={galleryOpened}
          onClose={() => setGalleryOpened(false)}
          initialImageIndex={selectedImageIndex}
        />

        <MedicalTestsModal
          opened={medicalTestsOpened}
          onClose={() => setMedicalTestsOpened(false)}
          tests={selectedMedicalTests}
          catName={selectedCatName}
          locale={locale as string}
          translations={t}
        />
      </Stack>
    </>
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

      // Get medical tests for the cat
      const { data: medicalTests } = await supabase
        .from("medical_tests")
        .select("*")
        .eq("cat_id", catId)
        .order("test_date", { ascending: false });

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

      return kittens.filter(Boolean) as Cat[];
    } catch (error) {
      console.error("Error fetching kittens:", error);
      return [];
    }
  };

  try {
    // Fetch hero image
    const heroImage = await getHeroImage("cats");

    // Fetch male and female cats
    const maleCats = await fetchCatsWithDetails("male");
    const femaleCats = await fetchCatsWithDetails("female");

    const { data: currentLittersData, error: currentError } = await supabase
      .from("litters")
      .select("*")
      .eq("status", "current")
      .order("birth_date", { ascending: false });

    if (currentError) {
      console.error("Error fetching current litters:", currentError);
      return {
        props: {
          maleCats: [],
          femaleCats: [],
          currentLitters: [],
          upcomingLitters: [],
          pastLitters: [],
          heroImage,
        },
        revalidate: 60,
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
        props: {
          maleCats,
          femaleCats,
          currentLitters: [],
          upcomingLitters: [],
          pastLitters: [],
          heroImage,
        },
        revalidate: 60,
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
        props: {
          maleCats,
          femaleCats,
          currentLitters: [],
          upcomingLitters: [],
          pastLitters: [],
          heroImage,
        },
        revalidate: 60,
      };
    }

    // Process current litters
    const currentLitters = await Promise.all(
      (currentLittersData || []).map(async (litter) => {
        const kittens = await fetchKittensForLitter(litter.id);

        return {
          ...litter,
          kittens,
        };
      })
    );

    // Process upcoming litters
    const upcomingLitters = await Promise.all(
      (upcomingLittersData || []).map(async (litter) => {
        return {
          ...litter,
          kittens: [],
        };
      })
    );

    // Process past litters
    const pastLitters = await Promise.all(
      (pastLittersData || []).map(async (litter) => {
        const kittens = await fetchKittensForLitter(litter.id);

        return {
          ...litter,
          kittens,
        };
      })
    );

    return {
      props: {
        maleCats,
        femaleCats,
        currentLitters,
        upcomingLitters,
        pastLitters,
        heroImage,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        maleCats: [],
        femaleCats: [],
        currentLitters: [],
        upcomingLitters: [],
        pastLitters: [],
        heroImage: null,
      },
      revalidate: 60,
    };
  }
};
