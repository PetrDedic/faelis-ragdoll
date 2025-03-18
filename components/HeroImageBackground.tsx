import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  Overlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

interface HeroButton {
  label: string;
  variant?: string;
  onClick?: () => void;
  // You can add more button props as needed
}

interface HeroImageBackgroundProps {
  heading: string;
  highlightedText?: string;
  subtext?: string;
  buttons?: HeroButton[];
  backgroundImage?: string;
  backgroundPosition?: string;
}

export function HeroImageBackground({
  heading,
  highlightedText,
  subtext,
  buttons,
  backgroundImage = "https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  backgroundPosition = "center",
}: HeroImageBackgroundProps) {
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <BackgroundImage
      src={backgroundImage}
      h={{ base: 500, xs: 600 }}
      style={{ position: "relative" }}
      styles={{ root: { backgroundPosition } }}
    >
      <Overlay color="#000" opacity={1} zIndex={1} />

      <Stack
        justify="center"
        align="center"
        h="100%"
        pos="relative"
        style={{ zIndex: 2 }}
        px="md"
      >
        <Title
          px={16}
          order={1}
          size={smallWindow ? 32 : 48}
          fw={800}
          ta={{ base: "left", sm: "center" }}
          c="white"
          style={{ letterSpacing: 1 }}
          maw={1024}
        >
          {heading}{" "}
          {highlightedText && (
            <Text span inherit c="primary.4">
              {highlightedText}
            </Text>
          )}
        </Title>

        <Container size={560}>
          <Text fz={24} c="gray.0" ta={{ base: "left", sm: "center" }}>
            {subtext}
          </Text>
        </Container>

        {buttons && (
          <Flex
            gap="md"
            justify="center"
            direction={{ base: "column", sm: "row" }}
            mt="xl"
            w={{ base: "100%", sm: "auto" }}
          >
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || (index === 0 ? "white" : "default")}
                size="lg"
                w={{ base: "100%", sm: "auto" }}
                onClick={button.onClick}
                style={
                  index !== 0
                    ? (theme) => ({
                        color: theme.white,
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.45)",
                        },
                      })
                    : undefined
                }
              >
                {button.label}
              </Button>
            ))}
          </Flex>
        )}
      </Stack>
    </BackgroundImage>
  );
}
