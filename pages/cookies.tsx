import { Container, Title, Text, Space } from "@mantine/core";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/cookies.json";
import enTranslations from "../locales/en/cookies.json";
import deTranslations from "../locales/de/cookies.json";

export default function CookiePolicyPage() {
  const router = useRouter();
  const { locale } = router;

  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  return (
    <Container py="xl">
      <Title order={1}>{t.title}</Title>
      <Text c="dimmed" size="sm">
        {t.lastUpdated}
      </Text>

      <Space h="xl" />

      <Text>{t.introduction}</Text>

      <Space h="lg" />

      <Title order={2}>{t.whatAreCookies.title}</Title>
      <Text>{t.whatAreCookies.text}</Text>

      <Space h="lg" />

      <Title order={2}>{t.whyWeUseCookies.title}</Title>
      <Text>{t.whyWeUseCookies.text}</Text>

      <Space h="lg" />

      <Title order={2}>{t.howToControl.title}</Title>
      <Text>{t.howToControl.text}</Text>

      <Space h="lg" />

      <Title order={2}>{t.changes.title}</Title>
      <Text>{t.changes.text}</Text>

      <Space h="lg" />

      <Title order={2}>{t.contact.title}</Title>
      <Text>{t.contact.text}</Text>
    </Container>
  );
}
