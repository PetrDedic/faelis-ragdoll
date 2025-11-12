import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { getHeroImage } from "../utils/heroImagesServer";
import { GetStaticProps } from "next";
import { Form } from "../components/Form";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Modal,
  Stack,
  Title,
  Container,
  SimpleGrid,
  AspectRatio,
  Button,
  Flex,
  Box,
} from "@mantine/core";
import {
  IconTrophy,
  IconX,
  IconCalendar,
  IconMapPin,
  IconLibraryPhoto,
} from "@tabler/icons-react";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { CatGalleryModal } from "../components/CatGalleryModal";

// Import translations
import csTranslations from "../locales/cs/achievements.json";
import enTranslations from "../locales/en/achievements.json";
import deTranslations from "../locales/de/achievements.json";
import AchievementsPageSEO from "../components/SEO/AchievementsPageSEO";

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export interface Achievement {
  id: string;
  cat_id: string;
  cat_name: string;
  title: string;
  show_name?: string;
  date?: string;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  images: AchievementImage[];
}

interface AchievementImage {
  id: string;
  url: string;
  is_primary: boolean;
  title?: string;
  description?: string;
  display_order?: number;
}

interface AchievementsPageProps {
  achievements: Achievement[];
  heroImage: string | null;
}

export default function AchievementsPage({
  achievements,
  heroImage,
}: AchievementsPageProps) {
  const router = useRouter();
  const { locale } = router;
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [selectedImages, setSelectedImages] = useState<AchievementImage[]>([]);
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

  const handleImageClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  const handleOpenGallery = (
    images: AchievementImage[],
    initialIndex: number = 0
  ) => {
    setSelectedImages(images);
    setSelectedImageIndex(initialIndex);
    setGalleryOpened(true);
  };

  const getPrimaryImage = (achievement: Achievement) => {
    return (
      achievement.images.find((img) => img.is_primary) || achievement.images[0]
    );
  };

  const formatDate = (dateString: string, locale: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(
      locale === "cs" ? "cs-CZ" : locale === "de" ? "de-DE" : "en-US",
      options
    );
  };

  if (achievements.length === 0) {
    return (
      <>
        <AchievementsPageSEO />
        <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
          <HeroImageBackgroundWithData
            backgroundImage={heroImage || undefined}
            backgroundPosition="center 75%"
            heading={t.title}
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
                {t.title}
              </Title>
              <Text size="lg" c="black" ta="center" maw={960}>
                {t.description}
              </Text>
            </Stack>

            <Container size="lg" py="xl">
              <Stack align="center" gap="md">
                <IconTrophy size={64} color="gray" />
                <Text size="lg" c="dimmed" ta="center">
                  {locale === "cs"
                    ? "Zatím nemáme žádné výstavní úspěchy k zobrazení."
                    : locale === "de"
                    ? "Wir haben noch keine Ausstellungserfolge zu zeigen."
                    : "We don't have any show achievements to display yet."}
                </Text>
              </Stack>
            </Container>
          </Stack>
          <Form />
        </Stack>
      </>
    );
  }

  return (
    <>
      <AchievementsPageSEO />
      <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
        <HeroImageBackgroundWithData
          backgroundImage={heroImage || undefined}
          backgroundPosition="center 75%"
          heading={t.title}
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
              {t.title}
            </Title>
            <Text size="lg" c="black" ta="center" maw={960}>
              {t.description}
            </Text>
          </Stack>

          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="lg"
            verticalSpacing="lg"
            w="100%"
          >
            {achievements.map((achievement) => {
              const primaryImage = getPrimaryImage(achievement);
              return (
                <Card
                  key={achievement.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageClick(achievement)}
                >
                  <Card.Section>
                    <AspectRatio ratio={4 / 3}>
                      <Image
                        src={primaryImage?.url || "/images/placeholder.svg"}
                        alt={`${achievement.cat_name} - ${achievement.title}`}
                        fit="cover"
                      />
                    </AspectRatio>
                  </Card.Section>

                  <Stack mt="md" gap="xs">
                    <Group justify="space-between">
                      <Text fw={500} size="lg">
                        {achievement.cat_name}
                      </Text>
                      <Badge
                        color="yellow"
                        variant="filled"
                        leftSection={<IconTrophy size={12} />}
                      >
                        {achievement.title}
                      </Badge>
                    </Group>

                    {achievement.show_name && (
                      <Group gap="xs">
                        <IconMapPin size={14} color="#47a3ee" />
                        <Text size="sm" c="dimmed">
                          {achievement.show_name}
                        </Text>
                      </Group>
                    )}

                    {achievement.date && (
                      <Group gap="xs">
                        <IconCalendar size={14} color="#47a3ee" />
                        <Text size="sm" c="dimmed">
                          {formatDate(achievement.date, locale as string)}
                        </Text>
                      </Group>
                    )}

                    {achievement.category && (
                      <Badge variant="outline" color="blue" size="sm">
                        {achievement.category}
                      </Badge>
                    )}

                    {achievement.description && (
                      <Text size="sm" lineClamp={3}>
                        {achievement.description}
                      </Text>
                    )}

                    {achievement.images.length > 1 && (
                      <Badge variant="light" color="gray" size="sm">
                        {achievement.images.length} obrázků
                      </Badge>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>

        {/* Achievement Detail Modal */}
        <Modal
          opened={!!selectedAchievement}
          onClose={closeModal}
          title={
            selectedAchievement ? (
              <Group>
                <IconTrophy size={20} color="#47a3ee" />
                <Text fw={500}>
                  {selectedAchievement.cat_name} - {selectedAchievement.title}
                </Text>
              </Group>
            ) : (
              ""
            )
          }
          size="lg"
          centered
        >
          {selectedAchievement && (
            <Stack gap="md">
              {selectedAchievement.images.length > 0 && (
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={
                      getPrimaryImage(selectedAchievement)?.url ||
                      "/images/placeholder.svg"
                    }
                    alt={`${selectedAchievement.cat_name} - ${selectedAchievement.title}`}
                    fit="cover"
                    radius="md"
                  />
                </AspectRatio>
              )}

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    {selectedAchievement.cat_name}
                  </Text>
                  <Badge
                    color="yellow"
                    variant="filled"
                    leftSection={<IconTrophy size={12} />}
                    size="lg"
                  >
                    {selectedAchievement.title}
                  </Badge>
                </Group>

                {selectedAchievement.show_name && (
                  <Group gap="xs">
                    <IconMapPin size={16} color="#47a3ee" />
                    <Text size="md">
                      <strong>Výstava:</strong> {selectedAchievement.show_name}
                    </Text>
                  </Group>
                )}

                {selectedAchievement.date && (
                  <Group gap="xs">
                    <IconCalendar size={16} color="#47a3ee" />
                    <Text size="md">
                      <strong>Datum:</strong>{" "}
                      {formatDate(selectedAchievement.date, locale as string)}
                    </Text>
                  </Group>
                )}

                {selectedAchievement.category && (
                  <Badge variant="outline" color="blue" size="md">
                    {selectedAchievement.category}
                  </Badge>
                )}

                {selectedAchievement.description && (
                  <Text size="md">{selectedAchievement.description}</Text>
                )}

                <Flex align="center" gap={8}>
                  {selectedAchievement.images.length > 0 && (
                    <Button
                      w="max-content"
                      px={16}
                      color="#47a3ee"
                      variant="outline"
                      size="xs"
                      leftSection={<IconLibraryPhoto size={16} />}
                      onClick={() =>
                        handleOpenGallery(selectedAchievement.images)
                      }
                    >
                      {locale === "cs"
                        ? "Galerie"
                        : locale === "de"
                        ? "Galerie"
                        : "Gallery"}
                    </Button>
                  )}
                </Flex>
              </Stack>
            </Stack>
          )}
        </Modal>

        {/* Image Gallery Modal */}
        <CatGalleryModal
          images={selectedImages}
          opened={galleryOpened}
          onClose={() => setGalleryOpened(false)}
          initialImageIndex={selectedImageIndex}
        />

        <Form />
      </Stack>
    </>
  );
}

export const getStaticProps: GetStaticProps<
  AchievementsPageProps
> = async () => {
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch hero image
    const heroImage = await getHeroImage("achievements");

    // Fetch achievements with related data
    const { data: achievementsData, error } = await supabase
      .from("achievements")
      .select(
        `
        *,
        cats!inner(name),
        achievement_images(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching achievements:", error);
      return {
        props: {
          achievements: [],
          heroImage,
        },
        revalidate: 3600, // Revalidate every hour
      };
    }

    // Process achievements data
    const achievements = (achievementsData || []).map((achievement: any) => ({
      ...achievement,
      cat_name: achievement.cats.name,
      images: achievement.achievement_images || [],
    }));

    return {
      props: {
        achievements,
        heroImage,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        achievements: [],
        heroImage: null,
      },
      revalidate: 3600, // Revalidate every hour
    };
  }
};
