import { Card, Flex, SimpleGrid, Text } from "@mantine/core";
import Image from "next/image";

interface FeaturesCardsProps {
  icon: string;
  text: string;
}

export function FeaturesCards({ cards }: { cards: FeaturesCardsProps[] }) {
  const features = cards.map((card, index) => (
    <Card
      key={index}
      style={{
        boxShadow: "0px 0px 15px 0px rgba(0,0,0,0.25)",
        alignItems: "center",
        justifyContent: "center",
      }}
      radius="lg"
      padding="xl"
    >
      <Flex w="100%" gap={16} align="center">
        <Image
          src={card.icon}
          alt={card.icon}
          style={{ objectFit: "contain" }}
          width={48}
          height={48}
        />
        <Text fz={20}>{card.text}</Text>
      </Flex>
    </Card>
  ));

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
      {features}
    </SimpleGrid>
  );
}
