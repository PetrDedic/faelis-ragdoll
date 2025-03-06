import { useState } from "react";
import {
  Image,
  Text,
  Modal,
  Stack,
  Group,
  Badge,
  Box,
  AspectRatio,
  Title,
  SimpleGrid,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Define the variety data type
interface RagdollVariety {
  id: string;
  name: string;
  code: string;
  smallImage: string;
  largeImage: string;
  description: string;
  galleryLink: string | null;
  examples: Array<{
    image: string;
    title: string;
  }>;
  disqualifications: string;
}

// Variety data from the old website
const varietyData: RagdollVariety[] = [
  {
    id: "colorpoint",
    name: "Ragdoll colorpoint",
    code: "RAG n, RAG a, RAG b, RAG c",
    smallImage: "http://www.ragdolls.cz/img/variety/colorpoint.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/colorpoint_big.jpg",
    description:
      "Odznaky: uši, maska, packy, varlata a ocas jsou temnější, s jasně stanovenou barvou. Sliznice nosu a polštářky tlapek plně vybarvené a odpovídající dané barvě. Tělo: viditelný kontrast mezi tělem a odznaky. Hruď, hříva a oblasti brady mohou mít poněkud světlejší vybarvení.",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19072",
    examples: [
      {
        image: "http://www.ragdolls.cz/img/variety/colorpoint_seal.jpg",
        title: "Ragdoll seal colorpoint, RAG n",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/colorpoint_blue.jpg",
        title: "Ragdoll blue colorpoint, RAG a",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/colorpoint_chocolate.jpg",
        title: "Ragdoll chocolate colorpoint, RAG b",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/colorpoint_lilac.jpg",
        title: "Ragdoll lilac colorpoint, RAG c",
      },
    ],
    disqualifications: "Přítomnost bílé barvy srsti kdekoliv na kočičím těle.",
  },
  {
    id: "mitted",
    name: "Ragdoll mitted",
    code: "RAG n 04, RAG a 04, RAG b 04, RAG c 04",
    smallImage: "http://www.ragdolls.cz/img/variety/mitted.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/mitted_big.jpg",
    description:
      "Odznaky (s vyjímkou bílé na packách): uši, maska, packy a ocas jsou temnější, s jasně stanovenou barvou. Možnost bílé skvrny nebo proužku (tvar hvězdičky, plamínky, přesýpacích hodin - v celku nebo více skvrn či proužků) v srsti od sliznice nosu nahoru nebo pod nosem. Brada musí být vždy bílá a přechází v kuse do bílého pruhu na břiše, který končí až u genitálií. Přední tlapky jsou rovnoměrně bílé, nejlépe do výše zápěstního kloubu. Zadní nohy jsou bílé ideálně po patní kloub. Sliznice nosu plně vybarvena a odpovídající dané barvě srtsi. Polštářky jsou růžové, může se vyskytnout zabarvený polštářek v barvě srsti. Barva srsti po těle by měla být viditelně světlejší než barva odznaků, na těle barva může mít více odstínů. U koťat a dospělých mladších 2-3 let barvy nejsou plně vyvinuté.",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19073",
    examples: [
      {
        image: "http://www.ragdolls.cz/img/variety/mitted_seal.jpg",
        title: "Ragdoll seal mitted, RAG n 04",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/mitted_blue.jpg",
        title: "Ragdoll blue mitted, RAG a 04",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/mitted_chocolate.jpg",
        title: "Ragdoll chocolate mitted, RAG b 04",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/mitted_lilac.jpg",
        title: "Ragdoll lilac mitted, RAG c 04",
      },
    ],
    disqualifications: "Absence bílé brady.",
  },
  {
    id: "bicolor",
    name: "Ragdoll bicolor",
    code: "RAG n 03, RAG a 03, RAG b 03, RAG c 03",
    smallImage: "http://www.ragdolls.cz/img/variety/bicolor.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/bicolor_big.jpg",
    description:
      "Odznaky: uši a ocas. V oblasti masky je bílé obrácené V - maximálně po vnější okraj očí, preferována souměrnost tohoto V. Sliznice nosu růžová, polštářky preferovány růžové, ale mohou být zbarvené podle srsti. Na zádech mohou být bílé skvrny, tělo na hrudi, bradě a břiše má být bílé.",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19074",
    examples: [
      {
        image: "http://www.ragdolls.cz/img/variety/bicolor_seal.jpg",
        title: "Ragdoll seal bicolor, RAG n 03",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/bicolor_blue.jpg",
        title: "Ragdoll blue bicolor, RAG a 03",
      },
      {
        image: "http://www.ragdolls.cz/img/variety/bicolor_chocolatetortie.jpg",
        title: "Ragdoll chocolate tortie bicolor, RAG h 03",
      },
    ],
    disqualifications:
      "Rozsáhlá tmavá skvrna na noze/nohách, absence V nebo fleky ve V, absence celého barevného odznaku na hlavě nebo ocase.",
  },
];

export function RagdollVarietiesSection() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedVariety, setSelectedVariety] = useState<RagdollVariety | null>(
    null
  );

  const handleVarietyClick = (variety: RagdollVariety): void => {
    setSelectedVariety(variety);
    open();
  };

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        Variety plemene Ragdoll
      </Title>
      <Text size="lg" c="black">
        Všechny barvy ragdolů mohou být vždy jen ve třech varietách:
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {varietyData.map((variety) => (
          <Card
            key={variety.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            onClick={() => handleVarietyClick(variety)}
            style={{ cursor: "pointer" }}
          >
            <Card.Section>
              <AspectRatio ratio={7 / 4}>
                <Image
                  src={variety.largeImage}
                  alt={variety.name}
                  fit="cover"
                />
              </AspectRatio>
            </Card.Section>

            <Stack pt="md" gap="xs">
              <Title order={3} size="h3">
                {variety.name}
              </Title>
              <Text size="sm" c="dimmed" lineClamp={3}>
                {variety.description}
              </Text>
              <Badge color="blue">{variety.code}</Badge>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        title={selectedVariety?.name}
      >
        {selectedVariety && (
          <Stack>
            <AspectRatio ratio={7 / 4}>
              <Image
                src={selectedVariety.largeImage}
                alt={selectedVariety.name}
                fit="contain"
              />
            </AspectRatio>

            <Group>
              <Badge color="blue" size="lg">
                {selectedVariety.id.toUpperCase()}
              </Badge>
              <Text size="sm" c="dimmed">
                {selectedVariety.code}
              </Text>
            </Group>

            <Text>{selectedVariety.description}</Text>

            <Title order={4} size="h4" mt="md">
              Příklady
            </Title>
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="sm">
              {selectedVariety.examples.map((example, index) => (
                <Box key={index}>
                  <AspectRatio ratio={1}>
                    <Image
                      src={example.image}
                      alt={example.title}
                      radius="md"
                    />
                  </AspectRatio>
                  <Text size="xs" mt={4} ta="center" lineClamp={2}>
                    {example.title}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            <Text mt="md" fw={700}>
              Diskvalifikace:
            </Text>
            <Text>{selectedVariety.disqualifications}</Text>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

export default RagdollVarietiesSection;
