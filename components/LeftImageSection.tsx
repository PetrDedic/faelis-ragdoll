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
  AspectRatio,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactNode } from "react";

interface LeadGridProps {
  image: string;
  heading: string;
  subtext: string | ReactNode;
  button?: {
    label: string;
    onClick: () => void;
  };
}

export function LeftImageSection({
  image,
  heading,
  subtext,
  button,
}: LeadGridProps) {
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%">
      <AspectRatio ratio={4 / 2}>
        <Flex gap="md" align="stretch" w="100%">
          <BackgroundImage
            src={image}
            w="100%"
            h="100%"
            radius="lg"
            style={{ objectFit: "cover", backgroundPosition: "center" }}
          >
            <Box w="100%" h="100%" />
          </BackgroundImage>
        </Flex>
      </AspectRatio>

      <Stack gap={smallWindow ? "md" : "xl"} justify="center">
        <Title order={2} size="h1" c="#47a3ee">
          {heading}
        </Title>
        <Text size="lg">{subtext}</Text>
        {button && (
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
        )}
      </Stack>
    </SimpleGrid>
  );
}
