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
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { useRouter } from "next/router";
import "@mantine/carousel/styles.css";
import classes from "./Carousel.module.css";

// Import translations
import csTranslations from "../locales/cs/colors.json";
import enTranslations from "../locales/en/colors.json";
import deTranslations from "../locales/de/colors.json";

// Define the color data type
interface RagdollColor {
  id: string;
  name: string;
  code: string;
  smallImage: string;
  largeImage: string;
  description: string;
  galleryLink: string | null;
}

// Base color data from the old website (codes and image paths don't need translation)
const baseColorData = [
  {
    id: "seal",
    code: "RAG n (seal colorpoint), RAG n 04 (seal mitted), RAG n 03 (seal bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/seal.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/seal_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19054",
  },
  {
    id: "blue",
    code: "RAG a (blue colorpoint), RAG a 04 (blue mitted), RAG a 03 (blue bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/blue.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/blue_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19055",
  },
  {
    id: "chocolate",
    code: "RAG b (chocolate colorpoint), RAG b 04 (chocolate mitted), RAG b 03 (chocolate bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolate.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolate_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19056",
  },
  {
    id: "lilac",
    code: "RAG c (lilac colorpoint), RAG c 04 (lilac mitted), RAG c 03 (lilac bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilac.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilac_big.jpg",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19057",
  },
  {
    id: "red",
    code: "RAG d (red colorpoint), RAG d 04 (red mitted), RAG n 03 (red bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/red.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/red_big.jpg",
    galleryLink: null,
  },
  {
    id: "cream",
    code: "RAG e (cream colorpoint), RAG e 04 (cream mitted), RAG e 03 (cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/cream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/cream_big.jpg",
    galleryLink: null,
  },
  {
    id: "seallynx",
    code: "RAG n 21 (seal lynx colorpoint), RAG n 04 21 (seal lynx mitted), RAG n 03 21 (seal lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/seallynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/seallynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "bluelynx",
    code: "RAG a 21 (blue lynx colorpoint), RAG a 04 21 (blue lynx mitted), RAG a 03 21 (blue lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluelynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluelynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "chocolatelynx",
    code: "RAG b 21 (chocolate lynx colorpoint), RAG b 04 21 (chocolate lynx mitted), RAG b 03 21 (chocolate lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatelynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatelynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "lilaclynx",
    code: "RAG c 21 (lilac lynx colorpoint), RAG c 04 21 (lilac lynx mitted), RAG c 03 21 (lilac lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilaclynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilaclynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "redlynx",
    code: "RAG d 21 (red lynx colorpoint), RAG d 04 21 (red lynx mitted), RAG d 03 21 (red lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/redlynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/redlynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "creamlynx",
    code: "RAG e 21 (cream lynx colorpoint), RAG e 04 21 (cream lynx mitted), RAG e 03 21 (cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/creamlynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/creamlynx_big.jpg",
    galleryLink: null,
  },
  {
    id: "sealtortie",
    code: "RAG f (seal tortie colorpoint), RAG f 04 (seal tortie mitted), RAG f 03 (seal tortie bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/sealtortie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/sealtortie_big.jpg",
    galleryLink: null,
  },
  {
    id: "bluecream",
    code: "RAG g (blue cream colorpoint), RAG g 04 (blue cream mitted), RAG g 03 (blue cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluecream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluecream_big.jpg",
    galleryLink: null,
  },
  {
    id: "chocolatetortie",
    code: "RAG h (chocolate tortie colorpoint), RAG h 04 (chocolate tortie mitted), RAG h 03 (chocolate tortie bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatetortie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatetortie_big.jpg",
    galleryLink: null,
  },
  {
    id: "lilaccream",
    code: "RAG j (lilac cream colorpoint), RAG j 04 (lilac cream mitted), RAG j 03 (lilac cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilaccream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilaccream_big.jpg",
    galleryLink: null,
  },
  {
    id: "sealtorbie",
    code: "RAG f 21 (seal tortie lynx colorpoint), RAG f 04 21 (seal tortie lynx mitted), RAG f 03 21 (seal tortie lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/sealtorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/sealtorbie_big.jpg",
    galleryLink: null,
  },
  {
    id: "bluetorbie",
    code: "RAG g 21 (blue cream lynx colorpoint), RAG g 04 21 (blue cream lynx mitted), RAG g 03 21 (blue cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluetorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluetorbie_big.jpg",
    galleryLink: null,
  },
  {
    id: "chocolatetorbie",
    code: "RAG h 21 (chocolate tortie lynx colorpoint), RAG h 04 21 (chocolate tortie lynx mitted), RAG h 03 21 (chocolate tortie lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatetorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatetorbie_big.jpg",
    galleryLink: null,
  },
  {
    id: "lilactorbie",
    code: "RAG j 21 (lilac cream lynx colorpoint), RAG j 04 21 (lilac cream lynx mitted), RAG j 03 21 (lilac cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilactorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilactorbie_big.jpg",
    galleryLink: null,
  },
];

export function RagdollColorsCarousel() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedColor, setSelectedColor] = useState<RagdollColor | null>(null);
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

  // Create the color data with localized name and description
  const colorData: RagdollColor[] = baseColorData.map((color) => ({
    ...color,
    name:
      t.colors[color.id as keyof typeof t.colors]?.name ||
      color.id.toUpperCase(),
    description: t.colors[color.id as keyof typeof t.colors]?.description || "",
  }));

  const handleColorClick = (color: RagdollColor): void => {
    setSelectedColor(color);
    open();
  };

  return (
    <>
      <Carousel
        classNames={classes}
        withIndicators
        maw="min(960px, 80vw)"
        slideSize={{ base: "100%", sm: "50%", md: "33.333333%" }}
        slideGap={{ base: 0, sm: "md" }}
        loop
        align="start"
        styles={{
          indicator: { boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.75)" },
        }}
      >
        {colorData.map((color) => (
          <Carousel.Slide
            key={color.id}
            onClick={() => handleColorClick(color)}
          >
            <Card
              pb={24}
              style={{ position: "relative" }}
              padding="lg"
              radius="lg"
              bg="#d6e6f3"
            >
              <Stack gap={8}>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={color.largeImage}
                    alt={color.name}
                    fit="cover"
                    radius="md"
                  />
                </AspectRatio>
                <Badge color="blue">{color.id.toUpperCase()}</Badge>
                <Text lineClamp={1}>{color.name}</Text>
              </Stack>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>

      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={selectedColor?.name}
      >
        {selectedColor && (
          <Stack>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={selectedColor.largeImage}
                alt={selectedColor.name}
                fit="contain"
              />
            </AspectRatio>

            <Group>
              <Badge color="blue" size="lg">
                {selectedColor.id.toUpperCase()}
              </Badge>
              <Text size="sm" color="dimmed">
                {selectedColor.code}
              </Text>
            </Group>

            <Text>{selectedColor.description}</Text>
          </Stack>
        )}
      </Modal>

      <Text size="xs" c="dimmed" mt="sm">
        {t.ui.copyright}
      </Text>
    </>
  );
}

export default RagdollColorsCarousel;
