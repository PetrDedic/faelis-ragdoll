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
  BoxProps,
  GroupProps,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import classes from "./Carousel.module.css";

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

// Color data from the old website
const colorData: RagdollColor[] = [
  {
    id: "seal",
    name: "SEAL - ČERNOHNĚDÁ",
    code: "RAG n (seal colorpoint), RAG n 04 (seal mitted), RAG n 03 (seal bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/seal.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/seal_big.jpg",
    description:
      "Tělo je světle hnědé, směrem k břichu a hrudi se barva zesvětluje, odznaky jsou sytě černohnědé až černé. Nosík a polštářky na tlapkách jsou tmavě černohnědé. Barva seal je tzv. plná barva (v genetickém kódu je značena velkými písmeny BB, ředící geny buď nemá - DD, případně má maximálně jeden - Dd).",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19054",
  },
  {
    id: "blue",
    name: "BLUE - MODRÁ",
    code: "RAG a (blue colorpoint), RAG a 04 (blue mitted), RAG a 03 (blue bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/blue.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/blue_big.jpg",
    description:
      "Tělo je modravě bílé ve studeném odstínu barvy, směrem k břichu a hrudi se barva zesvětluje, odznaky jsou sytě tmavošedé s modravým nádechem. Nosík a polštářky na tlapkách jsou břidlicově šedé - intenzita sytosti barvy je individuální. Barva blue je zředěná barva seal ( v genetickém kódu je značena písmenem velkým BB a k tomu vždy dva ředící geny dd).",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19055",
  },
  {
    id: "chocolate",
    name: "CHOCOLATE - ČOKOLÁDOVÁ",
    code: "RAG b (chocolate colorpoint), RAG b 04 (chocolate mitted), RAG b 03 (chocolate bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolate.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolate_big.jpg",
    description:
      "Tělo je slonovinově bílé, směrem k břichu a hrudi se barva zesvětluje, odznaky jsou v teplém barveném tónu mléčné čokolády, nikde na těle není žádný odstín do černé nebo černohnědé barvy. Nosík a polštářky na tlapkách jsou skořicově hnědé s růžovým nádechem - intenzita sytosti barvy je individuální. Barva čokoládová je plná barva (v genetickém kódu je značena dvěma malými písmeny bb, ředící geny buď nemá - DD, případně má maximálně jeden - Dd).",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19056",
  },
  {
    id: "lilac",
    name: "LILAC (FROST) - LILOVÁ",
    code: "RAG c (lilac colorpoint), RAG c 04 (lilac mitted), RAG c 03 (lilac bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilac.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilac_big.jpg",
    description:
      "Tělo je teple bílé s růžovám nádechem, směrem k břichu a hrudi se barva zesvětluje, odznaky jsou v ledově šedé barvě s růžovým nádechem. Nosík a polštářky na tlapkách jsou levandulové - intenzita sytosti barvy je individuální. Barva lilová je zředěná čokoládová barva (v genetickém kódu je značena dvěma malými písmeny bb, a k tomu vždy dva ředící geny dd).",
    galleryLink: "http://www.ragdolls.cz/gallery2/main.php?g2_itemId=19057",
  },
  {
    id: "red",
    name: "RED (FLAME) - ČERVENÁ",
    code: "RAG d (red colorpoint), RAG d 04 (red mitted), RAG n 03 (red bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/red.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/red_big.jpg",
    description:
      "Tělo je čistě bílé, místy s nádechem odznalů. Odznaky jsou červené v ostré barvě mrkve - preferována sytost barvy. Nosík a polštářky na tlapkách jsou korálově červené - intenzita sytosti barvy je individuální. Barva red je tzv. plná barva a v genetickém zápise se značí písmenem O.",
    galleryLink: null,
  },
  {
    id: "cream",
    name: "CREAM - KRÉMOVÁ",
    code: "RAG e (cream colorpoint), RAG e 04 (cream mitted), RAG e 03 (cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/cream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/cream_big.jpg",
    description:
      "Tělo je čistě bílé, místy s nádechem barvy odznaků. Odznaky jsou světle krémově červené - barva není ostrá, preferována sytost barvy. Nosík a polštářky na tlapkách jsou světle korálově červené - intenzita sytosti barvy je individuální. Barva cream je tzv. ředěná barva (v genetickém kódu je značena velkými písmem O.",
    galleryLink: null,
  },
  {
    id: "seallynx",
    name: "SEAL LYNX - ČERNOHNĚDÁ S KRESBOU",
    code: "RAG n 21 (seal lynx colorpoint), RAG n 04 21 (seal lynx mitted), RAG n 03 21 (seal lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/seallynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/seallynx_big.jpg",
    description:
      "Tělo je světle hnědé, směrem k břichu a hrudi se barva zesvětluje, na těle je zřetelná kresba - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou černohnědé se zřetelným světlejším pozadím. Nosík je preferován černohnědý, ale může být i růžový s černohnědým lemováním. Polštářky na tlapkách jsou hnědé. Může se stát, že vlivem kresby se všechny barvy - srsti, nosíku i polštářků - mohou jevit světlejší než klasická černohnědá - ale pozor, není to čokoládová barva. Ostatní jako u barvy seal.",
    galleryLink: null,
  },
  {
    id: "bluelynx",
    name: "BLUE LYNX - MODRÁ S KRESBOU",
    code: "RAG a 21 (blue lynx colorpoint), RAG a 04 21 (blue lynx mitted), RAG a 03 21 (blue lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluelynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluelynx_big.jpg",
    description:
      "Tělo je světle hnědé, směrem k břichu a hrudi se barva zesvětluje, na těle je zřetelná kresba - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou sytě šedé s modrým nádechem se zřetelným světlejším pozadím. Nosík je preferován břidlicově šedý, ale může být i růžový s šedým lemováním. Polštářky na tlapkách jsou šedé. Ostatní jako u barvy blue.",
    galleryLink: null,
  },
  {
    id: "chocolatelynx",
    name: "CHOCOLATE LYNX - ČOKOLÁDOVÁ S KRESBOU",
    code: "RAG b 21 (chocolate lynx colorpoint), RAG b 04 21 (chocolate lynx mitted), RAG b 03 21 (chocolate lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatelynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatelynx_big.jpg",
    description:
      "Tělo je světle hnědé, směrem k břichu a hrudi se barva zesvětluje, na těle je zřetelná kresba - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou v barvě mléčné čokolády se zřetelným světlejším pozadím. Nosík je preferován teple hnědý, ale může být i růžový s teple-hnědým lemováním. Polštářky na tlapkách jsou teple hnědé. Ostatní jako u barvy čokoládové.",
    galleryLink: null,
  },
  {
    id: "lilaclynx",
    name: "LILAC LYNX - LILOVÁ S KRESBOU",
    code: "RAG c 21 (lilac lynx colorpoint), RAG c 04 21 (lilac lynx mitted), RAG c 03 21 (lilac lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilaclynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilaclynx_big.jpg",
    description:
      "Tělo je ledově bílé, směrem k břichu a hrudi se barva zesvětluje, na těle je zřetelná kresba - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou ledově šedé s teplým růžovým nádechem se zřetelným světlejším pozadím. Nosík je preferován levandulový, ale může být i růžový s levandulovým lemováním. Polštářky na tlapkách jsou levandulové. Ostatní jako u barvy lilové.",
    galleryLink: null,
  },
  {
    id: "redlynx",
    name: "RED LYNX - ČERVENÁ S KRESBOU",
    code: "RAG d 21 (red lynx colorpoint), RAG d 04 21 (red lynx mitted), RAG d 03 21 (red lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/redlynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/redlynx_big.jpg",
    description:
      "Tělo je, na těle může být viditelná kresba v barvě odznaků - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou ostře červené v barvě mrkve se zřetelným světlejším pozadím. Nosík je preferován korálově červený, ale může být i růžový s korálově červeným lemováním. Polštářky na tlapkách jsou korálově červené. Ostatní jako u barvy červené.",
    galleryLink: null,
  },
  {
    id: "creamlynx",
    name: "CREAM LYNX - KRÉMOVÁ S KRESBOU",
    code: "RAG e 21 (cream lynx colorpoint), RAG e 04 21 (cream lynx mitted), RAG e 03 21 (cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/creamlynx.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/creamlynx_big.jpg",
    description:
      "Tělo je čistě bílé, místy s odstíny krémové, směrem k břichu a hrudi se barva zesvětluje, na těle jsou krémové odstíny kresby - pruhy a tečky. Na uších uprostřed je světlejší místo - tzv.otisk palce. Odznaky jsou světle krémově červené s teplým nádechem se zřetelným světlejším pozadím. Nosík je preferován světle korálový, ale může být i růžový s korálově červeným lemováním. Polštářky na tlapkách jsou světle korálové. Ostatní jako u barvy krémové.",
    galleryLink: null,
  },
  {
    id: "sealtortie",
    name: "SEAL TORTIE - ČERNOHNĚDÁ ŽELVOVINOVÁ",
    code: "RAG f (seal tortie colorpoint), RAG f 04 (seal tortie mitted), RAG f 03 (seal tortie bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/sealtortie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/sealtortie_big.jpg",
    description:
      "V tomto vybravení může být pouze kočka. Tělo je světle hnědé, směrem k břichu a hrudi se barva zesvětluje, na těle mohou být červené nebo krémové skvrny - jejich velikost je individuální. Odznaky jsou černohnědé, mohou být červenými nebo krémovými skvrnami. Nosík a tlapky jsou černohnědé, případně vhodně korálově červené - podle rozmístění červených skvrn na hlavě a tlapkách kočky. Ostatní jako u barvy sealové.",
    galleryLink: null,
  },
  {
    id: "bluecream",
    name: "BLUE CREAM - MODRÁ ŽELVOVINOVÁ",
    code: "RAG g (blue cream colorpoint), RAG g 04 (blue cream mitted), RAG g 03 (blue cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluecream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluecream_big.jpg",
    description:
      "V tomto vybarvení může být pouze kočka. Tělo je modravě bílé ve studeném odstínu barvy, směrem k břichu a hrudi se barva zesvětluje, na těle mohou být krémové skvrny - jejich velikost je individuální. Odznaky jsou břidlicově šedé, mohou být s krémovými skvrnami. Nosík a polštářky na tlapkách jsou břidlicově šedé, případně vhodně korálově červené - podle rozmístění krémových skvrn na hlavě a tlapkách kočky. Ostatní jako u barvy blue.",
    galleryLink: null,
  },
  {
    id: "chocolatetortie",
    name: "CHOCOLATE TORTIE - ČOKOLÁDOVÁ ŽELVOVINOVÁ",
    code: "RAG h (chocolate tortie colorpoint), RAG h 04 (chocolate tortie mitted), RAG h 03 (chocolate tortie bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatetortie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatetortie_big.jpg",
    description:
      "V tomto vybravení může být pouze kočka. Tělo je slonovinově bílé, směrem k břichu a hrudi se barva zesvětluje, na těle mohou být červené nebo krémové skvrny - jejich velikost je individuální. Odznaky jsou barvě mléčné čokolády, mohou být s červenými nebo krémovými skvrnami. Nosík a tlapky jsou skořicově hnědé, případně vhodně korálově červené - podle rozmístění červených skvrn na hlavě a tlapkách kočky. Ostatní jako u barvy čokoládové.",
    galleryLink: null,
  },
  {
    id: "lilaccream",
    name: "LILAC CREAM - LILOVÁ ŽELVOVINOVÁ",
    code: "RAG j (lilac cream colorpoint), RAG j 04 (lilac cream mitted), RAG j 03 (lilac cream bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilaccream.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilaccream_big.jpg",
    description:
      "V tomto vybarvení může být pouze kočka. Tělo je teple bílé s růžovám nádechem, směrem k břichu a hrudi se barva zesvětluje na těle mohou být krémové skvrny - jejich velikost je individuální. Odznaky jsou v ledově šedé barvě s růžovým nádechem, mohou být s krémovými skvrnami. Nosík a polštářky na tlapkách jsou levandulové - případně vhodně korálově červené - podle rozmístění červených skvrn na hlavě a tlapkách kočky. Ostatní jako u barvy lilac.",
    galleryLink: null,
  },
  {
    id: "sealtorbie",
    name: "SEAL TORTIE LYNX (SEAL TORBIE) - ČERNOHNĚDÁ ŽELVOVINOVÁ S KRESBOU",
    code: "RAG f 21 (seal tortie lynx colorpoint), RAG f 04 21 (seal tortie lynx mitted), RAG f 03 21 (seal tortie lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/sealtorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/sealtorbie_big.jpg",
    description:
      "V tomto vybravení může být pouze kočka. Vybarvení je jako u seal tortie a seal lynx.",
    galleryLink: null,
  },
  {
    id: "bluetorbie",
    name: "BLUE CREAM LYNX (BLUE TORBIE) - MODRÁ ŽELVOVINOVÁ S KRESBOU",
    code: "RAG g 21 (blue cream lynx colorpoint), RAG g 04 21 (blue cream lynx mitted), RAG g 03 21 (blue cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/bluetorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/bluetorbie_big.jpg",
    description:
      "V tomto vybarvení může být pouze kočka. Vybarvení je jako u blue cream a blue lynx.",
    galleryLink: null,
  },
  {
    id: "chocolatetorbie",
    name: "CHOCOLATE TORTIE LYNX (CHOCOLATE TORBIE) - ČOKOLÁDOVÁ ŽELVOVINOVÁ S KRESBOU",
    code: "RAG h 21 (chocolate tortie lynx colorpoint), RAG h 04 21 (chocolate tortie lynx mitted), RAG h 03 21 (chocolate tortie lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/chocolatetorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/chocolatetorbie_big.jpg",
    description:
      "V tomto vybravení může být pouze kočka. Vybarvení je jako u chocolate cream a chocolate lynx.",
    galleryLink: null,
  },
  {
    id: "lilactorbie",
    name: "LILAC CREAM LYNX (LILAC TORBIE) - LILOVÁ ŽELVOVINOVÁ S KRESBOU",
    code: "RAG j 21 (lilac cream lynx colorpoint), RAG j 04 21 (lilac cream lynx mitted), RAG j 03 21 (lilac cream lynx bicolor)",
    smallImage: "http://www.ragdolls.cz/img/barvy/lilactorbie.jpg",
    largeImage: "http://www.ragdolls.cz/img/barvy/lilactorbie_big.jpg",
    description:
      "V tomto vybarvení může být pouze kočka. Vybarvení je jako u lilac cream a lilac lynx.",
    galleryLink: null,
  },
];

export function RagdollColorsCarousel() {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedColor, setSelectedColor] = useState<RagdollColor | null>(null);

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
    </>
  );
}

export default RagdollColorsCarousel;
