import { Button, Paper, Text, Group, Anchor } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Import translations
import csTranslations from "../locales/cs/cookie.json";
import enTranslations from "../locales/en/cookie.json";
import deTranslations from "../locales/de/cookie.json";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "false");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <Paper
      withBorder
      p="md"
      shadow="md"
      radius="lg"
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: "calc(100% - 40px)",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Group justify="space-between" gap="xl">
        <Text size="sm">
          {t.message}{" "}
          <Anchor component={Link} href="/cookies" fz="sm">
            {t.learnMore}
          </Anchor>
        </Text>
        <Group>
          <Button variant="outline" onClick={handleDecline}>
            {t.decline}
          </Button>
          <Button onClick={handleAccept}>{t.accept}</Button>
        </Group>
      </Group>
    </Paper>
  );
}
