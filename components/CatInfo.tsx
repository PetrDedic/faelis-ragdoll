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
import Image from "next/image";
import { ReactNode } from "react";

interface LeadGridProps {
  images: {
    top: string;
    middle: string;
    right: string;
  };
  name: string | ReactNode;
  info: string | ReactNode;
  catName: string;
}

export function CatInfo({ images, name, info, catName }: LeadGridProps) {
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%" mih={320}>
      <Flex gap="md" align="stretch" w="100%">
        <Stack w="100%" h="100%" gap="md">
          <Box w="100%" h="100%" pos="relative">
            <Image
              src={images.top}
              alt={`${catName} top image`}
              fill
              sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                backgroundPosition: "center",
                borderRadius: "var(--mantine-radius-lg)",
              }}
            />
          </Box>
          <Box w="100%" h="100%" pos="relative">
            <Image
              src={images.right}
              alt={`${catName} right image`}
              fill
              sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                backgroundPosition: "center",
                borderRadius: "var(--mantine-radius-lg)",
              }}
            />
          </Box>
        </Stack>
        <Box w="100%" h="100%" pos="relative">
          <Image
            src={images.middle}
            alt={`${catName} middle image`}
            fill
            sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              backgroundPosition: "center",
              borderRadius: "var(--mantine-radius-lg)",
            }}
          />
        </Box>
      </Flex>

      <Stack gap={smallWindow ? "md" : "xl"} justify="center">
        <Title order={2} size="h1" c="black">
          {name}
        </Title>
        {info}
      </Stack>
    </SimpleGrid>
  );
}
