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
import { useRouter } from "next/router";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";

// Import translations
import csTranslations from "../locales/cs/index.json";
import enTranslations from "../locales/en/index.json";
import deTranslations from "../locales/de/index.json";
import HomePageSEO from "../components/SEO/HomePageSEO";

const images = {
  top: "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Lily/Lily.webp",
  middle:
    "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/76_n.webp",
  right:
    "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/George/George.webp",
};

export default function IndexPage() {
  const router = useRouter();
  const { locale } = router;

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  return (
    <>
      <HomePageSEO />
      <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
        <HeroImageBackground
          heading={t.hero.heading}
          subtext={t.hero.subtext}
        />
        <Stack
          px={32}
          justify="center"
          align="center"
          gap={64}
          maw={1280}
          mx="auto"
          w="100%"
        >
          <Flex style={{ position: "relative", top: -72, zIndex: 2 }}>
            <FeaturesCards
              cards={[
                {
                  icon: "/images/Domek_Tlapka.svg",
                  text: t.features.card1,
                },
                {
                  icon: "/images/Srdce.svg",
                  text: t.features.card2,
                },
                {
                  icon: "/images/Kalendar.svg",
                  text: t.features.card3,
                },
              ]}
            />
          </Flex>
          <Flex mih={320}>
            <LeadGrid
              images={images}
              heading={t.about.heading}
              subtext={t.about.subtext}
              button={{
                label: t.about.button,
                onClick: () => console.log("Button clicked"),
              }}
            />
          </Flex>

          <Stack gap={0}>
            <FullscreenBackroundSection>
              <Stack align="center" w="100%" maw={960}>
                <Title order={2} size="h1" c="#47a3ee">
                  {t.cats.heading}
                </Title>
                <Text size="lg" c="black">
                  {t.cats.subtext}
                </Text>
                <Grid w="100%" gutter={32}>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card padding="lg" radius="lg" bg="#d6e6f3">
                      <AspectRatio ratio={3 / 4}>
                        <Image
                          radius="md"
                          src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Juliet/Juliet.webp"
                          alt="Julinka"
                        />
                      </AspectRatio>
                      <Title order={2} size="h2" c="dark" mt={16} ta="center">
                        {t.cats.categories.cats}
                      </Title>
                      <Text c="dimmed" ta="center">
                        {t.cats.categories.more}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card padding="lg" radius="lg" bg="#d6e6f3">
                      <AspectRatio ratio={3 / 4}>
                        <Image
                          radius="md"
                          src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/George/George3.webp"
                          alt="George"
                        />
                      </AspectRatio>
                      <Title order={2} size="h2" c="dark" mt={16} ta="center">
                        {t.cats.categories.maleCats}
                      </Title>
                      <Text c="dimmed" ta="center">
                        {t.cats.categories.more}
                      </Text>
                    </Card>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card padding="lg" radius="lg" bg="#d6e6f3">
                      <AspectRatio ratio={3 / 4}>
                        <Image
                          radius="md"
                          src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Ori.webp"
                          alt="Ori"
                        />
                      </AspectRatio>
                      <Title order={2} size="h2" c="dark" mt={16} ta="center">
                        {t.cats.categories.kittens}
                      </Title>
                      <Text c="dimmed" ta="center">
                        {t.cats.categories.more}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
              </Stack>
            </FullscreenBackroundSection>
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
                <Button
                  color="#47a3ee"
                  size="compact-lg"
                  fw={400}
                  px={24}
                  w={{ base: "100%", sm: "fit-content" }}
                >
                  {t.facts.button}
                </Button>
              </Stack>
            </FullscreenBackroundSection>
          </Stack>

          <Stack align="center" w="100%" gap={32}>
            <Title order={2} size="h1" c="#47a3ee">
              {t.reviews.heading}
            </Title>
            <Text size="lg" c="black">
              {t.reviews.subtext}
            </Text>
            <Grid w="100%" gutter={32}>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                  <Stack gap={16}>
                    <Stack gap={0}>
                      <Text fw={700} fz={24} c="#47a3ee">
                        Tomáš Šesták
                      </Text>
                      <Text fw={700} fz={12} c="black">
                        Juliet Ms.Faelis
                      </Text>
                    </Stack>
                    <Text fw={700} c="dark">
                      {t.reviews.reviewText}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                  <Stack gap={16}>
                    <Stack gap={0}>
                      <Text fw={700} fz={24} c="#47a3ee">
                        Tomáš Šesták
                      </Text>
                      <Text fw={700} fz={12} c="black">
                        Juliet Ms.Faelis
                      </Text>
                    </Stack>
                    <Text fw={700} c="dark">
                      {t.reviews.reviewText}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                  <Stack gap={16}>
                    <Stack gap={0}>
                      <Text fw={700} fz={24} c="#47a3ee">
                        Tomáš Šesták
                      </Text>
                      <Text fw={700} fz={12} c="black">
                        Juliet Ms.Faelis
                      </Text>
                    </Stack>
                    <Text fw={700} c="dark">
                      {t.reviews.reviewText}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
          <FullscreenBackroundSection>
            <Stack align="center" w="100%" maw={720} py={32}>
              <Title order={2} size="h1" c="dark" ta="center">
                {t.contact.heading}
              </Title>
              <Text size="lg" c="black" ta="center">
                {t.contact.subtext}
              </Text>
              <Button
                color="#47a3ee"
                size="compact-lg"
                fw={400}
                px={24}
                w={{ base: "100%", sm: "fit-content" }}
              >
                {t.contact.button}
              </Button>
            </Stack>
          </FullscreenBackroundSection>

          <Form />
        </Stack>
      </Stack>
    </>
  );
}
