import {
  Grid,
  SimpleGrid,
  Text,
  Title,
  Button,
  Stack,
  BackgroundImage,
  Flex,
  Box,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactNode } from "react";

interface LeadGridProps {
  images: {
    top: string;
    middle: string;
    right: string;
  };
  name: string;
  info: string | ReactNode;
}

export function CatInfo({ images, name, info }: LeadGridProps) {
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%" mih={320}>
      <Flex gap="md" align="stretch" w="100%">
        <Stack w="100%" h="100%" gap="md">
          <BackgroundImage
            src={images.top}
            w="100%"
            h="100%"
            radius="lg"
            style={{ objectFit: "cover", backgroundPosition: "center" }}
          >
            <Box w="100%" h="100%" />
          </BackgroundImage>
          <BackgroundImage
            src={images.right}
            w="100%"
            h="100%"
            radius="lg"
            style={{ objectFit: "cover", backgroundPosition: "center" }}
          >
            <Box w="100%" h="100%" />
          </BackgroundImage>
        </Stack>
        <BackgroundImage
          mih={360}
          src={images.middle}
          w="100%"
          h="100%"
          radius="lg"
          style={{ objectFit: "cover", backgroundPosition: "center" }}
        >
          <Box w="100%" h="100%" />
        </BackgroundImage>
      </Flex>

      <Stack gap={smallWindow ? "md" : "xl"} justify="center">
        <Title order={2} size="h1" c="black">
          {name}
        </Title>
        <Text size="lg">{info}</Text>
      </Stack>
    </SimpleGrid>
  );
}
