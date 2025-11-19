import { useEffect, useState, useRef } from "react";
import {
  Button,
  Stack,
  Text,
  Title,
  Modal,
  Box,
  Center,
  Flex,
} from "@mantine/core";
import { createClient } from "@supabase/supabase-js";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { getHeroImage } from "../utils/heroImagesServer";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatGalleryModal } from "../components/CatGalleryModal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MedicalTestsModal } from "../components/MedicalTestsModal";
import { LitterCard } from "../components/LitterCard";
const LiteYouTubeEmbed = dynamic(
  () => import("react-lite-youtube-embed").then((module) => module.default),
  { ssr: false }
);

// Import translations
import csTranslations from "../locales/cs/litters.json";
import enTranslations from "../locales/en/litters.json";
import deTranslations from "../locales/de/litters.json";
import csCatsTranslations from "../locales/cs/cats.json";
import enCatsTranslations from "../locales/en/cats.json";
import deCatsTranslations from "../locales/de/cats.json";
import LittersPageSEO from "../components/SEO/LittersPageSEO";
import { fetchLittersByStatus } from "../utils/supabase/queries";

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
  youtube_video_link?: string;
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
  youtube_video_link?: string;
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
  medical_tests?: MedicalTest[];
  is_own_breeding_cat: boolean;
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

// Props interface
interface LittersPageProps {
  currentLitters: Litter[];
  upcomingLitters: Litter[];
  initialPastLitters: Litter[];
  heroImage: string | null;
}

