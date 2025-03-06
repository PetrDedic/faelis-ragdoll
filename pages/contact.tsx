import {
  AspectRatio,
  Button,
  Card,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { LeftImageSection } from "../components/LeftImageSection";
import Link from "next/link";

export default function ContactPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        backgroundImage="https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading="Jak nás nejlépe kontaktovat a kde nás přesně naleznete?"
      />
      <Stack
        px={32}
        py={128}
        justify="center"
        align="center"
        gap={64}
        maw={1280}
        mx="auto"
        w="100%"
      >
        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Chovatelská stanice koček Ragdoll - kontakt
          </Title>
          <LeftImageSection
            image="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            heading="Marta Seko"
            subtext={
              <Stack gap={0} align="start" justify="start">
                <Text>Nad Nádrží 433/16</Text>
                <Text>10300 Praha 10</Text>
                <br />
                <Text fz={20}>
                  Telefon:{" "}
                  <Text span fw={700} td="underlline" fz={20}>
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
                </Text>
                <Text fz={20}>
                  E-mail:{" "}
                  <Text span fw={700} td="underlline" fz={20}>
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
                <Text fz={20}>
                  Skype:{" "}
                  <Text span fw={700} td="underlline" fz={20}>
                    <Text span fw={900} fz={20} td="underline">
                      ragdoll.faelis
                    </Text>
                  </Text>
                </Text>
              </Stack>
            }
          />
        </Stack>

        <Stack w="100%" align="center" gap={16}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Kde nás přesně naleznete?
          </Title>
          <Text fz={20} ta="center">
            Nad Nádrží 433/16 | 10300 Praha 10
          </Text>
          <AspectRatio ratio={21 / 9} w="100%">
            <iframe
              src="https://frame.mapy.cz/s/lulolovofa"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ borderRadius: 16 }}
            />
          </AspectRatio>
        </Stack>
      </Stack>
    </Stack>
  );
}
