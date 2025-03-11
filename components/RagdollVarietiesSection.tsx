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
import { useRouter } from "next/router";

// Import translations
import csTranslations from "../locales/cs/varieties.json";
import enTranslations from "../locales/en/varieties.json";
import deTranslations from "../locales/de/varieties.json";

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
    id: string;
    image: string;
    title: string;
  }>;
  disqualifications: string;
}

// Base variety data (non-translatable content)
const baseVarietyData = [
  {
    id: "colorpoint",
    code: "RAG n, RAG a, RAG b, RAG c",
    smallImage: "http://www.ragdolls.cz/img/variety/colorpoint.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/colorpoint_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19072",
    exampleImages: [
      {
        id: "seal_colorpoint",
        image: "http://www.ragdolls.cz/img/variety/colorpoint_seal.jpg",
      },
      {
        id: "blue_colorpoint",
        image: "http://www.ragdolls.cz/img/variety/colorpoint_blue.jpg",
      },
      {
        id: "chocolate_colorpoint",
        image: "http://www.ragdolls.cz/img/variety/colorpoint_chocolate.jpg",
      },
      {
        id: "lilac_colorpoint",
        image: "http://www.ragdolls.cz/img/variety/colorpoint_lilac.jpg",
      },
    ],
  },
  {
    id: "mitted",
    code: "RAG n 04, RAG a 04, RAG b 04, RAG c 04",
    smallImage: "http://www.ragdolls.cz/img/variety/mitted.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/mitted_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19073",
    exampleImages: [
      {
        id: "seal_mitted",
        image: "http://www.ragdolls.cz/img/variety/mitted_seal.jpg",
      },
      {
        id: "blue_mitted",
        image: "http://www.ragdolls.cz/img/variety/mitted_blue.jpg",
      },
      {
        id: "chocolate_mitted",
        image: "http://www.ragdolls.cz/img/variety/mitted_chocolate.jpg",
      },
      {
        id: "lilac_mitted",
        image: "http://www.ragdolls.cz/img/variety/mitted_lilac.jpg",
      },
    ],
  },
  {
    id: "bicolor",
    code: "RAG n 03, RAG a 03, RAG b 03, RAG c 03",
    smallImage: "http://www.ragdolls.cz/img/variety/bicolor.jpg",
    largeImage: "http://www.ragdolls.cz/img/variety/bicolor_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19074",
    exampleImages: [
      {
        id: "seal_bicolor",
        image: "http://www.ragdolls.cz/img/variety/bicolor_seal.jpg",
      },
      {
        id: "blue_bicolor",
        image: "http://www.ragdolls.cz/img/variety/bicolor_blue.jpg",
      },
      {
        id: "chocolate_tortie_bicolor",
        image: "http://www.ragdolls.cz/img/variety/bicolor_chocolatetortie.jpg",
      },
    ],
  },
];

export function RagdollVarietiesSection() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedVariety, setSelectedVariety] = useState<RagdollVariety | null>(
    null
  );
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

  // Create the full variety data with translations
  const varietyData: RagdollVariety[] = baseVarietyData.map((variety) => {
    const translatedVariety =
      t.varieties[variety.id as keyof typeof t.varieties];
    const examples = variety.exampleImages.map((example) => ({
      id: example.id,
      image: example.image,
      title: t.examples[example.id as keyof typeof t.examples] || example.id,
    }));

    return {
      ...variety,
      name: translatedVariety.name,
      description: translatedVariety.description,
      disqualifications: translatedVariety.disqualifications,
      examples,
    };
  });

  const handleVarietyClick = (variety: RagdollVariety): void => {
    setSelectedVariety(variety);
    open();
  };

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        {t.section.title}
      </Title>
      <Text size="lg" c="black">
        {t.section.intro}
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
              {t.modal.examples}
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
              {t.modal.disqualifications}
            </Text>
            <Text>{selectedVariety.disqualifications}</Text>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

export default RagdollVarietiesSection;
