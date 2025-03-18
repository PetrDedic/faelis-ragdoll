import {
  AspectRatio,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
  Box,
  Center,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/footer.json";
import enTranslations from "../locales/en/footer.json";
import deTranslations from "../locales/de/footer.json";
import { IconBrandFacebookFilled } from "@tabler/icons-react";

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
          <Stack w="100%" align="start" justify="end">
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
              <Link
                href="http://cs-cz.facebook.com/MartaVrabelova"
                target="_blank"
                style={{
                  fontFamily: "'lucida grande',tahoma,verdana,arial,sans-serif",
                  textDecoration: "none",
                  marginTop: 32,
                }}
              >
                <Image
                  src="/images/Facebook.svg"
                  alt="Facebook"
                  width={64}
                  height={64}
                />
              </Link>
            </Stack>
          </Stack>
        </Flex>
      </Card>

      {/* Associations and Social Media Links Section */}
      <Center py={24} bg="#f5f5f5">
        <Stack align="center" gap={16}>
          <Flex gap={16} justify="center" align="center">
            <Link href="http://www.fifeweb.org/" target="_blank" title="FIFE">
              <Image
                src="/images/fife_logo.jpg"
                alt="FIFE"
                width={100}
                height={100}
              />
            </Link>
            <Link href="http://www.schk.cz/" target="_blank" title="SCHK">
              <Image
                src="/images/schk_logo.gif"
                alt="SCHK"
                width={100}
                height={100}
              />
            </Link>
          </Flex>

          <Flex direction="column" align="center"></Flex>
        </Stack>
      </Center>

      <Stack align="center" justify="center" p={16} gap={8}>
        <Text>{t.copyright.rights}</Text>
        <Text>{t.copyright.design}</Text>
      </Stack>
    </Stack>
  );
};

export default Footer;
