import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { LeftImageSection } from "../components/LeftImageSection";
import Link from "next/link";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";

export default function AboutPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        backgroundImage="https://images.unsplash.com/photo-1568470010257-111aa304d53b?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading="Zde se dozvíte něco málo o tom, jak jsme začali."
        subtext="Naše vytrvalost a nadšenost."
      />
      <Stack
        px={32}
        py={128}
        justify="center"
        align="center"
        gap={64}
        maw={1280}
        mx="auto"
        w="100%"
      >
        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            O chovatelské stanici koček Faelis - plemeno Ragdoll
          </Title>
          <Text size="lg" c="black" ta="center" maw={960}>
            Chovatelská stanice koček Faelis chová plemeno Ragdoll. Chovu
            Ragdoll kočky se věnuji od roku 2002 a snažím se chov dělat co
            nejlépe se vším, co k němu patří. V dnešní době to je mimo jiného
            spousta zdravotních testů chovných koček, účast na výstavách atd....
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <AspectRatio ratio={16 / 9}>
              <Image
                radius="lg"
                src="https://images.unsplash.com/photo-1568470010257-111aa304d53b?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="1"
              />
            </AspectRatio>
            <AspectRatio ratio={16 / 9}>
              <Image
                radius="lg"
                src="https://images.unsplash.com/photo-1568470010257-111aa304d53b?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="1"
              />
            </AspectRatio>
          </SimpleGrid>
          <Text size="lg" c="black" ta="center" maw={960}>
            Prestiž a uznání chovatelské stanice si nikde nekoupíte, k tomu se
            můžete dopracovat jen krok za krokem dobrou a poctivou chovatelskou
            prací. Říkat sám o sobě jak jste dobrý je k ničemu, to druzí vás
            mají takto soudit a pak se teprve můžete cítit jako dobrý chovatel.
            Ne nadarmo se odpradávna říká, že sebechvála smrdí :o) V
            chovatelství se člověk stále učí něčemu novému a neustále se setkává
            s věcmi, s kterými ještě neměl žádnou zkušenost a musí se s nimi
            poprat. Chovatelství nepřináší jen radost z roztomilých koťátek, je
            to spousta starostí, odpovědnosti, někdy i smutku a až tam kdesi na
            konci je radost.
          </Text>
        </Stack>

        <FullscreenBackroundSection>
          <Stack align="center" w="100%" maw={720} py={32}>
            <Title order={2} size="h1" c="dark" ta="center">
              Mám zájem o svou kočičku
            </Title>
            <Text size="lg" c="black" ta="center">
              Pokud máte zájem zakoupit jednu z našich kočiček, tak nás
              kontaktujte pomocí telefonního čísla a nebo na níže uvedeném
              formuláři.
            </Text>
            <Button
              color="#47a3ee"
              size="compact-lg"
              fw={400}
              px={24}
              w={{ base: "100%", sm: "fit-content" }}
            >
              Zjistit více
            </Button>
          </Stack>
        </FullscreenBackroundSection>

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Jsem hrdá na to, že o naše koťátka mají zájem i v zahraničních
            chovatelských stanicích.
          </Title>
          <Stack w="100%" align="center" gap={8}>
            <Text size="lg" c="black" ta="center">
              Mezi země, kde koťátka z chovatelské stanice Faelis žijí patří:
            </Text>
            <Text size="lg" c="black" ta="center">
              Holandsko, Belgie, Švédsko, Polsko, Maďarsko, Rumunsko, Norsko,
              Slovensko, Rakousko, Španělsko, Itálie, Nový Zéland, Kanada, USA,
              Finsko, Anglie, Německo, Francie, Brazílie a Černá Hora...
            </Text>
          </Stack>
          <Text size="lg" c="black" ta="center">
            CHS Faelis je registrována v ČSCHK (který patří pod světovou
            organizaci FIFe) a tím je vázána dodržováním Chovatelského řádu této
            organizace. V Česku prodávám kočičky do chovu zásadně stejně
            registrovaným zájemcům, kocourky jen na mazlíčky. Všechna koťata
            prodávám vždy řádně naočkovaná a s průkazy původu ve stáří 3 měsíců.
            Ráda poradím všem, nejen majitelům našich koťátek. Pro svá koťátka
            chci jen ty nejhodnější páníčky, ale to je myslím sen každého
            chovatele :o) Kotátkům dávám výbavičku pro první dny v novém domově.
          </Text>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}
