import {
  Accordion,
  AspectRatio,
  Badge,
  Button,
  Card,
  CopyButton,
  Flex,
  Grid,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconCat,
  IconCopy,
  IconGenderFemale,
  IconGenderMale,
  IconLibraryPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { formatDate } from "../utils/catTranslations";
import {
  generateCatAltText,
  getLocalizedColorVariety,
} from "../utils/imageAltText";

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
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
  is_own_breeding_cat?: boolean;
}

interface Litter {
  id: string;
  name?: string;
  mother_id: string;
  father_id: string;
  birth_date: string;
  number_of_kittens: number;
  number_of_males: number;
  number_of_females: number;
  description: string;
  details: string;
  pedigree_link?: string;
  youtube_video_link?: string;
  mother: Cat;
  father: Cat;
  kittens: Cat[];
  expected_date?: string;
  status: "planned" | "current" | "past";
}

interface LitterCardProps {
  litter: Litter;
  type: "current" | "upcoming" | "past";
  translations: any;
  catsTranslations?: any;
  onOpenGallery: (images: CatImage[], initialIndex?: number) => void;
  onOpenVideo?: (videoId: string) => void;
  onOpenMedicalTests?: (tests: MedicalTest[], catName: string) => void;
  showKittens?: boolean;
  showPedigreeButton?: boolean;
  showParentsAccordion?: boolean;
  defaultParentsOpen?: boolean;
  showLittersPageButton?: boolean;
}

