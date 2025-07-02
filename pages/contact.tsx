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

// Import translations
import csTranslations from "../locales/cs/contact.json";
import enTranslations from "../locales/en/contact.json";
import deTranslations from "../locales/de/contact.json";

export default function ContactPage() {
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
        backgroundImage="https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading={t.hero.heading}
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
          <LeftImageSection
            image="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            heading={t.section1.name}
            subtext={
              <Stack gap={0} align="start" justify="start">
                <Text>{t.section1.address1}</Text>
                <Text>{t.section1.address2}</Text>
                <br />
                <Text fz={20}>
                  {t.section1.phone}{" "}
                  <Text span fw={700} td="underlline" fz={20}>
                    <Link
                      href="tel:+420 602 278 682"
                      style={{
                        color: "inherit",
                        whiteSpace: "nowrap",
                      }}
                    >
                      +420 602 278 682
                    </Link>
                  </Text>
                </Text>
                <Text fz={20}>
                  {t.section1.email}{" "}
                  <Text span fw={700} td="underlline" fz={20}>
                    <Link
                      href="mailto:marta@ragdolls.cz"
                      style={{
                        color: "inherit",
                        whiteSpace: "nowrap",
                      }}
                    >
                      marta@ragdolls.cz
                    </Link>
                  </Text>
                </Text>
              </Stack>
            }
          />
        </Stack>

        <Stack w="100%" align="center" gap={16}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.section2.title}
          </Title>
          <Text fz={20} ta="center">
            {t.section2.address}
          </Text>
          <AspectRatio ratio={21 / 9} w="100%">
            <iframe
              src="https://frame.mapy.cz/s/lulolovofa"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ borderRadius: 16 }}
            />
          </AspectRatio>
        </Stack>
      </Stack>
    </Stack>
  );
}
