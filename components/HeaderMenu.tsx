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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const links = [
  { link: "/", label: "Domů" },
  {
    link: "/cats",
    label: "Naše Kočky",
  },
  { link: "/litters", label: "Plánované vrhy" },
  { link: "/ragdoll", label: "O Ragdollu" },
  { link: "/gallery", label: "Galerie" },
  { link: "/about", label: "O nás" },
  { link: "/contact", label: "Kontakty" },
];

// Add language configuration
const languages = [
  { code: "cs", label: "Čeština", flag: "🇨🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const languageItems = languages.map((language) => (
    <Menu.Item
      key={language.code}
      onClick={() => setCurrentLanguage(language)}
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
            <Button
              component="a"
              href={link.link}
              variant="subtle"
              size="sm"
              px="xs"
              radius="sm"
            >
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
      <Button
        key={link.label}
        component="a"
        href={link.link}
        variant="subtle"
        size="sm"
        px="xs"
        radius="sm"
      >
        {link.label}
      </Button>
    );
  });

  return (
    <Paper component="nav" shadow="sm" py="xs">
      <Container size="md">
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Image
              src="/images/Logo_v2.svg"
              height={28}
              width={100}
              alt="Faelis logo"
              style={{ paddingBottom: 4 }}
            />
          </Link>
          <Group gap={5} visibleFrom="sm">
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
              hiddenFrom="sm"
            />
          </Flex>
        </Flex>
      </Container>
    </Paper>
  );
}
