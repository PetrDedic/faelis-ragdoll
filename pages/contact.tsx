import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { getHeroImage } from "../utils/heroImagesServer";
import { GetStaticProps } from "next";
import { LeftImageSection } from "../components/LeftImageSection";
import Link from "next/link";

// Import translations
import csTranslations from "../locales/cs/contact.json";
import enTranslations from "../locales/en/contact.json";
import deTranslations from "../locales/de/contact.json";
import {
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
} from "@tabler/icons-react";

interface ContactPageProps {
  heroImage: string | null;
}

export default function ContactPage({ heroImage }: ContactPageProps) {
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
            image="/img/efikaja.jpg"
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

        <Group>
          <Link
            href="https://www.facebook.com/FaelisRagdolls/"
            target="_blank"
            style={{
              fontFamily: "'lucida grande',tahoma,verdana,arial,sans-serif",
              textDecoration: "none",
              marginTop: 32,
            }}
          >
            <UnstyledButton
              w={64}
              h={64}
              bg="#47a3ee"
              style={{
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconBrandFacebookFilled size={42} color="#fff" />
            </UnstyledButton>
          </Link>
          <Link
            href="https://www.instagram.com/martafaelis/"
            target="_blank"
            style={{
              fontFamily: "'lucida grande',tahoma,verdana,arial,sans-serif",
              textDecoration: "none",
              marginTop: 32,
            }}
          >
            <UnstyledButton
              w={64}
              h={64}
              bg="#47a3ee"
              style={{
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconBrandInstagramFilled size={42} color="#fff" />
            </UnstyledButton>
          </Link>
        </Group>

        <Stack w="100%" align="center" gap={16}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            {t.section2.title}
          </Title>
          <Text fz={20} ta="center">
            {t.section2.address}
          </Text>
          <AspectRatio ratio={21 / 9} w="100%">
            <iframe
              width="100%"
              height="100%"
              style={{ borderRadius: 32 }}
              frameBorder="0"
              src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Nad%20N%C3%A1dr%C5%BE%C3%AD%20433/16%20%7C%20103%2000%20Praha%2010+(Faelis)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              allowFullScreen
            />
          </AspectRatio>
        </Stack>
      </Stack>
    </Stack>
  );
}

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  try {
    const heroImage = await getHeroImage("contact");

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
