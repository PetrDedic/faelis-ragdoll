import { IconChevronDown } from "@tabler/icons-react";
import {
  Burger,
  Center,
  Container,
  Flex,
  Group,
  Menu,
  Button,
  Paper,
  rem,
  UnstyledButton,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/navigation.json";
import enTranslations from "../locales/en/navigation.json";
import deTranslations from "../locales/de/navigation.json";

// Define links structure for navigation
const linkStructure = [
  { link: "/", key: "home" },
  { link: "/cats", key: "cats" },
  { link: "/litters", key: "litters" },
  { link: "/ragdoll", key: "ragdoll" },
  { link: "/gallery", key: "gallery" },
  { link: "/about", key: "about" },
  { link: "/contact", key: "contact" },
];

interface Language {
  code: string;
  label: string;
  flag: string;
}

const languages: Language[] = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  // Build links array with translated labels
  const links = linkStructure.map((item) => ({
    link: item.link,
    label: t.links[item.key as keyof typeof t.links],
  }));

  // Initialize current language based on router locale
  const getCurrentLanguage = () => {
    const currentLocale = router.locale || "cs";
    return (
      languages.find((lang) => lang.code === currentLocale) || languages[0]
    );
  };

  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  // Update the current language when the locale changes
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, [locale]);

  // Change language handler
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    router.push({ pathname, query }, asPath, { locale: language.code });
  };

  // Update language items to use the changeLanguage function
  const languageItems = languages.map((language) => (
    <Menu.Item
      key={language.code}
      onClick={() => changeLanguage(language)}
      leftSection={<span style={{ fontSize: rem(16) }}>{language.flag}</span>}
    >
      {language.label}
    </Menu.Item>
  ));

  const items = links.map((link) => {
    //@ts-expect-error
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Button variant="subtle" size="sm" px="xs" radius="sm">
              <Center>
                <span style={{ marginRight: 5 }}>{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link href={link.link} key={link.label} locale={locale}>
        <Button variant="subtle" size="sm" px="xs" radius="sm">
          {link.label}
        </Button>
      </Link>
    );
  });

  return (
    <Paper
      component="nav"
      shadow="sm"
      py="xs"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        backgroundColor: "white",
      }}
      radius={0}
    >
      <Container size="md">
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Image
              src="/images/Logo_v2.svg"
              height={28}
              width={100}
              alt="Faelis logo"
            />
          </Link>
          <Group gap={5} visibleFrom="md">
            {items}
          </Group>
          <Flex align="center" gap={16}>
            <Menu width={200} position="bottom-end" withArrow>
              <Menu.Target>
                <UnstyledButton>
                  <Flex align="center" gap={4}>
                    <span style={{ fontSize: rem(16) }}>
                      {currentLanguage.flag}
                    </span>
                    <IconChevronDown size={14} stroke={1.5} />
                  </Flex>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>{languageItems}</Menu.Dropdown>
            </Menu>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="md"
            />
          </Flex>
        </Flex>

        <Drawer
          opened={opened}
          onClose={toggle}
          shadow="md"
          hiddenFrom="md"
          size="100%"
        >
          <Flex direction="column" gap="sm">
            {links.map((link) => (
              <Link href={link.link} key={link.label} locale={locale}>
                <Button variant="subtle" fullWidth onClick={() => toggle()}>
                  {link.label}
                </Button>
              </Link>
            ))}
          </Flex>
        </Drawer>
      </Container>
    </Paper>
  );
}
