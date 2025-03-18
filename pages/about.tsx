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
import { LeftImageSection } from "../components/LeftImageSection";
import Link from "next/link";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";

// Import translations
import csTranslations from "../locales/cs/about.json";
import enTranslations from "../locales/en/about.json";
import deTranslations from "../locales/de/about.json";

export default function AboutPage() {
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
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        backgroundImage="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/017.webp"
        backgroundPosition="center 75%"
        heading={t.hero.heading}
        subtext={t.hero.subtext}
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
            {t.section1.title}
          </Title>
          <Text size="lg" c="black" ta="center" maw={960}>
            {t.section1.paragraph1}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <AspectRatio ratio={16 / 9}>
              <Image
                radius="lg"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/P8050026.webp"
                alt="Faelis cattery"
              />
            </AspectRatio>
            <AspectRatio ratio={16 / 9}>
              <Image
                radius="lg"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/IMG_0043.webp"
                alt="Faelis cattery"
              />
            </AspectRatio>
          </SimpleGrid>
          <Text size="lg" c="black" ta="center" maw={960}>
            {t.section1.paragraph2}
          </Text>
        </Stack>

        <FullscreenBackroundSection>
          <Stack align="center" w="100%" maw={720} py={32}>
            <Title order={2} size="h1" c="dark" ta="center">
              {t.contact.heading}
            </Title>
            <Text size="lg" c="black" ta="center">
              {t.contact.subtext}
            </Text>
            <Link href="/contact" locale={locale}>
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

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.section2.title}
          </Title>
          <Stack w="100%" align="center" gap={8}>
            <Text size="lg" c="black" ta="center">
              {t.section2.intro}
            </Text>
            <Text size="lg" c="black" ta="center">
              {t.section2.countries}
            </Text>
          </Stack>
          <Text size="lg" c="black" ta="center">
            {t.section2.paragraph}
          </Text>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}
