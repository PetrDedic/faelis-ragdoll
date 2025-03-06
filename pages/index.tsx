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

const images = {
  top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  middle:
    "https://images.unsplash.com/photo-1643431784519-6a3e9b1cfd51?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  right:
    "https://images.unsplash.com/photo-1629068136524-f467f8efa109?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function IndexPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        heading="Vítejte na stránkách Faelis"
        subtext="Jsme nejlepší a jediná chovatelská stanice plemene Ragdoll v České Republice."
      />
      <Stack
        px={32}
        justify="center"
        align="center"
        gap={64}
        maw={1280}
        mx="auto"
        w="100%"
      >
        <Flex style={{ position: "relative", top: -72, zIndex: 2 }}>
          <FeaturesCards
            cards={[
              {
                icon: "/images/Domek_Tlapka.svg",
                text: "Bezpečné a útulné místo pro kočky.",
              },
              {
                icon: "/images/Srdce.svg",
                text: "Zdraví a péče na prvním místě..",
              },
              {
                icon: "/images/Kalendar.svg",
                text: "Dlouholetá praxe a zkušenost.",
              },
            ]}
          />
        </Flex>
        <Flex mih={320}>
          <LeadGrid
            images={images}
            heading="O chovatelské stanici koček Faelis"
            subtext="Zde bude text, k danému tématu, které se zde potom doplní. Zde bude text, k danému tématu, které se zde potom doplní."
            button={{
              label: "Zjistit více",
              onClick: () => console.log("Button clicked"),
            }}
          />
        </Flex>

        <Stack gap={0}>
          <FullscreenBackroundSection>
            <Stack align="center" w="100%" maw={960}>
              <Title order={2} size="h1" c="#47a3ee">
                Naše kočky
              </Title>
              <Text size="lg" c="black">
                Zde bude text, k danému tématu, které se zde potom doplní.
                <br /> Zde bude text, k danému tématu, které se zde potom
                doplní.
              </Text>
              <Grid w="100%" gutter={32}>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Card padding="lg" radius="lg" bg="#d6e6f3">
                    <AspectRatio ratio={3 / 4}>
                      <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </AspectRatio>
                    <Title order={2} size="h2" c="dark" mt={16} ta="center">
                      Kočky
                    </Title>
                    <Text c="dimmed" ta="center">
                      Zjistit více
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Card padding="lg" radius="lg" bg="#d6e6f3">
                    <AspectRatio ratio={3 / 4}>
                      <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </AspectRatio>
                    <Title order={2} size="h2" c="dark" mt={16} ta="center">
                      Kocouři
                    </Title>
                    <Text c="dimmed" ta="center">
                      Zjistit více
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Card padding="lg" radius="lg" bg="#d6e6f3">
                    <AspectRatio ratio={3 / 4}>
                      <Image
                        radius="md"
                        src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    </AspectRatio>
                    <Title order={2} size="h2" c="dark" mt={16} ta="center">
                      Koťata
                    </Title>
                    <Text c="dimmed" ta="center">
                      Zjistit více
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </FullscreenBackroundSection>
          <FullscreenBackroundSection image="https://images.unsplash.com/photo-1586417752912-b0389b445a20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
            <Stack align="center" w="100%" maw={960} gap={48} py={32}>
              <Title order={2} size="h1">
                Pár faktů o našem chovu plemene Ragdoll
              </Title>
              <Grid w="100%" gutter={32}>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      50+
                    </Text>
                    <Text c="dark" ta="center">
                      Spokojených klientů
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
                    <Text fw={700} fz={24} c="dark" ta="center">
                      20+
                    </Text>
                    <Text c="dark" ta="center">
                      Let zkušeností a praxe
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
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
                  <Card
                    h="100%"
                    style={{ justifyContent: "center" }}
                    radius="lg"
                  >
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
        </Stack>

        <Stack align="center" w="100%" gap={32}>
          <Title order={2} size="h1" c="#47a3ee">
            Recenze a spokojenost klientů
          </Title>
          <Text size="lg" c="black">
            Zde bude text, k danému tématu, které se zde potom doplní.
            <br /> Zde bude text, k danému tématu, které se zde potom doplní.
          </Text>
          <Grid w="100%" gutter={32}>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                <Stack gap={16}>
                  <Stack gap={0}>
                    <Text fw={700} fz={24} c="#47a3ee">
                      Tomáš Šesták
                    </Text>
                    <Text fw={700} fz={12} c="black">
                      Juliet Ms.Faelis
                    </Text>
                  </Stack>
                  <Text fw={700} c="dark">
                    Zde bude text, k danému tématu, které se zde potom doplní.
                    Zde bude text, k danému tématu, které se zde potom doplní.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                <Stack gap={16}>
                  <Stack gap={0}>
                    <Text fw={700} fz={24} c="#47a3ee">
                      Tomáš Šesták
                    </Text>
                    <Text fw={700} fz={12} c="black">
                      Juliet Ms.Faelis
                    </Text>
                  </Stack>
                  <Text fw={700} c="dark">
                    Zde bude text, k danému tématu, které se zde potom doplní.
                    Zde bude text, k danému tématu, které se zde potom doplní.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <Card h="100%" radius="lg" padding="lg" bg="#d6e6f3">
                <Stack gap={16}>
                  <Stack gap={0}>
                    <Text fw={700} fz={24} c="#47a3ee">
                      Tomáš Šesták
                    </Text>
                    <Text fw={700} fz={12} c="black">
                      Juliet Ms.Faelis
                    </Text>
                  </Stack>
                  <Text fw={700} c="dark">
                    Zde bude text, k danému tématu, které se zde potom doplní.
                    Zde bude text, k danému tématu, které se zde potom doplní.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
        <FullscreenBackroundSection>
          <Stack align="center" w="100%" maw={720} py={32}>
            <Title order={2} size="h1" c="dark">
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

        <Form />
      </Stack>
    </Stack>
  );
}
