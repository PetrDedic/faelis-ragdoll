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
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatInfo } from "../components/CatInfo";

const images = {
  top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  middle:
    "https://images.unsplash.com/photo-1643431784519-6a3e9b1cfd51?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  right:
    "https://images.unsplash.com/photo-1629068136524-f467f8efa109?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function CatsPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        heading="Všechny naše koťata, kočky a kocouři"
        subtext="Chci mít vlastní kočičku."
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
            Ragdoll koťata
          </Title>
          <Text fw={700} size="xl" c="black" ta="center">
            Vrh O narozen 26/10/2024
          </Text>
          <Text size="lg" c="black" ta="center">
            Očkování, odčervení, rodokmen, kupní smlouva... to je samozřejmostí,
            s majiteli našich koťátek jsme v kontaktu i po prodeji. Rodiče jsou
            negativně testovaní na HCM a PKD, FeLV a FIV.
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
            Ragdoll kocouři
          </Title>
          <CatInfo
            images={images}
            name="Heartnsoul George Faelis 100% traditional pedigree, RAG a 04"
            info={
              <>
                Pohlaví: kocour
                <br />
                Datum narozenÍ: 2018-08-04
                <br />
                Barva: blue (carrier chocolate)
                <br />
                Varianta: mitted Krevní skupina: A / A<br />
                Genetický kód barvy: Bbdd
                <br />
                George se narodil v USA, odkud plemeno Ragdoll pochází. DNA test
                HCM a PKD negativní N/N, negativní FIV a FeLV.
              </>
            }
          />
        </Stack>

        <FullscreenBackroundSection image="https://images.unsplash.com/photo-1586417752912-b0389b445a20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
          <Stack align="center" w="100%" maw={960} gap={48} py={32}>
            <Title order={2} size="h1">
              Pár faktů o našem chovu plemene Ragdoll
            </Title>
            <Grid w="100%" gutter={32}>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    50+
                  </Text>
                  <Text c="dark" ta="center">
                    Spokojených klientů
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    20+
                  </Text>
                  <Text c="dark" ta="center">
                    Let zkušeností a praxe
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    200+
                  </Text>
                  <Text c="dark" ta="center">
                    Šťastných
                    <br />
                    koček
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                <Card h="100%" style={{ justifyContent: "center" }} radius="lg">
                  <Text fw={700} fz={24} c="dark" ta="center">
                    30+
                  </Text>
                  <Text c="dark" ta="center">
                    Úspěšných
                    <br />
                    vrhů
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
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
            Ragdoll kočky
          </Title>
          <CatInfo
            images={images}
            name="Heartnsoul George Faelis 100% traditional pedigree, RAG a 04"
            info={
              <>
                Pohlaví: kocour
                <br />
                Datum narozenÍ: 2018-08-04
                <br />
                Barva: blue (carrier chocolate)
                <br />
                Varianta: mitted Krevní skupina: A / A<br />
                Genetický kód barvy: Bbdd
                <br />
                George se narodil v USA, odkud plemeno Ragdoll pochází. DNA test
                HCM a PKD negativní N/N, negativní FIV a FeLV.
              </>
            }
          />
          <CatInfo
            images={images}
            name="Heartnsoul George Faelis 100% traditional pedigree, RAG a 04"
            info={
              <>
                Pohlaví: kocour
                <br />
                Datum narozenÍ: 2018-08-04
                <br />
                Barva: blue (carrier chocolate)
                <br />
                Varianta: mitted Krevní skupina: A / A<br />
                Genetický kód barvy: Bbdd
                <br />
                George se narodil v USA, odkud plemeno Ragdoll pochází. DNA test
                HCM a PKD negativní N/N, negativní FIV a FeLV.
              </>
            }
          />
          <CatInfo
            images={images}
            name="Heartnsoul George Faelis 100% traditional pedigree, RAG a 04"
            info={
              <>
                Pohlaví: kocour
                <br />
                Datum narozenÍ: 2018-08-04
                <br />
                Barva: blue (carrier chocolate)
                <br />
                Varianta: mitted Krevní skupina: A / A<br />
                Genetický kód barvy: Bbdd
                <br />
                George se narodil v USA, odkud plemeno Ragdoll pochází. DNA test
                HCM a PKD negativní N/N, negativní FIV a FeLV.
              </>
            }
          />
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}
