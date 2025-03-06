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
  // Variety genetic information
  const varietyInfo: GeneticInfo[] = [
    {
      id: "colorpoint",
      name: "Colorpoint (cp)",
      code: "ss",
      description: "Bez bílé barvy",
    },
    {
      id: "mitted",
      name: "Mitted, Mitted with blase",
      code: "S2s",
      description:
        "Bílé ponožky a punčošky, bílá brada a břicho. Blase je tzv.plamínek bílé barvy uprostred nosu",
    },
    {
      id: "highmitted",
      name: "High Mitted (HM)",
      code: "S2S2",
      description:
        "Vzhledově bicolor, tedy bílé obrácené V v masce, bílé nohy a břicho od brady po koren ocasu, záda v barvě odznaků",
    },
    {
      id: "bicolor",
      name: "Bicolor",
      code: "S4s",
      description:
        "Tzv.bicolor true = pravý bicolor, vzhledově stejný jako High Mitted",
    },
    {
      id: "midhighwhite",
      name: "Bicolor Mid High White (MHW)",
      code: "S4S2",
      description: "Bicolor s vyšším podílem bílé barvy",
    },
    {
      id: "highwhite",
      name: "Bicolor High White (HW, Van)",
      code: "S4S4",
      description: "Bicolor s nejvyšším podílem bílé barvy",
    },
  ];

  // Color genetic information
  const colorInfo: GeneticInfo[] = [
    {
      id: "seal",
      name: "Seal (černá)",
      code: "BBDD, BBDd, BbDD, BbDd",
      description:
        "Genetické kódy sealové kočky Ragdoll jsou podle toho, zda je to Ragdoll sealový bez ředícího genu (BBDD), nebo je klasický seal s ředícím genem (BBDd), nebo seal s genem pro čokoládové zbarvení (BbDD - nosič čokolády), nebo seal s genem pro čokoládové zbarvení a s ředícím genem (BbDd - nosič čokolády a ředícího genu)",
    },
    {
      id: "blue",
      name: "Blue (modrá)",
      code: "BBdd, Bbdd",
      description:
        "Genetický kód blue kočky musí vždy mít dva ředící geny dd a k tomu buď dva sealové geny BB (geneticky kod je potom BBdd) a nebo může mít jeden gen sealový a druhý čokoládový Bb a kočka je potom nosič čokolády (genetický kód takové blue kočky je Bbdd)",
    },
    {
      id: "chocolate",
      name: "Chocolate (čokoládová)",
      code: "bbDD, bbDd",
      description:
        "Čokoládová kočka musí mít vždy dva čokoládové geny bb a k tomu může mít buď DD, což znamená, že nemá ředící gen (genetický kód takové kočky je bbDD), nebo může mít Dd a ředící gen má (genetický kód takové kočky je bbDd)",
    },
    {
      id: "lilac",
      name: "Lilac (lilová, Frost)",
      code: "bbdd",
      description:
        "Genetický kód lilové kočky je vždy bbdd a nijak jinak. Má tedy dva čokoládové geny a k nim ke každému jeden ředící gen",
    },
  ];

  // Variety combinations
  const varietyCombinations: GeneticCombination[] = [
    { combination: "Colorpoint × Colorpoint", result: "Colorpoint" },
    { combination: "Colorpoint × Mitted", result: "Colorpoint, Mitted" },
    { combination: "Colorpoint × Bicolor High Mitted", result: "Mitted" },
    {
      combination: "Colorpoint × Bicolor (true)",
      result: "Colorpoint, Bicolor",
    },
    {
      combination: "Colorpoint × Bicolor Mid High White",
      result: "Mitted, Bicolor",
    },
    { combination: "Colorpoint × Bicolor High White(Van)", result: "Bicolor" },
    {
      combination: "Mitted × Mitted",
      result: "Colorpoint, Mitted, High Mitted",
    },
    { combination: "Mitted × High Mitted", result: "Mitted, High Mitted" },
    { combination: "High Mitted × High Mitted", result: "High Mitted" },
    {
      combination: "Mitted × Bicolor true",
      result: "Colorpoint, Mitted, Bicolor true, Bicolor mid high white",
    },
    {
      combination: "Mitted × Bicolor Mid High White",
      result: "Mitted, High mitted, Bicolor true, Bicolor mid high white",
    },
    {
      combination: "Mitted × Bicolor High White(Van)",
      result: "Bicolor true, Bicolor Mid High White",
    },
    {
      combination: "Bicolor true × Bicolor true",
      result: "Colorpoint, Bicolor true, Bicolor High White",
    },
    {
      combination: "Bicolor true × Bicolor Mid High White",
      result:
        "Mitted, Bicolor true, Bicolor Mid High White, Bicolor High White",
    },
    {
      combination: "Bicolor true × Bicolor High White",
      result: "Bicolor true, Bicolor High White",
    },
  ];

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        Genetika plemene Ragdoll
      </Title>
      <Text size="lg" c="black">
        Je důležité znát základy genetiky pro každého, kdo se chce věnovat
        chovu. Jedině tak může chovatel vědět, jaká koťátka se mohou od různých
        rodičů narodit. Není to sice moc zajímavé čtení pro laika, ale to mu
        důležitosti nemůže odebrat.
      </Text>
      <Text size="lg" c="black">
        Variety nemůže pohlaví kočky nijak ovlivnit, proto používáme všeobecný
        termín - rodiče.
      </Text>

      <Accordion variant="separated" radius="md" w="100%">
        <Accordion.Item value="varieties">
          <Accordion.Control>
            <Title order={3} size="h3">
              Variety Ragdoll a jejich genetické kódy
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
                Podrobný přehled kombinací variet najdete například{" "}
                <Text
                  component="a"
                  href="http://rfwclub.org/Gwsf.htm"
                  target="_blank"
                  c="blue"
                >
                  ZDE
                </Text>
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="combinations">
          <Accordion.Control>
            <Title order={3} size="h3">
              Stručný přehled kombinací variet
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Kombinace rodičů</Table.Th>
                  <Table.Th>Možné variety koťat</Table.Th>
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
              Barvy Ragdoll a jejich genetika
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                U genetických kódů základních barev jsou použity termíny a
                označení:
              </Text>
              <Box px="md">
                <Text>• písmeno B je pro sealové zbarvení srsti</Text>
                <Text>• písmeno b je pro čokoládové zbarvení</Text>
                <Text>
                  • písmeno D je pro plné zbarvení (tedy bez ředících účinků na
                  barvu)
                </Text>
                <Text>• písmeno d je pro ředění barvy (dilute gen)</Text>
              </Box>

              <Title order={4} size="h4" mt="md">
                Základní barvy:
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
                Podrobný přehled kombinací základních barev najdete na adrese:{" "}
                <Text
                  component="a"
                  href="http://rfwclub.org/Gcolor.htm"
                  target="_blank"
                  c="blue"
                >
                  kombinace barev
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
