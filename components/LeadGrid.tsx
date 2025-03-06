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
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%">
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
      </Stack>
    </SimpleGrid>
  );
}
