import {
  AspectRatio,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { HeroImageBackground } from "../components/HeroImageBackground";
import { FeaturesCards } from "../components/FeaturesCards";
import { LeadGrid } from "../components/LeadGrid";
import { FullscreenBackroundSection } from "../components/FullscreenBackroundSection";
import { Form } from "../components/Form";
import { CatInfo } from "../components/CatInfo";
import { LeftImageSection } from "../components/LeftImageSection";
import RagdollColorsCarousel from "../components/RagdollColorsCarousel";
import RagdollVarietiesSection from "../components/RagdollVarietiesSection";
import RagdollGeneticsSection from "../components/RagdollGeneticsSection";
import RagdollBloodGroupsSection from "../components/RagdollBloodGroupsSection";
import Link from "next/link";

const images = {
  top: "https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  middle:
    "https://images.unsplash.com/photo-1643431784519-6a3e9b1cfd51?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  right:
    "https://images.unsplash.com/photo-1629068136524-f467f8efa109?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function RagdollPage() {
  return (
    <Stack w="100%" gap={0} align="center" justify="center" maw="100%">
      <HeroImageBackground
        heading="Veškeré zajímavosti a historie o plemeni kočky Ragdoll"
        subtext="I ta nejrozvážnější kočka je schopna půl hodiny jen tak blbnout."
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
            O plemeni kočky Ragdoll
          </Title>
          <Text size="lg" c="black">
            Kočky plemene Ragdoll se řadí mezi polodlouhosrsté kočky a je to
            poměrně mladé plemeno o jehož vzniku se dozvíte více v historii
            plemene Ragdoll. Ragdoll je jedním z nejmilejších a
            nejdobromyslnějších plemen, které mezi plemeny koček najdete. Říká
            se o něm, že má psí povahu a je pravdou, že Ragdoll rád aportuje a
            také se snadno naučí chodit na procházky v postrojku. Řadí se mezi
            největší plemena koček, ale podle mého názoru chovného Ragdol
            kocoura o váze 8 kilo a víc dnes už těžko uvidíte, přestože
            literatura udává až 10 kg. Ovšem jeden Ragdoll se dostal až do
            Guinnesovy knihy rekordů v roce 1986 jako největší kočka domácí na
            světě. Jeho jméno je Ragtime Bartholomew a můžete ho vidět na
            obrázku dole (žil od 18.5.1980 - 18.10.1991).
          </Text>
          <Grid w="100%" gutter={32}>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <AspectRatio ratio={4 / 3}>
                <Image
                  radius="md"
                  src="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              </AspectRatio>
            </Grid.Col>
          </Grid>
          <Text size="lg" c="black">
            Historky o tom, že kočka Ragdoll necítí bolest tak jako ostatní
            kočky je nesmyslná pověra. Ragdoll je pouze velice důvěřivý k lidem
            i ostatním zvířatům. Péče o srst Ragdola není nijak náročná, protože
            jeho hedvábná srst nemá sklony k plstnatění. Stačí ho jednou týdně
            vykartáčovat, ovšem v období ínání může být potřeba česání i každý
            den.
          </Text>
          <Text size="lg" c="black">
            Koťata Ragdoll se rodí celá bílá a až po pár dnech se začínají
            vybarvovat. Vybarvování Ragdolla končí až ve stáří 4 let, kdy je
            ukončen i jeho tělesný vývin.
          </Text>
        </Stack>
        <FullscreenBackroundSection>
          <Stack align="center" w="100%" maw={720} py={32}>
            <Title order={2} size="h1" c="dark" ta="center">
              Mám zájem o svou kočičku
            </Title>
            <Text size="lg" c="black" ta="center">
              Pokud máte zájem zakoupit jednu z našich kočiček, tak nás
              kontaktujte pomocí telefonního čísla a nebo na níže uvedeném
              formuláři.
            </Text>
            <Button
              color="#47a3ee"
              size="compact-lg"
              fw={400}
              px={24}
              w={{ base: "100%", sm: "fit-content" }}
            >
              Zjistit více
            </Button>
          </Stack>
        </FullscreenBackroundSection>
        <Stack w="100%" align="center" gap={32}>
          <Text size="lg" c="black">
            Dle standartu má být Ragdoll svalnatá a velká kočka se silnými
            kostmi, plným hrudníkem, krátkým a mohutným krkem. Nohy jsou středně
            dlouhé, zadní o něco vyšší. Velké tlapy mají kulatý tvar a mezi
            prsty vyrůstají chomáčky chlupů. Délka ocasu je úměrná k tělu. Hlava
            je klínovitá s pevnou, silnou bradou. Středně velké uši jsou
            posazeny dále od sebe a mají zaoblené vrcholky. Nos je mírně
            prohnutý, oči velké, oválné a vždy modré.
          </Text>
          <LeftImageSection
            image="https://images.unsplash.com/photo-1682737398935-d7c036d5528a?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            heading="Jaký je přesný standart FIFe pro plemeno Ragdoll?"
            subtext="Od roku 2011 bude platit pozměněný standart, více se o novém standartu pro plemeno Ragdoll dozvíte v zápisu z generálního zasedání FIFe."
            button={{
              label: "Zjistit více",
              onClick: () => console.log("Button clicked"),
            }}
          />
        </Stack>

        <Divider w="100%" />

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Historie plemena Ragdoll
          </Title>
          <Text size="lg" c="black">
            Ragdoll je poměrně mladé plemeno, které vzniklo na počátku 60.let
            Annou Baker, chovatelkou koček z Riverside v Kalifornii. Prapředkem
            plemene je Josephina, bílá kočka perského typu, která byla v majetku
            sousedky Anny Baker, paní Pennels. Říká se, že Josephina v době
            březosti spadla pod auto a nehodu zázračně přežila. Podle paní Baker
            proměnila tato traumatická událost Josephinu v extrémně povolnou
            kočku. Když ji zvedli ze země, uvolnila se jako hadrová panenka
            (ragdoll) a nechala si skoro všechno líbit, aniž by se bránila.
          </Text>
          <Text size="lg" c="black">
            Všechna koťata, která se jí potom narodila, získala podle ní tuto
            její novou "povahu" a na to kladla Anna Baker důraz při zakládání
            nového plemene. Samozřejmě vnější vlivy (jako je autonehoda) nemohou
            ovlivnit povahové vlastnosti potomků Josephiny, ty jsou ovlivněny
            pouze genetikou a výběrem jedinců do dalšího chovu tak, že byl
            kladen důraz na povahové vlastnosti vybrané kočky.
          </Text>
          <Text size="lg" c="black">
            Základ plemene tvořily tři kočky: Daddy Warbucks, Fugiana a
            Buckwheat (koťata od Josephiny z jednoho vrhu). Josephinu její
            majitel pan Pennels při dalším vrhu zlikvidoval i s koťaty.
          </Text>
        </Stack>

        <Divider w="100%" />

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Barvy plemena Ragdoll
          </Title>
          <Text size="lg" c="black">
            Ragdoll je ve čtyřech základních barvách: seal (černohnědé odznaky),
            blue (modré odznaky), chocolate (čokoládové odznaky), lilac (lilové
            odznaky). Další barvy vznikají kombinací základních barev s červenou
            barvou, s kresbou lynx tabby), případně s oběma s červenou barvou a
            kresbou lynx dohromady. Oči Ragdoll kočky musí být vždy modré - čím
            modřejší barva, tím lepší.
          </Text>
          <Text size="xs" c="dimmed">
            Na fotky mám autorská práva ( u pár kousků mám svolení od jejich
            majitelů). Nekopírujte je tedy aniž by jste se předem zeptali.
          </Text>
          <RagdollColorsCarousel />
          <Text size="lg" c="black">
            Barvy lilac a chocolate jsou vzácnější proto, že barvy seal a blue
            jsou dominantní, což znamená,že pokud je v rodokmenu barva lila nebo
            čoko u prarodičů, praprarodičů a dále, je velmi malá pravděpodobnost
            toho, že by potomek byl nosič čokolády a lila (zde musím podotknout,
            že správně se říká: nosič ředícího genu pro lilové zbarvení). To, že
            by takový potomek byl přímo v jedné z těchto barev je pravděpodobné
            asi tak, jako získat jackpot ve Sportce. Ale cena za tyto barvy je
            vyšší jen u chovných koček, u mazlíčků se cena nerozlišuje podle
            barvy.
          </Text>
          <Text size="lg" c="black">
            Také barvený vzhled kočky většinou mnoho nenapoví o skutečné barvě,
            která bude geneticky předávána dál potomkům. Nejjednodušší způsob
            jak si to ověřit je genetický test barvy, který lze velmi snadno
            nechat své kočce udělat například v Německu, v laboratořích Laboklin
            nebo Biofocus. Není třeba žádný odběr krve, stačí stěr z tlamky,
            který zvládne každý chovatel sám. Ráda poradím každému, kdo by o
            tento genetický test barvy měl zájem. Cena testu je asi 1500 Kč, což
            není tak vysoká částka vzhledem k tomu, za kolik jsou prodávány
            Ragdoll kočky v barvách chocolate a lilac nebo Ragdoll kočky -
            nosiči čokolády a lila.
          </Text>
          <Text size="lg" c="black" fw={900} ta="center">
            Stejnými testy se zjišťuje také geneticky HCM a PKD.
          </Text>
          <Text size="lg" c="black">
            Tímto testem si chráníme (stejně jako chovatelská stanice Orlitia,
            od které máme čokoládovou kočičku Caity s genetickým testem barvy)
            dobré jméno při prodeji koťat do chovu, která prezentujeme jako
            čokoládové, lilové nebo nosiči čokolády a lila. Sama vím, jaké
            zklamání člověk prožije, když zakoupené kotě nemá tu barvu, kterou
            člověk chtěl do svého chovu mít...nemluvě o zvýšené ceně za kotě
            kvůli atraktivnosti barvy.
          </Text>
          <Text size="lg" c="black">
            Jako příklad uvádím vlastní smutnou zkušenost, kdy jsem zakoupila v
            USA naši Penny jako 100% čokoládovou lynx ragdoll kočku. Hned její
            první vrh ukázal, že něco není v pořádku, protože s naším lilovým
            kocourem se narodila koťata, která byla seal. Tehdy jsem poprvé
            využila možnost genetického testu barvy a bohužel pro nás ukázal, že
            Penny není čokoládová a není ani nosič čokolády, přestože její matka
            je v USA vedená jako čokoládová (po výsledku testu je jasné, že
            matka Penny taky není čokoládová). Proto od té doby vždy, pokud není
            matka o otec přímo lila nebo čoko, vyžaduji tento genetický test
            barvy, abych již nemohla být oklamána při prodeji kotěte.
            <br />
            Nutno dodat, že v tomto případě chovatelka z USA neměla v úmyslu mne
            klamat, protože Penny je opravdu vzhledově (fenotyp) vedena v
            rodokmenu jako čokoládová lynx, protože posuzovatelé na výstavách
            její barvu takto hodnotí.
          </Text>
        </Stack>

        <Divider w="100%" />

        <RagdollVarietiesSection />

        <Divider w="100%" />

        <RagdollGeneticsSection />

        <Divider w="100%" />

        <RagdollBloodGroupsSection />

        <Divider w="100%" />

        <Stack w="100%" align="center" gap={32}>
          <Title order={2} size="h1" c="#47a3ee" ta="center">
            Zdraví a nemoci Ragdoll
          </Title>
          <Text size="lg" c="black">
            Zdraví je pro člověka to nejcennější a nejinak je tomu u koček a
            všeobecnně všech živých tvorů. Rozdíl je v tom, že člověk dokáže
            říct, co ho trápí a kde ho co bolí. To kočka neumí a naopak spíše
            svoje zdravotní problémy skrývá před okolním světem. Proto je
            důležité ji sledovat, vnímat její chování a také její celkový
            vzhled. Každá změna má nějaký důvod a je potřeba na něj přijít.
          </Text>
          <Text size="lg" c="black">
            Nemocí koček je spousta a já se chci spíše s vámi podělit o své
            zkušenosti než jen popisovat jednostlivé nemoci. Ale samozřejmě je
            potřeba je znát a tak uvádím odkaz na stránku, kde je toto téma
            důkladně rozebráno:{" "}
            <Text
              component="a"
              href="http://www.kocky-online.cz/jportal/articles.phtml?way=home&id=12&pohlavi=&kastrat=&region=&vek=&op=topic&sw=&article_type=&authors_type=&utulek_id=&isForm=true&handicap=&pagenr=1&step=100"
              target="_blank"
              c="blue"
            >
              Kočičí nemoci
            </Text>
          </Text>
          <Text size="lg" c="black">
            Když budu popisovat jakékoliv své zkušenosti, tak to neznamená, že
            někdo nemohl mít zkušenosti jiné a také také si nechci hrát na
            chytrou. Vždy platí zásada, že je lepší jedna zbytečná návštěva
            veterináře než něco promeškat.
            <br />
            Podle mne je první řadě důležitá každodenní zdravotní prohlídka,
            kterou člověk dělá v podstatě automaticky tím, že kočce zkontroluje
            a případně otře oči (já používám Opthal Septonex, ale i převařená
            voda je dobrá), koukne se do uší (já je čistím 1 x týdně pokud není
            žádný problém - kapky nebo gel koupíte u veterináře). Když kočku
            nebo kotě vezmu do náruče a pomazlím ji, tak se při tom podívám na
            zadeček, jestli je pěkně čisťounký. Při hlazení vnímám jaká je srst
            na dotek, protože změna kvality srsti může být prvním signálem, že
            něco není s kočkou v pořádku. Když se mi zdá, že srst zhrubla a
            zamtněla, tak zvýším ostražitost a více kočku sleduji, jestli si
            nevšimnu nějaké další změny a podle toho se zařídám dál.
          </Text>
          <Text size="lg" c="black">
            Na těchto stránkách Veterinární kliniky NISA jsem našla opravdu
            ucelnený přehled péče o kočku, sledování jejího zdravotního stavu a
            popis jednotlivých nemocí. Vřele doporučuji přečíst!!
            <br />
            <Text
              component="a"
              href="http://www.vetonline.cz/pece-o-kocku-nemoci-kocek"
              target="_blank"
              c="blue"
            >
              Péče o kočku a nemoci koček
            </Text>
          </Text>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
}
