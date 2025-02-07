import {
  AspectRatio,
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const smallWindow = useMediaQuery("(max-width: 1200px)");

  return (
    <Stack w="100%" gap={0} mt={64}>
      <Card
        radius={0}
        w="100%"
        px={32}
        py="5vh"
        style={{
          background: "#324554",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderTop: "8px solid #47a3ee",
          borderBottom: "8px solid #47a3ee",
        }}
      >
        <Flex
          maw={1280}
          mx="auto"
          w="100%"
          gap={smallWindow ? 16 : 64}
          direction={smallWindow ? "column" : "row"}
        >
          <Stack w="100%">
            <Text c="white" fz={32} fw={700} ta="center">
              Kde nás naleznete?
            </Text>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://frame.mapy.cz/s/lulolovofa"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ borderRadius: 16 }}
              />
            </AspectRatio>
          </Stack>
          <Stack w="100%" align="start" justify="center">
            <Title order={4} c="white" fz={32} style={{ letterSpacing: 1 }}>
              Faelis - Chovatelská stanice koček Ragdoll
            </Title>
            <Stack gap={0} align="start" justify="start" c="white">
              <Text fw={700}>Marta Seko</Text>
              <Text>Nad Nádrží 433/16</Text>
              <Text>10 300 | Praha 10</Text>
            </Stack>
            <Divider w="75%" />
            <Stack gap={0} align="start" justify="start" c="white">
              <Text>
                E-mail:{" "}
                <Text span fw={700} td="underlline">
                  <Link
                    href="mailto:marta@ragdolls.cz"
                    style={{
                      color: "inherit",
                      whiteSpace: "nowrap",
                    }}
                  >
                    marta@ragdolls.cz
                  </Link>
                </Text>
              </Text>
              <Text>
                Telefon:{" "}
                <Text span fw={700} td="underlline">
                  <Link
                    href="tel:+420 602 278 682"
                    style={{
                      color: "inherit",
                      whiteSpace: "nowrap",
                    }}
                  >
                    +420 602 278 682
                  </Link>
                </Text>
              </Text>{" "}
              <Text>
                Skype:{" "}
                <Text span fw={700} td="underline">
                  ragdoll.faelis
                </Text>
              </Text>
              <Text>
                Podrobné Kontakty naleznete{" "}
                <Text span fw={700} td="underlline">
                  <Link
                    href="/kontakt"
                    style={{
                      color: "inherit",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ZDE!
                  </Link>
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </Card>
      <Stack align="center" justify="center" p={16} gap={8}>
        <Text>
          Faelis - chovatelská stanice © 2002 Všechna práva vyhrazena.
        </Text>
        <Text>Designed by: paryn design & sanchez design</Text>
      </Stack>
    </Stack>
  );
};

export default Footer;
