import React from "react";
import {
  Stack,
  Title,
  Text,
  Divider,
  Table,
  Accordion,
  Box,
  Paper,
  Group,
  Badge,
} from "@mantine/core";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/genetics.json";
import enTranslations from "../locales/en/genetics.json";
import deTranslations from "../locales/de/genetics.json";

interface GeneticCombination {
  combination: string;
  result: string;
}

interface GeneticInfo {
  id: string;
  name: string;
  code: string;
  description: string;
}

export function RagdollGeneticsSection() {
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

  // Variety genetic information
  const varietyInfo: GeneticInfo[] = [
    {
      id: "colorpoint",
      name: t.varieties.colorpoint.name,
      code: "ss",
      description: t.varieties.colorpoint.description,
    },
    {
      id: "mitted",
      name: t.varieties.mitted.name,
      code: "S2s",
      description: t.varieties.mitted.description,
    },
    {
      id: "highmitted",
      name: t.varieties.highmitted.name,
      code: "S2S2",
      description: t.varieties.highmitted.description,
    },
    {
      id: "bicolor",
      name: t.varieties.bicolor.name,
      code: "S4s",
      description: t.varieties.bicolor.description,
    },
    {
      id: "midhighwhite",
      name: t.varieties.midhighwhite.name,
      code: "S4S2",
      description: t.varieties.midhighwhite.description,
    },
    {
      id: "highwhite",
      name: t.varieties.highwhite.name,
      code: "S4S4",
      description: t.varieties.highwhite.description,
    },
  ];

  // Color genetic information
  const colorInfo: GeneticInfo[] = [
    {
      id: "seal",
      name: t.colors.seal.name,
      code: "BBDD, BBDd, BbDD, BbDd",
      description: t.colors.seal.description,
    },
    {
      id: "blue",
      name: t.colors.blue.name,
      code: "BBdd, Bbdd",
      description: t.colors.blue.description,
    },
    {
      id: "chocolate",
      name: t.colors.chocolate.name,
      code: "bbDD, bbDd",
      description: t.colors.chocolate.description,
    },
    {
      id: "lilac",
      name: t.colors.lilac.name,
      code: "bbdd",
      description: t.colors.lilac.description,
    },
  ];

  // Variety combinations
  const varietyCombinations: GeneticCombination[] = t.combinations;

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        {t.section.title}
      </Title>
      <Text size="lg" c="black">
        {t.section.intro1}
      </Text>
      <Text size="lg" c="black">
        {t.section.intro2}
      </Text>

      <Accordion variant="separated" radius="md" w="100%">
        <Accordion.Item value="varieties">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.varieties.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Paper withBorder p="md" radius="md">
                {varietyInfo.map((variety) => (
                  <Box key={variety.id} mb="md">
                    <Group mb={8}>
                      <Badge color="blue" size="lg">
                        {variety.name}
                      </Badge>
                      <Text fw={700} size="sm">
                        {variety.code}
                      </Text>
                    </Group>
                    <Text size="sm">{variety.description}</Text>
                    <Divider my="xs" />
                  </Box>
                ))}
              </Paper>

              <Text size="sm">
                {t.accordion.varieties.link_text}{" "}
                <Text
                  component="a"
                  href="http://rfwclub.org/Gwsf.htm"
                  target="_blank"
                  c="blue"
                >
                  {t.accordion.varieties.link_label}
                </Text>
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="combinations">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.combinations.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t.accordion.combinations.table_header1}</Table.Th>
                  <Table.Th>{t.accordion.combinations.table_header2}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {varietyCombinations.map((combo, index) => (
                  <Table.Tr key={index}>
                    <Table.Td fw={500}>{combo.combination}</Table.Td>
                    <Table.Td>{combo.result}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="colors">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.colors.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>{t.accordion.colors.intro}</Text>
              <Box px="md">
                <Text>{t.accordion.colors.bullet1}</Text>
                <Text>{t.accordion.colors.bullet2}</Text>
                <Text>{t.accordion.colors.bullet3}</Text>
                <Text>{t.accordion.colors.bullet4}</Text>
              </Box>

              <Title order={4} size="h4" mt="md">
                {t.accordion.colors.basic_colors}
              </Title>

              <Paper withBorder p="md" radius="md">
                {colorInfo.map((color) => (
                  <Box key={color.id} mb="md">
                    <Group mb={8}>
                      <Badge color="blue" size="lg">
                        {color.name}
                      </Badge>
                      <Text fw={700} size="sm">
                        {color.code}
                      </Text>
                    </Group>
                    <Text size="sm">{color.description}</Text>
                    <Divider my="xs" />
                  </Box>
                ))}
              </Paper>

              <Text size="sm">
                {t.accordion.colors.link_text}{" "}
                <Text
                  component="a"
                  href="http://rfwclub.org/Gcolor.htm"
                  target="_blank"
                  c="blue"
                >
                  {t.accordion.colors.link_label}
                </Text>
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export default RagdollGeneticsSection;
