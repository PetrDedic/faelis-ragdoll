import React from "react";
import {
  Stack,
  Title,
  Text,
  Divider,
  Table,
  Accordion,
  Box,
  Paper,
  Group,
  Badge,
  Image,
  Alert,
  List,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";

interface BloodGroupCombination {
  combination: string;
  result: string;
  warning: boolean;
  description: string;
}

export function RagdollBloodGroupsSection() {
  // Blood group combinations and their results
  const bloodGroupCombinations: BloodGroupCombination[] = [
    {
      combination: "Aa + Aa",
      result: "Aa",
      warning: false,
      description:
        "Ideální stav, kočka i kocour jsou čisté A a ani jeden z nich nenese vlohu pro krevní skupinu B",
    },
    {
      combination: "Aa + Ab",
      result: "Aa nebo Ab",
      warning: false,
      description:
        "Všechna koťata budou mít krevní skupinu A, ale některá budou Aa a některá po otci Ab",
    },
    {
      combination: "Aa + B",
      result: "Ab",
      warning: false,
      description:
        "Všechna koťata se narodí s krevní skupinou Ab, tedy budou zároveň po otci nosiči vlohy krevní skupinu B",
    },
    {
      combination: "Ab + Aa",
      result: "Aa nebo Ab",
      warning: false,
      description:
        "Všechna koťata budou mít krevní skupinu A, ale některá budou Aa a některá po matce Ab",
    },
    {
      combination: "Ab + Ab",
      result: "Aa nebo Ab nebo B",
      warning: false,
      description:
        "Mohou se narodit koťata čistá Aa nebo nosiči béčka Ab nebo krevní skupina B",
    },
    {
      combination: "Ab + B",
      result: "Ab a B",
      warning: false,
      description:
        "Pokud je matka krevní skupina Ab a otec B, tak budou mít všechna koťata krevní skupinu Ab a B",
    },
    {
      combination: "B + Aa",
      result: "Ab",
      warning: true,
      description:
        "Kočka matka má krevní skupinu B a otec Aa - všechna koťata je třeba minimálně na 24 hodin oddělit od matky!",
    },
    {
      combination: "B + Ab",
      result: "Ab a B",
      warning: true,
      description:
        "Kočka má krevní skupinu B a otec Ab - některá koťata mohou být ohrožena a je třeba je minimálně na 24 hodin oddělit. Určit která koťata mohou být ohrožena se dá při porodu z pupečníkové krve a sady pro rychlé testy, kterou je potřeba předem zakoupit",
    },
    {
      combination: "B + B",
      result: "B",
      warning: false,
      description:
        "Oba rodiče mají krevní skupinu B, takže je vše v pořádku, jen je třeba na to upozornit zájemco o koťátka do chovu kvůli dalšímu potomstvu",
    },
  ];

  return (
    <Stack w="100%" align="center" gap={32}>
      <Title order={2} size="h1" c="#47a3ee" ta="center">
        Krevní skupiny koček Ragdoll
      </Title>

      <Text size="lg" c="black">
        Není neštěstí mít Ragdoll kočku s krevní skupinou B, jenom je třeba být
        připraven a informován a tyto informace předávat dál. Osud tomu chtěl,
        že jsme se sama přesvědčila o tom, že kočka a kocour s krevní skupinou A
        mohou mít potomka s krevní skupinou B. Proto nestačí znát jen krevní
        skupinu rodičů, je třeba ji určit u každého kotěte v chovu zvlášť aby se
        předešlo FNI (Feline neonatal isoerythrolysis).
      </Text>

      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Důležité upozornění"
        color="red"
        radius="md"
      >
        Je velmi důležité znát krevní skupinu chovných koček dříve, než se
        narodí koťátka, nejlépe je se o to zajímat již při koupi kotěte do
        chovu. Je to proto, že pokud by měla kočka krevní skupinu B a kocour by
        byl skupiny A, tak je třeba se na to připravit, aby člověk dokázal
        odchovat narozená koťátka. Koťata s krevní skupinou A, která se napijí v
        prvních 1-3 dnech od matky s krevní skupinou B, jsou postižena FNI a
        taková koťata rychle slábnou, ztrácejí zájem o sání mléka a hynou za
        příznaků žloutenky a anemie.
      </Alert>

      <Accordion variant="separated" radius="md" w="100%">
        <Accordion.Item value="testing">
          <Accordion.Control>
            <Title order={3} size="h3">
              Testování krevních skupin
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>Krevní skupina se dá určit dvěma způsoby:</Text>

              <Box>
                <Text fw={700} mb={8}>
                  1. Sérologicky
                </Text>
                <Text>
                  Veterinář odebere krev. Pokud máte dobrého veterináře, odebere
                  krev kočce bez uspání i bez oholení přední tlapky. Rozbor krve
                  na určení krevní skupiny je možné již nechat udělat i u nás, v
                  laboratoři v Plzni.
                </Text>
              </Box>

              <Box>
                <Text fw={700} mb={8}>
                  2. Geneticky
                </Text>
                <Text>
                  Buď z odebrané krve nebo ze stěru z tlamičky, což si může
                  chovatel odebrat sám. Genetické určení krevní skupiny má
                  výhodu v tom, že dokáže určit i to, jestli kočka se skupinou A
                  (případně AB) je nebo není nosičem vlohy pro krevní skupinu B.
                </Text>
                <Text mt={8} c="dimmed">
                  Nevýhodou je to, že pro plemeno Ragdoll a Turecká Van není
                  genetický test krevní skupiny stále ještě stoprocentní. Ovšem
                  pro všechna ostatní plemena ja přesný na 100%. Test stojí
                  řádově 1000 Kč (cena se možná bude různit).
                </Text>
              </Box>

              <Box>
                <Text fw={700} mb={8}>
                  Pro určení krevní skupiny u narozených koťat
                </Text>
                <Text>
                  Lze použít tzv. rychlý test z pupečníkové krve. Tento můžete
                  koupit na internetu:
                </Text>
                <List mt={8} spacing="xs">
                  <List.Item>
                    <Anchor href="http://www.alvediavet.com/" target="_blank">
                      Alvediavet
                    </Anchor>{" "}
                    - evropský výrobek, podle mých přátel ze Španělska je lepší,
                    protože je k testu potřeba menší množství krve než u testu z
                    USA
                  </List.Item>
                  <List.Item>
                    <Anchor href="http://www.rapidvet.com/" target="_blank">
                      Rapidvet
                    </Anchor>{" "}
                    - test z USA
                  </List.Item>
                </List>
              </Box>

              <Text mt={8}>
                V současné době probíhá výzkum v americké laboratoři{" "}
                <Anchor
                  href="http://www.vgl.ucdavis.edu/services/cat/ragdoll.php"
                  target="_blank"
                >
                  UC Davis
                </Anchor>
                , který by mohl určit krevní skupinu pomocí DNA i u koček
                Ragdoll a Tureckých Van, kde genetické určené krevní skupiny
                ještě stále není průkazné.
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="bloodgroups">
          <Accordion.Control>
            <Title order={3} size="h3">
              Dědičnost krevních skupin
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                U koček známe tři krevní skupiny A, AB a B. Typ A je tvořen páry
                genů A=AA (Aa) nebo A=AB (Ab), kde A je dominantní a potlačuje
                projevy B. Typ AB je vzácný a málo probádaný, je však jiný než
                kombinace Ab. Typ B je formován geny BB (B).
              </Text>

              <Box>
                <Text fw={700} mb={8}>
                  Vysvětlivky k přehledu:
                </Text>
                <Text size="sm">
                  Schéma zápisu: matka (kočka) + otec (kocour) = potomci
                  (koťata)
                </Text>
                <List mt={8} spacing="xs" size="sm">
                  <List.Item>
                    Aa = krevní skupina A bez vlohy pro krevní skupinu B
                  </List.Item>
                  <List.Item>
                    Ab = krevní skupina A s vlohou pro krevní skupinu B
                  </List.Item>
                  <List.Item>
                    B = krevní skupina B (nemůže být nositelem vlohy pro žádnou
                    jinou krevní skupinu, je to vždy jen B na obou alelách)
                  </List.Item>
                </List>
              </Box>

              <Table.ScrollContainer minWidth={1024}>
                <Table striped highlightOnHover mt={16}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Kombinace rodičů</Table.Th>
                      <Table.Th>Potomci</Table.Th>
                      <Table.Th w={64}>Riziko</Table.Th>
                      <Table.Th>Popis</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bloodGroupCombinations.map((combo, index) => (
                      <Table.Tr key={index}>
                        <Table.Td fw={500}>{combo.combination}</Table.Td>
                        <Table.Td>{combo.result}</Table.Td>
                        <Table.Td>
                          {combo.warning ? (
                            <ThemeIcon color="red" size="sm">
                              <IconCircleX size={16} />
                            </ThemeIcon>
                          ) : (
                            <ThemeIcon color="green" size="sm">
                              <IconCircleCheck size={16} />
                            </ThemeIcon>
                          )}
                        </Table.Td>
                        <Table.Td>{combo.description}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              <Anchor
                href="http://www.rfwclub.org/fblood.htm"
                target="_blank"
                mt={8}
              >
                Podrobná tabulka dědičnosti krevních skupin
              </Anchor>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="fni">
          <Accordion.Control>
            <Title order={3} size="h3">
              FNI (Feline Neonatal Isoerythrolysis)
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Při transfuzi dárce A, příjemce B a naopak po první aplikaci
                nedochází k problémům. Při chovu koček, pokud má rodičovský pár
                rozdílné krevní skupiny, panoval názor, že matka vytváří
                protilátky proti plodu, který zdědil krevní skupinu otce.
                Neodpovídá to pravdě, protože u koček protilátky neprocházejí
                placentou, ta je přirozenou barierou. Matka krevní skupiny B bez
                problémů donosí koťata krevní skupiny A.
              </Text>

              <Alert
                icon={<IconAlertCircle size={16} />}
                color="orange"
                radius="md"
              >
                <Text fw={700}>
                  Inkompatibilita se projeví až po porodu, po prvním napití se
                  kolostra.
                </Text>
                <Text mt={8}>
                  V kolostru kočky s krevní skupinou B jsou protilátky proti
                  krevní skupině A. V prvních dnech po narození koťata přijímají
                  kolostrum s protilátkami proti vlastní krevní skupině. Ty
                  procházejí střevní barierou (v prvních dnech) a ničí červené
                  krvinky kotěte. Tento stav se označuje zkratkou FNI (Feline
                  neonatal isoerythrolysis) - kočičí novorozenecké rozpouštění
                  červených krvinek.
                </Text>
              </Alert>

              <Text>
                Takto postižená koťata rychle slábnou, ztrácí zájem o sání,
                zcela přestanou sát a hynou za příznaků žloutenky a anemie.
                Některá z těchto koťat přežívají, ale za několik týdnů slabostí
                hynou. Výjimečně přežijí se slabou formou anemie, jejich vývoj
                je opožděný, zaostávají za sourozenci.
              </Text>

              <Box
                py={16}
                px={24}
                bg="rgba(71, 163, 238, 0.1)"
                style={{ borderRadius: "8px" }}
              >
                <Text fw={700} size="lg" mb={16}>
                  Řešení problému:
                </Text>
                <Text>
                  Jestliže není vyhnutí a z nějakého důvodu musíme rodičovský
                  pár vytvořit z jedinců s rozdílnými krevními skupinami, je
                  záchrana života koťat jedině v tom, že koťata ihned po porodu,
                  dříve než se napijí kolostra, oddělíme od matky minimálně na
                  24 hod, kdy je střevní stěna koťat prostupná pro protilátky.
                </Text>
                <Text mt={8}>
                  Po dobu oddělení je nutno koťata krmit uměle náhradou kočičího
                  mléka (lze zakoupit v obchodech např. sušené mléko Kitty milk
                  od firmy Beaphar, ale existuje samozřejmě více značek) nebo
                  mít k dispozici kojnou kočku s krevní skupinou odpovídající
                  koťatům. Bohužel tato koťata nezískají z kolostra ani
                  protilátky proti infekcím a tím si nesou do života určitou
                  zátěž.
                </Text>
              </Box>

              <Text size="sm" c="dimmed" mt={16}>
                Nejčastěji se jedinci s krevní skupinou B vyskytují u britských
                koček (až 50%), devon rexů (40%), habešských, somálských a
                perských (20%), oproti tomu siamské a orientální mají téměř vždy
                krevní skupinu A. I u volně chovaných domácích koček se tyto
                problémy vyskytují. Kočky porodí zdravá koťata, ale ta brzy
                hynou. Taková kočka ve svém životě obvykle neodchová žádná
                koťata, pokud nepotká kocoura také se skupinou B.
              </Text>

              <Text size="sm" c="dimmed" ta="right" mt={8}>
                - MVDr. Květa Mahelková
              </Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export default RagdollBloodGroupsSection;
