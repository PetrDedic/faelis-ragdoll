import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  Card,
  Center,
  Loader,
  Group,
} from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

// Import translations
import csTranslations from "../locales/cs/404.json";
import enTranslations from "../locales/en/404.json";
import deTranslations from "../locales/de/404.json";

export default function Custom404() {
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

  useEffect(() => {
    // Automatically redirect to homepage after 2 seconds
    const timer = setTimeout(() => {
      router.push("/", "/", { locale });
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [router, locale]);

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.metaDescription} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Container size="sm" py={80}>
        <Center>
          <Card
            shadow="lg"
            radius="lg"
            p="xl"
            w="100%"
            maw={500}
            style={{
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              border: "1px solid #e9ecef",
            }}
          >
            <Stack align="center" gap="xl">
              {/* 404 Number */}
              <Title
                order={1}
                size="8rem"
                fw={900}
                c="#47a3ee"
                style={{
                  fontFamily: "Paytone One, sans-serif",
                  lineHeight: 1,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {t.heading}
              </Title>

              {/* Subheading */}
              <Title
                order={2}
                size="h2"
                fw={600}
                c="dark"
                ta="center"
                style={{ fontFamily: "Paytone One, sans-serif" }}
              >
                {t.subheading}
              </Title>

              {/* Description */}
              <Text size="lg" c="dimmed" ta="center" maw={400}>
                {t.description}
              </Text>

              {/* Loading indicator */}
              <Stack align="center" gap="md">
                <Loader size="md" color="#47a3ee" />
                <Text size="sm" c="dimmed" ta="center">
                  {t.redirecting}
                </Text>
              </Stack>

              {/* Manual redirect button */}
              <Button
                leftSection={<IconHome size={18} />}
                onClick={() => router.push("/", "/", { locale })}
                color="#47a3ee"
                size="lg"
                radius="md"
                fw={500}
                px="xl"
                style={{
                  background: "#47a3ee",
                  "&:hover": {
                    background: "#3b8bd1",
                  },
                }}
              >
                {t.button}
              </Button>
            </Stack>
          </Card>
        </Center>
      </Container>
    </>
  );
}
