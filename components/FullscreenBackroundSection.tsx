import { Card, Flex, Overlay } from "@mantine/core";
import { ReactNode } from "react";

export function FullscreenBackroundSection({
  children,
  image,
}: {
  children: ReactNode;
  image?: string;
}) {
  return (
    <Card
      py="5vh"
      px={32}
      radius={0}
      w="100vw"
      style={{
        position: "relative",
        left: 0,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        gap: 48,
        background: "#ebf1f7",
        backgroundImage: `url(${image ? image : "/images/Tlapky-bg.svg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      c="white"
    >
      {image && <Overlay color="#000" backgroundOpacity={0.65} zIndex={0} />}
      <Flex style={{ zIndex: 1 }}>{children}</Flex>
    </Card>
  );
}
