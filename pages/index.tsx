import { Flex, Stack } from "@mantine/core";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";

const images = {
  top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  middle:
    "https://images.unsplash.com/photo-1643431784519-6a3e9b1cfd51?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  right:
    "https://images.unsplash.com/photo-1629068136524-f467f8efa109?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function IndexPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center">
      <HeroImageBackground
        heading="Vítejte na stránkách Faelis"
        subtext="Jsme nejlepší a jediná chovatelská stanice plemene Ragdoll v České Republice."
      />
      <Stack maw={960} mx={16} gap={64}>
        <Flex style={{ position: "relative", top: -72, zIndex: 2 }}>
          <FeaturesCards
            cards={[
              {
                icon: "/images/Domek_Tlapka.svg",
                text: "Bezpečné a útulné místo pro kočky.",
              },
              {
                icon: "/images/Srdce.svg",
                text: "Zdraví a péče na prvním místě..",
              },
              {
                icon: "/images/Kalendar.svg",
                text: "Dlouholetá praxe a zkušenost.",
              },
            ]}
          />
        </Flex>
        <LeadGrid
          images={images}
          heading="O chovatelské stanici koček Faelis"
          subtext="Zde bude text, k danému tématu, které se zde potom doplní. Zde bude text, k danému tématu, které se zde potom doplní."
          button={{
            label: "Zjistit více",
            onClick: () => console.log("Button clicked"),
          }}
        />
      </Stack>
    </Stack>
  );
}
