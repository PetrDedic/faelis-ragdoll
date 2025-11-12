import {
  AspectRatio,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { HeroImageBackgroundWithData } from "../components/HeroImageBackgroundWithData";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import Image from "next/image";

// Import translations
import csTranslations from "../locales/cs/index.json";
import enTranslations from "../locales/en/index.json";
import deTranslations from "../locales/de/index.json";
import HomePageSEO from "../components/SEO/HomePageSEO";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { IconCat } from "@tabler/icons-react";
import { getHeroImage } from "../utils/heroImagesServer";
import { GetStaticProps } from "next";

const images = {
  top: "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Lily/Lily.webp",
  middle:
    "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/029.webp",
  right:
    "https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/George/George.webp",
};

const reviews = [
  {
    id: "ozzy_oz_faelis",
    cat_name: "Ozzy Oz Faelis",
    owner: "Petr S.",
    location: "Benátky nad Jizerou",
    review: {
      cs: "Ozzyk se má dobře, už si pěkně zvyknul a barák je hned vzhůru nohama. Nejlépe se má na škrabadle u stropu nebo s námi v posteli.",
      en: "Ozzyk is doing well, he's settled in nicely and the house is immediately turned upside down. He's most comfortable on the scratching post by the ceiling or with us in bed.",
      de: "Ozzyk geht es gut, er hat sich gut eingelebt und das Haus steht sofort Kopf. Am wohlsten fühlt er sich auf dem Kratzbaum an der Decke oder bei uns im Bett.",
    },
  },
  {
    id: "percival_faelis",
    cat_name: "Percival Faelis",
    owner: "Iva N.",
    location: "České Budějovice",
    review: {
      cs: "Máme se dobře a Percíček je miláček. Všichni mi ho závidí - mám nejkrásnějšího kocoura široko daleko, héč, héč.",
      en: "We're doing well and Percival is a darling. Everyone envies him - I have the most beautiful cat far and wide, ha ha!",
      de: "Uns geht es gut und Percival ist ein Schatz. Alle beneiden mich – ich habe den schönsten Kater weit und breit, haha!",
    },
  },
  {
    id: "mrs_mia_faelis",
    cat_name: "Mrs. Mia Faelis",
    owner: "Iveta P.",
    location: "Havířov",
    review: {
      cs: "Ahoj zdravím, Mia je krasavice, je naše milovaná. Kdybych už neměla Miu, tak si hned od Tebe vezmu další - ta koťátka od tebe jsou nádherné, protože máš hezké kočičky a kocourka. Tak ať se daří a hlavně všichni ať jste zdraví.",
      en: "Hi, greetings, Mia is a beauty, she's our beloved. If I didn't already have Mia, I'd immediately take another one from you – your kittens are wonderful because you have beautiful cats and a tomcat. So good luck and most importantly, may you all be healthy.",
      de: "Hallo, Grüße, Mia ist eine Schönheit, sie ist unsere Geliebte. Wenn ich Mia nicht schon hätte, würde ich sofort eine weitere von dir nehmen – deine Kätzchen sind wunderschön, weil du schöne Katzen und einen Kater hast. Also viel Glück und vor allem, mögen Sie alle gesund sein.",
    },
  },
  {
    id: "captain_jack_faelis",
    cat_name: "Captain Jack Faelis",
    owner: "Martina R.",
    location: "České Budějovice",
    review: {
      cs: "Marti, podrbej tam vsecky kocici partaky. Jsi skvela baba - hodná, chytra, umis skvelou svickovou a davas lidem radost… Tvoje kotatka jsou top a navic nejlepsi kamosi. Udelej si klidny vecer a my te s Jackem mame moc radi a dekujeme, zes zrovna nas dva blazny dala dohromady.",
      en: "Marti, scratch all the cat buddies there. You're a great woman - kind, smart, you make excellent 'svíčková' and you bring joy to people... Your kittens are top-notch and also the best friends. Have a quiet evening and Jack and I love you very much and thank you for bringing us two crazy ones together.",
      de: "Marti, kraule dort alle Katzenfreunde. Du bist eine großartige Frau – nett, klug, du machst exzellenten 'svíčková' und du bereitest den Leuten Freude… Deine Kätzchen sind top und außerdem die besten Freunde. Mach dir einen ruhigen Abend und Jack und ich lieben dich sehr und danken dir, dass du uns zwei Verrückte zusammengebracht hast.",
    },
  },
  {
    id: "ozalee_faelis",
    cat_name: "Ozalee Faelis",
    owner: "Petr D.",
    location: "Praha",
    review: {
      cs: "Ozalee se má skvěle, užívá si každý den a její srst už krásně tmavne. Občas sice shodí ze stolu co může, ale jaká kočička tohle nedělá :). Jsme moc rádi, že ji máme!",
      en: "Ozalee is doing great, enjoying every day, and her fur is already beautifully darkening. Sometimes she knocks everything off the table, but what cat doesn't do that :). We are very happy to have her!",
      de: "Ozalee geht es super, sie genießt jeden Tag, und ihr Fell wird schon wunderschön dunkler. Manchmal wirft sie zwar alles vom Tisch, aber welche Katze tut das nicht :). Wir sind sehr froh, sie zu haben!",
    },
  },
  {
    id: "orianna_faelis",
    cat_name: "Orianna Faelis",
    owner: "Míša V.",
    location: "Praha",
    review: {
      cs: "Orianna je naprosto úžasná. Je hravá, plná energie a hodně mazlivá. Udělala nám s přítelem obrovskou radost.",
      en: "Orianna is absolutely amazing. She's playful, full of energy, and very cuddly. She has brought immense joy to me and my boyfriend.",
      de: "Orianna ist absolut erstaunlich. Sie ist verspielt, voller Energie und sehr verschmust. Sie hat mir und meinem Freund riesige Freude bereitet.",
    },
  },
];

interface IndexPageProps {
  heroImage: string | null;
}

export default function IndexPage({ heroImage }: IndexPageProps) {
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

  return (
    <>
      <HomePageSEO />
      <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
        <HeroImageBackgroundWithData
          heading={t.hero.heading}
          subtext={t.hero.subtext}
          backgroundImage={heroImage || undefined}
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
                  text: t.features.card1,
                },
                {
                  icon: "/images/Srdce.svg",
                  text: t.features.card2,
                },
                {
                  icon: "/images/Kalendar.svg",
                  text: t.features.card3,
                },
              ]}
            />
          </Flex>
          <Flex mih={320}>
            <LeadGrid
              images={images}
              heading={t.about.heading}
              subtext={t.about.subtext}
              button={{
                label: t.about.button,
                onClick: () => router.push("/about", "/about", { locale }),
              }}
            />
          </Flex>

          <Stack gap={0}>
            <FullscreenBackroundSection
              flexStyles={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack align="center" w="100%" maw={960}>
                <Title order={2} size="h1" c="#47a3ee" ta="center">
                  {t.cats.heading}
                </Title>
                <Text size="lg" c="black" ta="center">
                  {t.cats.subtext}
                </Text>
                <Grid w="100%" gutter={32}>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Link
                      href="/cats#female-cats"
                      style={{
                        textDecoration: "inherit",
                        color: "inherit",
                        width: "100%",
                      }}
                    >
                      <Card
                        padding="lg"
                        radius="lg"
                        bg="#d6e6f3"
                        w="100%"
                        h="100%"
                      >
                        <AspectRatio
                          ratio={3 / 4}
                          style={{
                            position: "relative",
                            aspectRatio: "3/4",
                            width: "100%",
                          }}
                        >
                          <Image
                            fill
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Juliet/Juliet.webp"
                            alt={
                              locale === "cs"
                                ? "Chovná kočka Ragdoll Juliet v barvě blue bicolor, chovatelské stanice Faelis Praha"
                                : locale === "de"
                                ? "Zuchtkatze Ragdoll Juliet in Farbe blue bicolor, Faelis Katzenzucht Prag"
                                : "Breeding female Ragdoll cat Juliet in color blue bicolor, Faelis cattery Prague"
                            }
                          />
                        </AspectRatio>
                        <Title order={2} size="h2" c="dark" mt={16} ta="center">
                          {t.cats.categories.cats}
                        </Title>
                        <Text c="dimmed" ta="center">
                          {t.cats.categories.more}
                        </Text>
                      </Card>
                    </Link>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Link
                      href="/cats#male-cats"
                      style={{
                        textDecoration: "inherit",
                        color: "inherit",
                        width: "100%",
                      }}
                    >
                      <Card
                        padding="lg"
                        radius="lg"
                        bg="#d6e6f3"
                        w="100%"
                        h="100%"
                      >
                        <AspectRatio
                          ratio={3 / 4}
                          style={{
                            position: "relative",
                            aspectRatio: "3/4",
                            width: "100%",
                          }}
                        >
                          <Image
                            fill
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/George/George3.webp"
                            alt={
                              locale === "cs"
                                ? "Chovný kocour Ragdoll George v barvě blue mitted, chovatelské stanice Faelis Praha"
                                : locale === "de"
                                ? "Zuchtkater Ragdoll George in Farbe blue mitted, Faelis Katzenzucht Prag"
                                : "Breeding male Ragdoll cat George in color blue mitted, Faelis cattery Prague"
                            }
                          />
                        </AspectRatio>
                        <Title order={2} size="h2" c="dark" mt={16} ta="center">
                          {t.cats.categories.maleCats}
                        </Title>
                        <Text c="dimmed" ta="center">
                          {t.cats.categories.more}
                        </Text>
                      </Card>
                    </Link>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Link
                      href="/litters"
                      style={{
                        textDecoration: "inherit",
                        color: "inherit",
                        width: "100%",
                      }}
                    >
                      <Card
                        padding="lg"
                        radius="lg"
                        bg="#d6e6f3"
                        w="100%"
                        h="100%"
                      >
                        <AspectRatio
                          ratio={3 / 4}
                          style={{
                            position: "relative",
                            aspectRatio: "3/4",
                            width: "100%",
                          }}
                        >
                          <Image
                            fill
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Ori.webp"
                            alt={
                              locale === "cs"
                                ? "Ragdoll koťátko Orianna v barvě blue bicolor, chovatelské stanice Faelis"
                                : locale === "de"
                                ? "Ragdoll Kätzchen Orianna in Farbe blue bicolor, Faelis Katzenzucht"
                                : "Ragdoll kitten Orianna in color blue bicolor, Faelis cattery"
                            }
                          />
                        </AspectRatio>
                        <Title order={2} size="h2" c="dark" mt={16} ta="center">
                          {t.cats.categories.kittens}
                        </Title>
                        <Text c="dimmed" ta="center">
                          {t.cats.categories.more}
                        </Text>
                      </Card>
                    </Link>
                  </Grid.Col>
                </Grid>
              </Stack>
            </FullscreenBackroundSection>
            <FullscreenBackroundSection image="https://images.unsplash.com/photo-1586417752912-b0389b445a20?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
              <Stack align="center" w="100%" maw={960} gap={48} py={32}>
                <Title order={2} size="h1" ta="center">
                  {t.facts.heading}
                </Title>
                <Grid w="100%" gutter={32}>
                  <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
                    <Card
                      h="100%"
                      style={{ justifyContent: "center" }}
                      radius="lg"
                    >
                      <Text fw={700} fz={24} c="dark" ta="center">
                        {t.facts.stat1.number}
                      </Text>
                      <Text c="dark" ta="center">
                        {t.facts.stat1.text}
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
                        {t.facts.stat2.number}
                      </Text>
                      <Text c="dark" ta="center">
                        {t.facts.stat2.text}
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
                        {t.facts.stat3.number}
                      </Text>
                      <Text c="dark" ta="center">
                        {t.facts.stat3.text}
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
                        {t.facts.stat4.number}
                      </Text>
                      <Text c="dark" ta="center">
                        {t.facts.stat4.text}
                      </Text>
                    </Card>
                  </Grid.Col>
                </Grid>
                <Link
                  href="/about"
                  style={{ textDecoration: "inherit", color: "inherit" }}
                >
                  <Button
                    color="#47a3ee"
                    size="compact-lg"
                    fw={400}
                    px={24}
                    w={{ base: "100%", sm: "fit-content" }}
                  >
                    {t.facts.button}
                  </Button>
                </Link>
              </Stack>
            </FullscreenBackroundSection>
          </Stack>

          <Stack align="center" w="100%" gap={32}>
            <Title order={2} size="h1" c="#47a3ee" ta="center">
              {t.reviews.heading}
            </Title>
            <Text size="lg" c="black" ta="center">
              {t.reviews.subtext}
            </Text>
            <Flex w="100dvw" justify="center" align="center">
              <Marquee pauseOnHover>
                <Flex w="100%" gap={32} mr={32} align="stretch">
                  {reviews.map((review) => (
                    <Card
                      key={review.id}
                      radius="lg"
                      padding="lg"
                      bg="#d6e6f3"
                      w={{ base: 320, sm: 400 }}
                    >
                      <Stack gap={16}>
                        <Group>
                          <Avatar
                            name={review.owner}
                            color="initials"
                            size={48}
                          />
                          <Stack gap={0}>
                            <Text fw={400} c="black">
                              {review.owner}
                            </Text>
                            <Group gap={4} align="center">
                              <IconCat
                                size={18}
                                style={{ marginBottom: 2 }}
                                stroke={2.5}
                              />
                              <Text fw={700} c="black">
                                {review.cat_name}
                              </Text>
                            </Group>
                          </Stack>
                        </Group>
                        <Text fw={500} c="dark" fz={14}>
                          {review.review[locale as keyof typeof review.review]}
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </Flex>
              </Marquee>
            </Flex>
          </Stack>
          <FullscreenBackroundSection>
            <Stack align="center" w="100%" maw={720} py={32}>
              <Title order={2} size="h1" c="dark" ta="center">
                {t.contact.heading}
              </Title>
              <Text size="lg" c="black" ta="center">
                {t.contact.subtext}
              </Text>
              <Link
                href="/litters"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                <Button
                  color="#47a3ee"
                  size="compact-lg"
                  fw={400}
                  px={24}
                  w={{ base: "100%", sm: "fit-content" }}
                >
                  {t.contact.button}
                </Button>
              </Link>
            </Stack>
          </FullscreenBackroundSection>

          <Form />
        </Stack>
      </Stack>
    </>
  );
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  try {
    const heroImage = await getHeroImage("home");

    return {
      props: {
        heroImage,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        heroImage: null,
      },
      revalidate: 60,
    };
  }
};
