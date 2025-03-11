import {
  AspectRatio,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/footer.json";
import enTranslations from "../locales/en/footer.json";
import deTranslations from "../locales/de/footer.json";

const Footer = () => {
  const smallWindow = useMediaQuery("(max-width: 1200px)");
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
    <Stack w="100%" gap={0} mt={64}>
      <Card
        radius={0}
        w="100%"
        px={32}
        py="5vh"
        style={{
          background: "#324554",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderTop: "8px solid #47a3ee",
          borderBottom: "8px solid #47a3ee",
          backgroundImage: `url("/images/Tlapky-bg-big.svg")`,
        }}
      >
        <Flex
          maw={1280}
          mx="auto"
          w="100%"
          gap={smallWindow ? 16 : 64}
          direction={smallWindow ? "column" : "row"}
        >
          <Stack w="100%">
            <Text c="white" fz={32} fw={700} ta="center">
              {t.location.title}
            </Text>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://frame.mapy.cz/s/lulolovofa"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ borderRadius: 16 }}
              />
            </AspectRatio>
          </Stack>
          <Stack w="100%" align="start" justify="center">
            <Title order={4} c="white" fz={32} style={{ letterSpacing: 1 }}>
              {t.cattery.title}
            </Title>
            <Stack gap={0} align="start" justify="start" c="white">
              <Text fw={700}>{t.contact.name}</Text>
              <Text>{t.contact.address1}</Text>
              <Text>{t.contact.address2}</Text>
            </Stack>
            <Divider w="75%" />
            <Stack gap={0} align="start" justify="start" c="white">
              <Text>
                {t.contact.email}{" "}
                <Text span fw={700} td="underlline">
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
              <Text>
                {t.contact.phone}{" "}
                <Text span fw={700} td="underlline">
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
              </Text>{" "}
              <Text>
                {t.contact.skype}{" "}
                <Text span fw={700} td="underline">
                  ragdoll.faelis
                </Text>
              </Text>
              <Text>
                {t.contact.moreContacts}{" "}
                <Text span fw={700} td="underlline">
                  <Link
                    href={locale === "cs" ? "/kontakt" : "/contact"}
                    style={{
                      color: "inherit",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.contact.here}
                  </Link>
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </Card>
      <Stack align="center" justify="center" p={16} gap={8}>
        <Text>{t.copyright.rights}</Text>
        <Text>{t.copyright.design}</Text>
      </Stack>
    </Stack>
  );
};

export default Footer;
