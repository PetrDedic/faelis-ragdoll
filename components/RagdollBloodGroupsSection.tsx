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
  Image,
  Alert,
  List,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/bloodgroups.json";
import enTranslations from "../locales/en/bloodgroups.json";
import deTranslations from "../locales/de/bloodgroups.json";

interface BloodGroupCombination {
  combination: string;
  result: string;
  warning: boolean;
  description: string;
}

export function RagdollBloodGroupsSection() {
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

  // Blood group combinations and their results
  const bloodGroupCombinations: BloodGroupCombination[] = t.combinations;

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        {t.section.title}
      </Title>

      <Text size="lg" c="black">
        {t.section.intro}
      </Text>

      <Alert
        icon={<IconAlertCircle size={16} />}
        title={t.alert.title}
        color="red"
        radius="md"
      >
        {t.alert.content}
      </Alert>

      <Accordion variant="separated" radius="md" w="100%">
        <Accordion.Item value="testing">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.testing.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>{t.accordion.testing.intro}</Text>

              <Box>
                <Text fw={700} mb={8}>
                  {t.accordion.testing.serology.title}
                </Text>
                <Text>{t.accordion.testing.serology.content}</Text>
              </Box>

              <Box>
                <Text fw={700} mb={8}>
                  {t.accordion.testing.genetic.title}
                </Text>
                <Text>{t.accordion.testing.genetic.content}</Text>
                <Text mt={8} c="dimmed">
                  {t.accordion.testing.genetic.note}
                </Text>
              </Box>

              <Box>
                <Text fw={700} mb={8}>
                  {t.accordion.testing.kittenTesting.title}
                </Text>
                <Text>{t.accordion.testing.kittenTesting.content}</Text>
                <List mt={8} spacing="xs">
                  <List.Item>
                    <Anchor href="http://www.alvediavet.com/" target="_blank">
                      {t.accordion.testing.kittenTesting.link1}
                    </Anchor>{" "}
                    {t.accordion.testing.kittenTesting.link1_desc}
                  </List.Item>
                  <List.Item>
                    <Anchor href="http://www.rapidvet.com/" target="_blank">
                      {t.accordion.testing.kittenTesting.link2}
                    </Anchor>{" "}
                    {t.accordion.testing.kittenTesting.link2_desc}
                  </List.Item>
                </List>
              </Box>

              <Text mt={8}>
                {t.accordion.testing.research}{" "}
                <Anchor
                  href="http://www.vgl.ucdavis.edu/services/cat/ragdoll.php"
                  target="_blank"
                >
                  {t.accordion.testing.researchLink}
                </Anchor>
                {t.accordion.testing.researchDesc}
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="bloodgroups">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.bloodgroups.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>{t.accordion.bloodgroups.intro}</Text>

              <Box>
                <Text fw={700} mb={8}>
                  {t.accordion.bloodgroups.legend.title}
                </Text>
                <Text size="sm">{t.accordion.bloodgroups.legend.schema}</Text>
                <List mt={8} spacing="xs" size="sm">
                  <List.Item>{t.accordion.bloodgroups.legend.aa}</List.Item>
                  <List.Item>{t.accordion.bloodgroups.legend.ab}</List.Item>
                  <List.Item>{t.accordion.bloodgroups.legend.b}</List.Item>
                </List>
              </Box>

              <Table.ScrollContainer minWidth={1024}>
                <Table striped highlightOnHover mt={16}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        {t.accordion.bloodgroups.table.header1}
                      </Table.Th>
                      <Table.Th>
                        {t.accordion.bloodgroups.table.header2}
                      </Table.Th>
                      <Table.Th w={64}>
                        {t.accordion.bloodgroups.table.header3}
                      </Table.Th>
                      <Table.Th>
                        {t.accordion.bloodgroups.table.header4}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bloodGroupCombinations.map((combo, index) => (
                      <Table.Tr key={index}>
                        <Table.Td fw={500}>{combo.combination}</Table.Td>
                        <Table.Td>{combo.result}</Table.Td>
                        <Table.Td>
                          {combo.warning ? (
                            <ThemeIcon color="red" size="sm">
                              <IconCircleX size={16} />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="green" size="sm">
                              <IconCircleCheck size={16} />
                            </ThemeIcon>
                          )}
                        </Table.Td>
                        <Table.Td>{combo.description}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              <Anchor
                href="http://www.rfwclub.org/fblood.htm"
                target="_blank"
                mt={8}
              >
                {t.accordion.bloodgroups.detailedTable}
              </Anchor>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="fni">
          <Accordion.Control>
            <Title order={3} size="h3">
              {t.accordion.fni.title}
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>{t.accordion.fni.intro}</Text>

              <Alert
                icon={<IconAlertCircle size={16} />}
                color="orange"
                radius="md"
              >
                <Text fw={700}>{t.accordion.fni.alert.title}</Text>
                <Text mt={8}>{t.accordion.fni.alert.content}</Text>
              </Alert>

              <Text>{t.accordion.fni.symptoms}</Text>

              <Box
                py={16}
                px={24}
                bg="rgba(71, 163, 238, 0.1)"
                style={{ borderRadius: "8px" }}
              >
                <Text fw={700} size="lg" mb={16}>
                  {t.accordion.fni.solution.title}
                </Text>
                <Text>{t.accordion.fni.solution.part1}</Text>
                <Text mt={8}>{t.accordion.fni.solution.part2}</Text>
              </Box>

              <Text size="sm" c="dimmed" mt={16}>
                {t.accordion.fni.note}
              </Text>

              <Text size="sm" c="dimmed" ta="right" mt={8}>
                {t.accordion.fni.author}
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export default RagdollBloodGroupsSection;