export function LitterCard({
  litter,
  type,
  translations: t,
  catsTranslations,
  onOpenGallery,
  onOpenVideo,
  onOpenMedicalTests,
  showKittens = true,
  showPedigreeButton = true,
  showParentsAccordion = true,
  defaultParentsOpen = false,
  showLittersPageButton = false,
}: LitterCardProps) {
  const router = useRouter();
  const { locale } = router;

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
      return "/images/placeholder.svg";
    }

    const primaryImage = cat.images.find((img) => img.is_primary);
    return primaryImage ? primaryImage.url : cat.images[0].url;
  };

  // Helper function to get season from date
  const getSeasonFromDate = (dateString: string, locale: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;

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

  // Helper to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const isPlanned = litter.status === "planned";
  const isCurrent = litter.status === "current";

  return (
    <Card
      key={litter.id}
      p={0}
      mb="xl"
      w="100%"
      id={litter.id}
      style={{ scrollMarginTop: 100 }}
    >
      <Stack align="center">
        <Stack w="100%">
          <Flex justify="space-between" align="center" w="100%">
            <Title order={3} size="h1" ta="center" style={{ flex: 1 }}>
              {litter.name || litter.description}
            </Title>
            <CopyButton
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}${router.asPath.split("#")[0]}#${
                      litter.id
                    }`
                  : ""
              }
              timeout={2000}
            >
              {({ copied, copy }) => (
                <Tooltip
                  label={
                    copied
                      ? t.commonLabels?.copied || "Copied!"
                      : t.commonLabels?.copyLink || "Copy link"
                  }
                  events={{
                    hover: true,
                    focus: true,
                    touch: true,
                  }}
                >
                  <Button
                    size="xs"
                    variant="subtle"
                    color={copied ? "blue" : "gray"}
                    onClick={copy}
                    px={6}
                  >
                    <IconCopy size={16} />
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
          </Flex>
          <Flex wrap="wrap" gap={16}>
            <Badge size="lg">
              {type === "upcoming"
                ? t.upcomingLitters?.expectedDate || "Expected date"
                : t.pastLitters?.birthDate || "Birth date"}
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
                {t.commonLabels?.planned || "Planned litter"}
              </Badge>
            )}
            {isCurrent && (
              <Badge color="green" size="lg">
                {t.commonLabels?.current || "Current litter"}
              </Badge>
            )}
            {litter.youtube_video_link &&
              getYouTubeVideoId(litter.youtube_video_link ?? "") &&
              onOpenVideo && (
                <Badge
                  color="#47a3ee"
                  size="lg"
                  variant="outline"
                  leftSection={<IconVideo size={16} />}
                  onClick={() => {
                    const videoId = getYouTubeVideoId(
                      litter.youtube_video_link ?? ""
                    );
                    if (videoId) onOpenVideo(videoId);
                  }}
                  style={{ minWidth: 100, cursor: "pointer" }}
                >
                  Video
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

        {showKittens &&
          type !== "upcoming" &&
          litter.kittens &&
          litter.kittens.length > 0 && (
            <Stack w="100%">
              <Grid>
                {litter.kittens.map((kitten) => {
                  return (
                    <Grid.Col
                      key={kitten.id}
                      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    >
                      <Card
                        pb={24}
                        style={{ position: "relative", scrollMarginTop: 100 }}
                        padding="lg"
                        radius="lg"
                        bg="#d6e6f3"
                        id={kitten.id}
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
                                onClick={() => onOpenGallery(kitten.images)}
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
                              onClick={() => onOpenGallery(kitten.images)}
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
                          <Flex justify="space-between" align="center">
                            <Text fw={500} size="sm">
                              {kitten.name}
                            </Text>
                            <CopyButton
                              value={
                                typeof window !== "undefined"
                                  ? `${window.location.origin}${
                                      router.asPath.split("#")[0]
                                    }#${kitten.id}`
                                  : ""
                              }
                              timeout={2000}
                            >
                              {({ copied, copy }) => (
                                <Tooltip
                                  label={
                                    copied
                                      ? t.commonLabels?.copied || "Copied!"
                                      : t.commonLabels?.copyLink || "Copy link"
                                  }
                                  events={{
                                    hover: true,
                                    focus: true,
                                    touch: true,
                                  }}
                                >
                                  <Button
                                    size="xs"
                                    variant="subtle"
                                    color={copied ? "green" : "blue"}
                                    onClick={copy}
                                    px={6}
                                  >
                                    <IconCopy size={16} />
                                  </Button>
                                </Tooltip>
                              )}
                            </CopyButton>
                          </Flex>
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
                              onClick={() => onOpenGallery(kitten.images)}
                            >
                              {t.commonLabels?.gallery || "Gallery"}
                            </Button>
                          )}
                          {kitten.youtube_video_link &&
                            getYouTubeVideoId(
                              kitten.youtube_video_link ?? ""
                            ) &&
                            onOpenVideo && (
                              <Button
                                color="#47a3ee"
                                size="xs"
                                variant="outline"
                                leftSection={<IconVideo size={16} />}
                                onClick={() => {
                                  const videoId = getYouTubeVideoId(
                                    kitten.youtube_video_link ?? ""
                                  );
                                  if (videoId) onOpenVideo(videoId);
                                }}
                                style={{ minWidth: 80 }}
                              >
                                Video
                              </Button>
                            )}
                          {kitten.medical_tests &&
                            kitten.medical_tests.length > 0 &&
                            onOpenMedicalTests &&
                            catsTranslations && (
                              <Button
                                fullWidth
                                px={16}
                                color="#47a3ee"
                                variant="outline"
                                size="xs"
                                mt={4}
                                onClick={() =>
                                  onOpenMedicalTests(
                                    kitten.medical_tests!,
                                    kitten.name
                                  )
                                }
                              >
                                {catsTranslations.medicalTests?.heading ||
                                  "Medical Tests"}
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
                            {t.commonLabels?.pedigree || "Pedigree"}
                          </Button>
                          {kitten.status !== "sold" &&
                            !kitten.is_own_breeding_cat && (
                              <Button
                                component={
                                  kitten.status !== "reserved" &&
                                  kitten.status !==
                                    "under_breeding_evaluation" &&
                                  kitten.status !== "preliminarily_reserved"
                                    ? Link
                                    : undefined
                                }
                                href={`#form`}
                                color={
                                  kitten.status === "reserved"
                                    ? "orange"
                                    : kitten.status ===
                                      "under_breeding_evaluation"
                                    ? "yellow"
                                    : kitten.status === "preliminarily_reserved"
                                    ? "cyan"
                                    : kitten.status === "sold"
                                    ? "red"
                                    : "green"
                                }
                                variant={
                                  kitten.status === "reserved" ||
                                  kitten.status ===
                                    "under_breeding_evaluation" ||
                                  kitten.status === "preliminarily_reserved"
                                    ? "light"
                                    : kitten.status === "sold"
                                    ? "light"
                                    : "filled"
                                }
                                size="xs"
                                fullWidth
                              >
                                {kitten.status === "reserved"
                                  ? t.commonLabels?.reserved || "Reserved"
                                  : kitten.status ===
                                    "under_breeding_evaluation"
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
                  );
                })}
              </Grid>
            </Stack>
          )}

        {litter.details && (
          <Stack w="100%" gap={8}>
            <Text>{litter.details}</Text>
          </Stack>
        )}

        {showPedigreeButton && litter.pedigree_link && (
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

        {showLittersPageButton && (
          <Link
            prefetch={false}
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
              {t.contact?.button ||
                (locale === "cs"
                  ? "Zobrazit více"
                  : locale === "de"
                  ? "Mehr anzeigen"
                  : "View More")}
            </Button>
          </Link>
        )}

        {showParentsAccordion && (
          <Accordion
            variant="contained"
            radius="md"
            w="100%"
            defaultValue={defaultParentsOpen ? "parent" : undefined}
          >
            <Accordion.Item value="parent">
              <Accordion.Control>
                <Title order={3} size="h3">
                  {t.commonLabels?.parents || "Parents"}
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
                      onClick={() => onOpenGallery(litter.father.images)}
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
                            alt={generateCatAltText(
                              {
                                name: litter.father.name,
                                gender: "male",
                                ...getLocalizedColorVariety(
                                  litter.father,
                                  locale as string
                                ),
                                role: "breeding_male",
                              },
                              locale as string
                            )}
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
                      onClick={() => onOpenGallery(litter.mother.images)}
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
                            alt={generateCatAltText(
                              {
                                name: litter.mother.name,
                                gender: "female",
                                ...getLocalizedColorVariety(
                                  litter.mother,
                                  locale as string
                                ),
                                role: "breeding_female",
                              },
                              locale as string
                            )}
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
        )}
      </Stack>
    </Card>
  );
}