// Pagination interface
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export default function LittersPage({
  currentLitters,
  upcomingLitters,
  initialPastLitters,
  heroImage,
}: LittersPageProps) {
  const router = useRouter();
  const { locale } = router;
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [selectedImages, setSelectedImages] = useState<CatImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [videoModalOpened, setVideoModalOpened] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  // Medical tests modal state
  const [medicalTestsOpened, setMedicalTestsOpened] = useState(false);
  const [selectedMedicalTests, setSelectedMedicalTests] = useState<
    MedicalTest[]
  >([]);
  const [selectedCatName, setSelectedCatName] = useState("");

  // Past litters pagination state
  const [pastLitters, setPastLitters] = useState<Litter[]>(initialPastLitters);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: true,
  });

  const hashRef = useRef("");
  const isLoadingForHash = useRef(false);

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;
  const catsTranslations = {
    cs: csCatsTranslations,
    en: enCatsTranslations,
    de: deCatsTranslations,
  };
  const catsT =
    catsTranslations[locale as keyof typeof catsTranslations] ||
    catsTranslations.cs;

  // Initialize pagination data on mount
  useEffect(() => {
    const initializePagination = async () => {
      try {
        const response = await fetch(`/api/litters/past?page=1&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error initializing pagination:", error);
      }
    };

    initializePagination();
  }, []);

  // Effect to handle scrolling to a specific litter from a URL hash
  useEffect(() => {
    if (!router.isReady) return;

    const hash = window.location.hash.substring(1);
    if (!hash) return;

    // Check for the element after a short delay to allow for initial rendering
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // If element is not found, start loading more litters
      if (pagination.hasMore && !isLoadingForHash.current) {
        hashRef.current = hash;
        isLoadingForHash.current = true;
        loadMorePastLitters();
      }
    }, 500);
  }, [router.isReady]);

  // Effect to continue loading litters until the hashed element is found
  useEffect(() => {
    if (!hashRef.current || !isLoadingForHash.current) return;

    const element = document.getElementById(hashRef.current);

    if (element) {
      // Element found, scroll to it and stop loading
      element.scrollIntoView({ behavior: "smooth" });
      isLoadingForHash.current = false;
      hashRef.current = "";
    } else if (pagination.hasMore) {
      // Element not found, continue loading
      loadMorePastLitters();
    } else {
      // No more litters to load, stop trying
      isLoadingForHash.current = false;
      hashRef.current = "";
    }
  }, [pastLitters]);

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

  // Function to load more past litters
  const loadMorePastLitters = async () => {
    if (loadingMore || !pagination.hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await fetch(
        `/api/litters/past?page=${nextPage}&limit=${pagination.limit}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more litters");
      }

      const data = await response.json();

      setPastLitters((prev) => [...prev, ...data.litters]);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading more past litters:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle opening video modal
  const handleOpenVideo = (videoId: string) => {
    setVideoId(videoId);
    setVideoModalOpened(true);
  };

  // Prepare kittens data for SEO (from current litters)
  // Only include kittens that are actually available for sale:
  // - NOT own breeding cats
  // - Status is "alive" (available)
  // - NOT sold, reserved, deceased, under_breeding_evaluation, or preliminarily_reserved
  const kittensForSEO = currentLitters.flatMap((litter) =>
    litter.kittens
      .filter((kitten) => {
        const isAvailable =
          !kitten.is_own_breeding_cat && kitten.status === "alive";
        return isAvailable;
      })
      .map((kitten) => ({
        name: kitten.name,
        description: kitten.description || `${kitten.name} - Ragdoll kitten`,
        images: kitten.images ? kitten.images.map((img) => img.url) : [],
        color: kitten.color?.name_cs || kitten.color?.name_en,
        variety: kitten.variety?.name_cs || kitten.variety?.name_en,
        birthDate: kitten.birth_date,
        gender: kitten.gender,
        status: kitten.status,
      }))
  );

  return (
    <>
      <LittersPageSEO kittens={kittensForSEO} />
      <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
        <HeroImageBackgroundWithData
          heading={t.hero.heading}
          subtext={t.hero.subtext}
          backgroundImage={heroImage || undefined}
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

              {upcomingLitters.map((litter) => (
                <LitterCard
                  key={litter.id}
                  litter={litter}
                  type="upcoming"
                  translations={t}
                  catsTranslations={catsT}
                  onOpenGallery={handleOpenGallery}
                  onOpenVideo={handleOpenVideo}
                  onOpenMedicalTests={handleOpenMedicalTests}
                  showParentsAccordion={true}
                  defaultParentsOpen={true}
                />
              ))}
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

              {currentLitters.map((litter) => (
                <LitterCard
                  key={litter.id}
                  litter={litter}
                  type="current"
                  translations={t}
                  catsTranslations={catsT}
                  onOpenGallery={handleOpenGallery}
                  onOpenVideo={handleOpenVideo}
                  onOpenMedicalTests={handleOpenMedicalTests}
                  showParentsAccordion={true}
                />
              ))}
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

              {pastLitters.map((litter) => (
                <LitterCard
                  key={litter.id}
                  litter={litter}
                  type="past"
                  translations={t}
                  catsTranslations={catsT}
                  onOpenGallery={handleOpenGallery}
                  onOpenVideo={handleOpenVideo}
                  onOpenMedicalTests={handleOpenMedicalTests}
                  showParentsAccordion={true}
                />
              ))}

              {/* Load More Button */}
              {pagination.hasMore && (
                <Center>
                  <Button
                    onClick={loadMorePastLitters}
                    loading={loadingMore}
                    color="#47a3ee"
                    size="lg"
                    variant="outline"
                  >
                    {loadingMore
                      ? locale === "cs"
                        ? "Načítám..."
                        : locale === "de"
                        ? "Lade..."
                        : "Loading..."
                      : locale === "cs"
                      ? "Načíst více vrhů"
                      : locale === "de"
                      ? "Mehr Würfe laden"
                      : "Load More Litters"}
                  </Button>
                </Center>
              )}
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

        <Modal
          opened={videoModalOpened}
          onClose={() => setVideoModalOpened(false)}
          title="Video vrhu"
          centered
          size="lg"
        >
          {videoId && (
            <Box style={{ aspectRatio: "16/9", width: "100%" }}>
              <LiteYouTubeEmbed
                id={videoId}
                title="YouTube video preview"
                wrapperClass="yt-lite"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          )}
        </Modal>

        <MedicalTestsModal
          opened={medicalTestsOpened}
          onClose={() => setMedicalTestsOpened(false)}
          tests={selectedMedicalTests}
          catName={selectedCatName}
          locale={locale as string}
          translations={catsT}
        />
      </Stack>
    </>
  );
}

export const getStaticProps: GetStaticProps<LittersPageProps> = async () => {
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch hero image
    const heroImage = await getHeroImage("litters");

    const [currentLitters, upcomingLitters, initialPastLitters] =
      await Promise.all([
        fetchLittersByStatus("current", supabase),
        fetchLittersByStatus("planned", supabase),
        fetchLittersByStatus("past", supabase, 10),
      ]);

    return {
      props: {
        currentLitters: currentLitters.filter(
          (litter: any) => litter.mother && litter.father
        ),
        upcomingLitters: upcomingLitters.filter(
          (litter: any) => litter.mother && litter.father
        ),
        initialPastLitters: initialPastLitters.filter(
          (litter: any) => litter.mother && litter.father
        ),
        heroImage,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        currentLitters: [],
        upcomingLitters: [],
        initialPastLitters: [],
        heroImage: null,
      },
      revalidate: 60,
    };
  }
};
