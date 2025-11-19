import {
  SimpleGrid,
  Text,
  Title,
  Button,
  Stack,
  Flex,
  Box,
} from "@mantine/core";
import Image from "next/image";

interface LeadGridProps {
  images: {
    top: string;
    middle: string;
    right: string;
  };
  heading: string;
  subtext: string;
  button: {
    label: string;
    onClick: () => void;
  };
}

export function LeadGrid({ images, heading, subtext, button }: LeadGridProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%">
      <Flex gap="md" align="stretch" w="100%" mih={320}>
        <Stack w="100%" h="100%" gap="md">
          <Box w="100%" h="100%" pos="relative">
            <Image
              src={images.top}
              alt={`${heading} top image`}
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
              alt={`${heading} right image`}
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
            alt={`${heading} middle image`}
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

      <Flex direction="column" gap={{ base: "md", lg: "xl" }} justify="center">
        <Title order={2} size="h1" c="#47a3ee">
          {heading}
        </Title>
        <Text size="lg">{subtext}</Text>
        <Button
          color="#47a3ee"
          size="compact-lg"
          fw={400}
          px={24}
          onClick={button.onClick}
          w={{ base: "100%", sm: "fit-content" }}
        >
          {button.label}
        </Button>
      </Flex>
    </SimpleGrid>
  );
}
