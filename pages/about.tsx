import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { getHeroImage } from "../utils/heroImagesServer";
import { GetStaticProps } from "next";
import { LeftImageSection } from "../components/LeftImageSection";
import Link from "next/link";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import Image from "next/image";

// Import translations
import csTranslations from "../locales/cs/about.json";
import enTranslations from "../locales/en/about.json";
import deTranslations from "../locales/de/about.json";

interface AboutPageProps {
  heroImage: string | null;
}

export default function AboutPage({ heroImage }: AboutPageProps) {
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
      <HeroImageBackgroundWithData
        backgroundImage={heroImage || undefined}
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
            <AspectRatio
              ratio={16 / 9}
              style={{ position: "relative", aspectRatio: "16/9" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/P8050026.webp"
                alt="Faelis cattery"
              />
            </AspectRatio>
            <AspectRatio
              ratio={16 / 9}
              style={{ position: "relative", aspectRatio: "16/9" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/IMG_0043.webp"
                alt="Faelis cattery"
              />
            </AspectRatio>
          </SimpleGrid>
          <Text size="lg" c="black" ta="center" maw={960}>
            {t.section1.paragraph2}
          </Text>
        </Stack>

        <Grid w="100%" gutter={32} maw={960} mx="auto">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <AspectRatio
              ratio={12 / 16}
              style={{ position: "relative", aspectRatio: "12/16" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                src="/images/balkon.jpg"
                alt="Balkon"
              />
            </AspectRatio>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <AspectRatio
              ratio={12 / 16}
              style={{ position: "relative", aspectRatio: "12/16" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                src="/images/pokoj.jpg"
                alt="Pokoj"
              />
            </AspectRatio>
          </Grid.Col>
        </Grid>

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.section3.title}
          </Title>
          <Stack w="100%" align="center" gap={8}>
            <Text size="lg" c="black" ta="center">
              {t.section3.paragraph1}
            </Text>
            <Text size="lg" c="black" ta="center">
              {t.section3.paragraph2}
            </Text>
            <Text size="lg" c="black" ta="center">
              {t.section3.paragraph3}
            </Text>
            <Text size="lg" c="black" ta="center">
              {t.section3.paragraph4}
            </Text>
          </Stack>
        </Stack>

        <Grid w="100%" gutter={32} maw={960} mx="auto">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <AspectRatio
              ratio={12 / 16}
              style={{ position: "relative", aspectRatio: "12/16" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                src="/images/obyvak1.jpg"
                alt="Obývák"
              />
            </AspectRatio>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <AspectRatio
              ratio={12 / 16}
              style={{ position: "relative", aspectRatio: "12/16" }}
              w="100%"
            >
              <Image
                fill
                style={{ objectFit: "cover", borderRadius: 16 }}
                src="/images/obyvak2.jpg"
                alt="Obývák 2"
              />
            </AspectRatio>
          </Grid.Col>
        </Grid>

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

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  try {
    const heroImage = await getHeroImage("about");

    return {
      props: {
        heroImage,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        heroImage: null,
      },
      revalidate: 60,
    };
  }
};
