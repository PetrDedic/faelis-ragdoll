import {
  AspectRatio,
  Button,
  Card,
  Divider,
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
import { CatInfo } from "../components/CatInfo";
import { LeftImageSection } from "../components/LeftImageSection";
import RagdollColorsCarousel from "../components/RagdollColorsCarousel";
import RagdollVarietiesSection from "../components/RagdollVarietiesSection";
import RagdollGeneticsSection from "../components/RagdollGeneticsSection";
import RagdollBloodGroupsSection from "../components/RagdollBloodGroupsSection";
import Link from "next/link";

// Import translations
import csTranslations from "../locales/cs/ragdoll.json";
import enTranslations from "../locales/en/ragdoll.json";
import deTranslations from "../locales/de/ragdoll.json";
import RagdollHistorySection from "../components/RagdollHistorySection";

const images = {
  top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  middle:
    "https://images.unsplash.com/photo-1643431784519-6a3e9b1cfd51?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  right:
    "https://images.unsplash.com/photo-1629068136524-f467f8efa109?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function RagdollPage() {
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
        heading={t.hero.heading}
        subtext={t.hero.subtext}
        backgroundImage="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/P1040182.webp"
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
            {t.about.title}
          </Title>
          <Text size="lg" c="black">
            {t.about.paragraph1}
          </Text>
          <Grid w="100%" gutter={32}>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
          </Grid>
          <Text size="lg" c="black">
            {t.about.paragraph2}
          </Text>
          <Text size="lg" c="black">
            {t.about.paragraph3}
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
        <Stack w="100%" align="center" gap={32}>
          <Text size="lg" c="black">
            {t.about.paragraph4}
          </Text>
          <LeftImageSection
            image="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/075_n.jpg"
            ratio={4 / 3}
            heading={t.standard.heading}
            subtext={t.standard.subtext}
            button={{
              label: t.standard.button,
              onClick: () =>
                window.open("https://fifeweb.org/app/uploads/2023/10/RAG.pdf"),
            }}
          />
        </Stack>

        <Divider w="100%" />

        <RagdollHistorySection />

        <Divider w="100%" />

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.colors.title}
          </Title>
          <Text size="lg" c="black">
            {t.colors.paragraph1}
          </Text>
          <Text size="xs" c="dimmed">
            {t.colors.copyright}
          </Text>
          <RagdollColorsCarousel />
          <Text size="lg" c="black">
            {t.colors.paragraph2}
          </Text>
          <Text size="lg" c="black">
            {t.colors.paragraph3}
          </Text>
          <Text size="lg" c="black" fw={900} ta="center">
            {t.colors.hcm_pkd}
          </Text>
          <Text size="lg" c="black">
            {t.colors.paragraph4}
          </Text>
          <Text size="lg" c="black">
            {t.colors.paragraph5}
          </Text>
        </Stack>

        <Divider w="100%" />

        <RagdollVarietiesSection />

        <Divider w="100%" />

        <RagdollGeneticsSection />

        <Divider w="100%" />

        <RagdollBloodGroupsSection />

        <Divider w="100%" />

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.health.title}
          </Title>
          <Text size="lg" c="black">
            {t.health.paragraph1}
          </Text>
          <Text size="lg" c="black">
            {t.health.paragraph2}{" "}
            <Text
              component="a"
              href="https://www.metropolevet.cz/nemoci-kocek/"
              target="_blank"
              c="blue"
            >
              {t.health.cat_diseases_link}
            </Text>
          </Text>
          <Text size="lg" c="black">
            {t.health.paragraph3}
          </Text>
          <Text size="lg" c="black">
            {t.health.paragraph4}
            <br />
            <Text
              component="a"
              href="https://cz.mypet.com/zdravi/navstevy-veterinare/veterinarni-lekar/?imgtcs=true"
              target="_blank"
              c="blue"
            >
              {t.health.cat_care_link}
            </Text>
          </Text>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}
