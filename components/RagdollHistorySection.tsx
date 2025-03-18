import {
  Title,
  Text,
  Stack,
  Grid,
  Image,
  Card,
  Divider,
  Timeline,
  Group,
  Box,
  AspectRatio,
  Badge,
} from "@mantine/core";
import { useRouter } from "next/router";

// Import history-specific translations
import csHistoryTranslations from "../locales/cs/history.json";
import enHistoryTranslations from "../locales/en/history.json";
import deHistoryTranslations from "../locales/de/history.json";

const RagdollHistorySection = () => {
  const router = useRouter();
  const { locale } = router;

  // Create a translations object with all history-specific locales
  const historyTranslations = {
    cs: csHistoryTranslations,
    en: enHistoryTranslations,
    de: deHistoryTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    historyTranslations[locale as keyof typeof historyTranslations] ||
    historyTranslations.cs;

  // Foundation cats with details
  const foundationCats = [
    {
      name: "Floppy (Raggedy Ann Red Rider)",
      description:
        t.cats?.floppy ||
        "Floppy, born August 23, 1967, was a seal bicolor male. Originally named Red Rider, he was sold to another breeder who had him declawed on all four paws and later returned him. The Daytons rescued him, recognizing his extraordinary beauty despite his poor condition. Floppy helped showcase the true Ragdoll temperament.",
      variety: "Seal Bicolor",
      birthdate: "1967-08-23",
      parents: "Raggedy Ann Fugianna × Raggedy Ann Kyoto",
      image: "/img/historie_logo.jpg",
    },
    {
      name: "Pip (Blossom-Time Pip)",
      description:
        t.cats?.pip ||
        "Pip, born December 19, 1971, was a seal mitted male with perfect markings. Originally purchased as a birthday gift but returned, he was destined for a show career. He loved exhibitions and appeared in many magazines, attending 79 shows over 8 years before being sold to an East Coast breeder.",
      variety: "Seal Mitted",
      birthdate: "1971-12-19",
      parents: "Miss Chef of Blossom-Time × Raggedy Ann Buddy of Blosoom-Time",
      image: "/img/historie_logo.jpg",
    },
    {
      name: "Happy (Blosoom-Time Happy)",
      description:
        t.cats?.happy ||
        "Happy, born October 21, 1973, was a seal colorpoint male. Only 8 months old in the iconic photo but already large for his age, he loved people and was very affectionate. Despite being a breeding male, he was friendly with everyone, embodying the loving and trusting Ragdoll temperament.",
      variety: "Seal Colorpoint",
      birthdate: "1973-10-21",
      parents: "Lolita of Blossom-Time × Raggedy Ann Buddy of Blossom-Time",
      image: "/img/historie_logo.jpg",
    },
  ];

  return (
    <Stack w="100%" align="center">
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        {t.title}
      </Title>

      {/* Introduction */}
      <Stack w="100%" gap={24}>
        <Text size="lg" c="black">
          {t.paragraph1}
        </Text>

        <Grid gutter={24}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <AspectRatio ratio={21 / 9}>
              <Image
                radius="md"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Historie%20RAG/historie_josephine.jpg"
                alt="Josephine, the founding cat of the Ragdoll breed"
              />
            </AspectRatio>
            <Text size="sm" c="dimmed" ta="center" pt={8}>
              {t.images?.josephine || "Josephine and her kittens"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Text size="lg" c="black">
              {t.paragraph2}
            </Text>
            <Text size="lg" c="black" mt={16}>
              {t.paragraph3}
            </Text>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Timeline of the breed */}
      <Stack w="100%" py={32} align="center">
        <Title order={3} size="h3" c="#47a3ee" mb={32} ta="center">
          {t.timelineTitle || "Timeline of the Ragdoll Breed"}
        </Title>
        <Timeline active={-1} bulletSize={24} lineWidth={2} color="#47a3ee">
          <Timeline.Item title="1960s" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.sixties ||
                "Ann Baker began developing the Ragdoll breed in Riverside, California."}
            </Text>
          </Timeline.Item>
          <Timeline.Item title="1967" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.sixtySeven ||
                "Birth of Floppy (Raggedy Ann Red Rider), a seal bicolor who would later become part of the iconic Ragdoll image."}
            </Text>
          </Timeline.Item>
          <Timeline.Item title="1969" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.sixtyNine ||
                "Laura and Denny Dayton purchased their first breeding pair, Rosie and Buddy, from Ann Baker, establishing important bloodlines."}
            </Text>
          </Timeline.Item>
          <Timeline.Item title="1971" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.seventyOne ||
                "Birth of Pip (Blossom-Time Pip), a seal mitted male who would have an illustrious show career."}
            </Text>
          </Timeline.Item>
          <Timeline.Item title="1973" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.seventyThree ||
                "Birth of Happy (Blosoom-Time Happy), a seal colorpoint who completed the trio in the famous Ragdoll photograph."}
            </Text>
          </Timeline.Item>
          <Timeline.Item title="1986" lineVariant="solid">
            <Text c="dimmed">
              {t.timeline?.eightyFive ||
                "Ragtime Bartholomew entered the Guinness Book of Records as the largest domestic cat in the world."}
            </Text>
          </Timeline.Item>
        </Timeline>
      </Stack>

      {/* Foundation cats gallery */}
      <Stack w="100%" gap={32}>
        <Title order={3} size="h3" c="#47a3ee" ta="center">
          {t.foundationTitle || "The Foundation Cats"}
        </Title>

        <Grid gutter={24}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <AspectRatio ratio={4 / 3}>
              <Image
                radius="md"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Historie%20RAG/historie_daddy_warbucks.jpg"
                alt="Daddy Warbucks"
              />
            </AspectRatio>
            <Text size="sm" c="dimmed" ta="center" pt={8}>
              Daddy Warbucks
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <AspectRatio ratio={4 / 3}>
              <Image
                radius="md"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Historie%20RAG/historie_fugianna.jpg"
                alt="Ann Baker with Fugianna"
              />
            </AspectRatio>
            <Text size="sm" c="dimmed" ta="center" pt={8}>
              Ann Baker + Fugianna
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <AspectRatio ratio={4 / 3}>
              <Image
                radius="md"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Historie%20RAG/historie_buckwheat.jpg"
                alt="Buckwheat with her kittens"
              />
            </AspectRatio>
            <Text size="sm" c="dimmed" ta="center" pt={8}>
              Buckwheat
            </Text>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* The iconic trio section */}
      <Stack w="100%" gap={32} py={32}>
        <Title order={3} size="h3" c="#47a3ee" ta="center">
          {t.iconicTitle || "The Iconic Trio"}
        </Title>

        <Grid gutter={24}>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <AspectRatio ratio={21 / 9}>
              <Image
                radius="md"
                src="https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Historie%20RAG/historie_logo.jpg"
                alt="The three legendary Ragdolls: Pip, Floppy and Happy"
              />
            </AspectRatio>
            <Text size="sm" c="dimmed" ta="center" pt={8}>
              {t.images?.logo ||
                "The three legendary Ragdolls: Pip, Floppy and Happy"}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Text size="lg" c="black">
              {t.iconicStory ||
                "After bringing these three beautiful Ragdolls together, the Daytons commissioned photographer Edward Linneman to create an image of these three representatives of the Ragdoll breed. The photographer took a total of 72 shots, from which one was selected - the now-famous image. The Daytons recall how amusing it was to keep the cats on the table and attentive. They were hidden under the table and occasionally had to gently hold the cats by their tails to prevent them from running away. Their effort was rewarded, as to this day no one else has managed to photograph all three varieties of Ragdolls together so perfectly."}
            </Text>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* The iconic cats in detail */}
      <Stack w="100%" gap={32}>
        <Title order={3} size="h3" c="#47a3ee" ta="center">
          {t.detailsTitle || "The Iconic Cats in Detail"}
        </Title>

        <Grid gutter={24}>
          {foundationCats.map((cat, index) => (
            <Grid.Col span={{ base: 12, md: 4 }} key={index}>
              <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
                <Card.Section>
                  <Stack justify="apart" mb="xs" px="lg" pt="lg">
                    <Title order={4}>{cat.name}</Title>
                    <Badge color="#47a3ee" variant="light">
                      {cat.variety}
                    </Badge>
                  </Stack>
                </Card.Section>
                <Group justify="apart" mt="md" mb="xs">
                  <Text size="sm" c="dimmed">
                    {t.born || "Born"}:{" "}
                    {new Date(cat.birthdate).toLocaleDateString(
                      locale as string,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {t.parents || "Parents"}: {cat.parents}
                  </Text>
                </Group>
                <Text size="md" mt="sm">
                  {cat.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default RagdollHistorySection;
