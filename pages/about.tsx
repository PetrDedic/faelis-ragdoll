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
import AboutPageSEO from "../components/SEO/AboutPageSEO";

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
    <>
      <AboutPageSEO />
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
                  alt={
                    locale === "cs"
                      ? "Profesionální prostředí chovatelské stanice Faelis, specializace na plemeno Ragdoll"
                      : locale === "de"
                      ? "Professionelle Umgebung der Faelis Katzenzucht, spezialisiert auf Ragdoll"
                      : "Professional environment of Faelis cattery, specialized in Ragdoll breed"
                  }
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
                  alt={
                    locale === "cs"
                      ? "Útulné a bezpečné prostory pro kočky Ragdoll v chovatelské stanici Faelis Praha"
                      : locale === "de"
                      ? "Gemütliche und sichere Räume für Ragdoll Katzen in der Faelis Katzenzucht Prag"
                      : "Cozy and safe spaces for Ragdoll cats at Faelis cattery Prague"
                  }
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
                  alt={
                    locale === "cs"
                      ? "Bezpečný balkon pro kočky Ragdoll s ochrannou sítí, chovatelská stanice Faelis"
                      : locale === "de"
                      ? "Sicherer Balkon für Ragdoll Katzen mit Schutznetz, Faelis Katzenzucht"
                      : "Safe balcony for Ragdoll cats with protective net, Faelis cattery"
                  }
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
                  alt={
                    locale === "cs"
                      ? "Čistý a prostorný pokoj pro kočky Ragdoll se škrabadly a hračkami, Faelis"
                      : locale === "de"
                      ? "Sauberes und geräumiges Zimmer für Ragdoll Katzen mit Kratzbäumen und Spielzeug, Faelis"
                      : "Clean and spacious room for Ragdoll cats with scratching posts and toys, Faelis"
                  }
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
                  alt={
                    locale === "cs"
                      ? "Společný obývací pokoj pro socializaci koček Ragdoll, chovatelská stanice Faelis"
                      : locale === "de"
                      ? "Gemeinsames Wohnzimmer zur Sozialisierung von Ragdoll Katzen, Faelis Katzenzucht"
                      : "Common living room for Ragdoll cat socialization, Faelis cattery"
                  }
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
                  alt={
                    locale === "cs"
                      ? "Komfortní odpočinkový prostor pro kočky Ragdoll s měkkými polštáři a pelíšky, Faelis"
                      : locale === "de"
                      ? "Komfortabler Ruhebereich für Ragdoll Katzen mit weichen Kissen und Betten, Faelis"
                      : "Comfortable resting area for Ragdoll cats with soft cushions and beds, Faelis"
                  }
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
              <Link href="/contact" locale={locale} prefetch={false}>
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
    </>
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
