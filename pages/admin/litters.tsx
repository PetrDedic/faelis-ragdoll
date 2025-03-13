"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Title,
  Table,
  Group,
  Button,
  TextInput,
  ActionIcon,
  Modal,
  Stack,
  Select,
  Textarea,
  Text,
  Badge,
  Loader,
  Paper,
  Tabs,
  Pagination,
  Center,
  Alert,
  Flex,
  NumberInput,
  MultiSelect,
  SimpleGrid,
  Box,
  List,
  Card,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
  IconCat,
} from "@tabler/icons-react";
import supabase from "../../utils/supabase/client";
import { AdminNav } from "../../components/AdminLinks";

// Define types
interface Cat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  status: string;
  color?: {
    id: string;
    name_cs: string;
    code: string;
  };
  variety?: {
    id: string;
    name_cs: string;
    code: string;
  };
  images: CatImage[];
}

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface Litter {
  id: string;
  mother_id: string;
  father_id: string;
  birth_date: string;
  number_of_kittens: number;
  number_of_males: number;
  number_of_females: number;
  description: string;
  details: string;
  mother?: Cat;
  father?: Cat;
  kittens: Cat[];
}

interface Option {
  value: string;
  label: string;
}

const AdminLittersPage = () => {
  const router = useRouter();
  const [litters, setLitters] = useState<Litter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLitter, setEditingLitter] = useState<Litter | null>(null);
  const [motherOptions, setMotherOptions] = useState<Option[]>([]);
  const [fatherOptions, setFatherOptions] = useState<Option[]>([]);
  const [availableKittens, setAvailableKittens] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewLitter, setViewLitter] = useState<Litter | null>(null);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const itemsPerPage = 10;

  // Form state
  const [formValues, setFormValues] = useState<Partial<Litter>>({
    birth_date: "",
    number_of_kittens: 0,
    number_of_males: 0,
    number_of_females: 0,
    description: "",
    details: "",
  });
  const [selectedMother, setSelectedMother] = useState<string | null>(null);
  const [selectedFather, setSelectedFather] = useState<string | null>(null);
  const [selectedKittens, setSelectedKittens] = useState<string[]>([]);

  // Fetch litters and reference data on component mount
  useEffect(() => {
    fetchLitters();
    fetchParentOptions();
  }, []);

  // Filter litters based on active tab and search term
  const filteredLitters = litters.filter((litter) => {
    const motherName = litter.mother?.name || "";
    const fatherName = litter.father?.name || "";

    const matchesSearch =
      searchTerm === "" ||
      motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      litter.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" &&
        new Date(litter.birth_date) >=
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) ||
      (activeTab === "older" &&
        new Date(litter.birth_date) <
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesTab;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredLitters.length / itemsPerPage);
  const paginatedLitters = filteredLitters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch litters with all their related data
  const fetchLitters = () => {
    setLoading(true);

    // Get all litters
    supabase
      .from("litters")
      .select("*")
      .order("birth_date", { ascending: false })
      .then(({ data: littersData, error }) => {
        if (error) {
          console.error("Error fetching litters:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se načíst vrhy",
            color: "red",
          });
          setLoading(false);
          return;
        }

        if (!littersData || littersData.length === 0) {
          setLitters([]);
          setLoading(false);
          return;
        }

        // Extract all litter IDs, mother IDs, and father IDs
        const litterIds = littersData.map((litter) => litter.id);
        const motherIds = littersData.map((litter) => litter.mother_id);
        const fatherIds = littersData.map((litter) => litter.father_id);
        const parentIds = [...new Set([...motherIds, ...fatherIds])];

        // Fetch related data
        Promise.all([
          supabase.from("cat_litters").select("*").in("litter_id", litterIds),
          supabase
            .from("cats")
            .select(
              "*, cat_colors(color_id), cat_varieties(variety_id), images(*)"
            )
            .in("id", parentIds),
          supabase.from("colors").select("*"),
          supabase.from("varieties").select("*"),
        ])
          .then(
            ([
              catLittersResponse,
              catsResponse,
              colorsResponse,
              varietiesResponse,
            ]) => {
              // Get all kittens IDs from cat_litters
              const kittenIds =
                catLittersResponse.data?.map((cl) => cl.cat_id) || [];

              // If there are any kittens, fetch their details
              const kittensPromise =
                kittenIds.length > 0
                  ? supabase
                      .from("cats")
                      .select(
                        "*, cat_colors(color_id), cat_varieties(variety_id), images(*)"
                      )
                      .in("id", kittenIds)
                  : Promise.resolve({ data: [], error: null });

              kittensPromise.then(({ data: kittensData }) => {
                // Process cats to add color and variety information
                const processedCats =
                  catsResponse.data?.map((cat) => {
                    // Find color and variety for this cat
                    const colorId = cat.cat_colors?.[0]?.color_id;
                    const varietyId = cat.cat_varieties?.[0]?.variety_id;

                    const color = colorId
                      ? colorsResponse.data?.find((c) => c.id === colorId)
                      : undefined;

                    const variety = varietyId
                      ? varietiesResponse.data?.find((v) => v.id === varietyId)
                      : undefined;

                    return {
                      ...cat,
                      color,
                      variety,
                    };
                  }) || [];

                // Process kittens to add color and variety information
                const processedKittens =
                  kittensData?.map((kitten) => {
                    // Find color and variety for this kitten
                    const colorId = kitten.cat_colors?.[0]?.color_id;
                    const varietyId = kitten.cat_varieties?.[0]?.variety_id;

                    const color = colorId
                      ? colorsResponse.data?.find((c) => c.id === colorId)
                      : undefined;

                    const variety = varietyId
                      ? varietiesResponse.data?.find((v) => v.id === varietyId)
                      : undefined;

                    return {
                      ...kitten,
                      color,
                      variety,
                    };
                  }) || [];

                // Map data to litters
                const enrichedLitters = littersData.map((litter) => {
                  // Find parent cats
                  const mother = processedCats.find(
                    (cat) => cat.id === litter.mother_id
                  );
                  const father = processedCats.find(
                    (cat) => cat.id === litter.father_id
                  );

                  // Find kittens for this litter
                  const litterKittenRelations =
                    catLittersResponse.data?.filter(
                      (cl) => cl.litter_id === litter.id
                    ) || [];

                  const litterKittenIds = litterKittenRelations.map(
                    (relation) => relation.cat_id
                  );
                  const kittens = processedKittens.filter((kitten) =>
                    litterKittenIds.includes(kitten.id)
                  );

                  return {
                    ...litter,
                    mother,
                    father,
                    kittens,
                  };
                });

                setLitters(enrichedLitters);
                setLoading(false);
              });
            }
          )
          .catch((err) => {
            console.error("Error fetching related data:", err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error("Error in fetchLitters:", err);
        setLoading(false);
      });
  };

  // Fetch parent options for dropdowns
  const fetchParentOptions = () => {
    // Fetch female cats for mothers
    supabase
      .from("cats")
      .select("id, name, gender")
      .eq("gender", "female")
      .eq("is_breeding", true)
      .order("name")
      .then(({ data: females, error }) => {
        if (error) {
          console.error("Error fetching females:", error);
          return;
        }

        if (females) {
          setMotherOptions(
            females.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))
          );
        }
      });

    // Fetch male cats for fathers
    supabase
      .from("cats")
      .select("id, name, gender")
      .eq("gender", "male")
      .eq("is_breeding", true)
      .order("name")
      .then(({ data: males, error }) => {
        if (error) {
          console.error("Error fetching males:", error);
          return;
        }

        if (males) {
          setFatherOptions(
            males.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))
          );
        }
      });
  };

  // Fetch available kittens that aren't assigned to any litter
  const fetchAvailableKittens = (litterId = null) => {
    // First get all cats
    supabase
      .from("cats")
      .select("id, name, birth_date")
      .order("name")
      .then(({ data: allCats, error }) => {
        if (error) {
          console.error("Error fetching cats:", error);
          return;
        }

        if (!allCats) return;

        // Then get all cats that are already assigned to litters
        supabase
          .from("cat_litters")
          .select("cat_id, litter_id")
          .then(({ data: assignedCats, error: assignedError }) => {
            if (assignedError) {
              console.error("Error fetching assigned cats:", assignedError);
              return;
            }

            // Filter out cats that are already assigned to other litters
            // Keep cats that are either unassigned or assigned to the current litter
            const availableCatIds = allCats
              .filter((cat) => {
                const isAssigned = assignedCats?.some(
                  (assigned) =>
                    assigned.cat_id === cat.id &&
                    assigned.litter_id !== litterId
                );
                return !isAssigned;
              })
              .map((cat) => ({
                value: cat.id,
                label: cat.name,
              }));

            setAvailableKittens(availableCatIds);
          });
      });
  };

  // Handle view litter details
  const handleViewLitter = (litter: Litter) => {
    setViewLitter(litter);
    openView();
  };

  // Handle edit button click
  const handleEdit = (litter: Litter) => {
    setEditingLitter(litter);
    setFormValues({
      birth_date: litter.birth_date,
      number_of_kittens: litter.number_of_kittens,
      number_of_males: litter.number_of_males,
      number_of_females: litter.number_of_females,
      description: litter.description,
      details: litter.details,
    });
    setSelectedMother(litter.mother_id);
    setSelectedFather(litter.father_id);
    setSelectedKittens(litter.kittens.map((kitten) => kitten.id));
    fetchAvailableKittens(litter.id);
    open();
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited litter
  const handleSave = () => {
    if (!editingLitter) return;
    if (!selectedMother || !selectedFather) {
      notifications.show({
        title: "Chyba",
        message: "Musíte vybrat matku a otce",
        color: "red",
      });
      return;
    }

    // Update the litter record
    supabase
      .from("litters")
      .update({
        mother_id: selectedMother,
        father_id: selectedFather,
        birth_date: formValues.birth_date,
        number_of_kittens: formValues.number_of_kittens,
        number_of_males: formValues.number_of_males,
        number_of_females: formValues.number_of_females,
        description: formValues.description,
        details: formValues.details,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingLitter.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating litter:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se aktualizovat vrh",
            color: "red",
          });
          return;
        }

        // Get current kittens
        const currentKittenIds = editingLitter.kittens.map(
          (kitten) => kitten.id
        );

        // Find kittens to add
        const kittensToAdd = selectedKittens.filter(
          (id) => !currentKittenIds.includes(id)
        );

        // Find kittens to remove
        const kittensToRemove = currentKittenIds.filter(
          (id) => !selectedKittens.includes(id)
        );

        const promises = [];

        // Add new kittens to the litter
        if (kittensToAdd.length > 0) {
          const inserts = kittensToAdd.map((catId) => ({
            cat_id: catId,
            litter_id: editingLitter.id,
          }));

          promises.push(supabase.from("cat_litters").insert(inserts));
        }

        // Remove kittens from the litter
        if (kittensToRemove.length > 0) {
          promises.push(
            supabase
              .from("cat_litters")
              .delete()
              .eq("litter_id", editingLitter.id)
              .in("cat_id", kittensToRemove)
          );
        }

        // Wait for all updates to complete
        Promise.all(promises)
          .then(() => {
            notifications.show({
              title: "Úspěch",
              message: "Vrh byl úspěšně aktualizován",
              color: "green",
            });

            // Refresh data
            fetchLitters();
            close();
          })
          .catch((error) => {
            console.error("Error updating kittens:", error);
            notifications.show({
              title: "Chyba",
              message: "Nepodařilo se aktualizovat koťata ve vrhu",
              color: "red",
            });
          });
      });
  };

  // Delete a litter
  const handleDelete = (litterId: string) => {
    if (!window.confirm("Opravdu chcete tento vrh smazat?")) {
      return;
    }

    supabase
      .from("litters")
      .delete()
      .eq("id", litterId)
      .then(({ error }) => {
        if (error) {
          console.error("Error deleting litter:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se smazat vrh",
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Úspěch",
          message: "Vrh byl úspěšně smazán",
          color: "green",
        });

        // Refresh data
        fetchLitters();
      });
  };

  // Handle creating a new litter
  const handleCreateNew = () => {
    setEditingLitter(null);
    setFormValues({
      birth_date: new Date().toISOString().split("T")[0],
      number_of_kittens: 0,
      number_of_males: 0,
      number_of_females: 0,
      description: "",
      details: "",
    });
    setSelectedMother(null);
    setSelectedFather(null);
    setSelectedKittens([]);
    fetchAvailableKittens();
    open();
  };

  // Save new litter
  const handleSaveNewLitter = () => {
    if (!selectedMother || !selectedFather) {
      notifications.show({
        title: "Chyba",
        message: "Musíte vybrat matku a otce",
        color: "red",
      });
      return;
    }

    // Create new litter record
    supabase
      .from("litters")
      .insert({
        mother_id: selectedMother,
        father_id: selectedFather,
        birth_date: formValues.birth_date,
        number_of_kittens: formValues.number_of_kittens,
        number_of_males: formValues.number_of_males,
        number_of_females: formValues.number_of_females,
        description: formValues.description,
        details: formValues.details,
      })
      .select()
      .single()
      .then(({ data: newLitter, error }) => {
        if (error) {
          console.error("Error creating litter:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se vytvořit nový vrh",
            color: "red",
          });
          return;
        }

        if (!newLitter) {
          console.error("Failed to create litter - no data returned");
          notifications.show({
            title: "Chyba",
            message:
              "Nepodařilo se vytvořit nový vrh - nebyla vrácena žádná data",
            color: "red",
          });
          return;
        }

        // Add kittens to the litter if any are selected
        if (selectedKittens.length > 0) {
          const inserts = selectedKittens.map((catId) => ({
            cat_id: catId,
            litter_id: newLitter.id,
          }));

          supabase
            .from("cat_litters")
            .insert(inserts)
            .then(({ error: kittensError }) => {
              if (kittensError) {
                console.error("Error adding kittens to litter:", kittensError);
                notifications.show({
                  title: "Částečný úspěch",
                  message:
                    "Vrh byl vytvořen, ale nepodařilo se k němu přiřadit koťata",
                  color: "orange",
                });
                fetchLitters();
                close();
                return;
              }

              notifications.show({
                title: "Úspěch",
                message: "Nový vrh byl úspěšně vytvořen",
                color: "green",
              });

              // Refresh data
              fetchLitters();
              close();
            });
        } else {
          notifications.show({
            title: "Úspěch",
            message: "Nový vrh byl úspěšně vytvořen",
            color: "green",
          });

          // Refresh data
          fetchLitters();
          close();
        }
      });
  };

  return (
    <Stack gap="lg" p={16} maw={1280} mx="auto">
      <AdminNav activePage="litters" />
      <Group align="apart">
        <Title order={2}>Správa vrhů</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateNew}>
          Přidat nový vrh
        </Button>
      </Group>

      <Flex gap="md" align="center">
        <TextInput
          placeholder="Hledat vrhy..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="all">Všechny</Tabs.Tab>
            <Tabs.Tab value="recent">Posledních 12 měsíců</Tabs.Tab>
            <Tabs.Tab value="older">Starší</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Flex>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : paginatedLitters.length === 0 ? (
        <Alert title="Žádné vrhy nenalezeny" color="blue">
          {searchTerm
            ? "Žádné vrhy neodpovídají vašim kritériím vyhledávání."
            : "V databázi zatím nejsou žádné vrhy."}
        </Alert>
      ) : (
        <>
          <Paper withBorder shadow="xs" p={0}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Datum narození</Table.Th>
                  <Table.Th>Matka</Table.Th>
                  <Table.Th>Otec</Table.Th>
                  <Table.Th>Počet koťat</Table.Th>
                  <Table.Th>Počet samců</Table.Th>
                  <Table.Th>Počet samic</Table.Th>
                  <Table.Th>Popis</Table.Th>
                  <Table.Th>Akce</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedLitters.map((litter) => (
                  <Table.Tr key={litter.id}>
                    <Table.Td>
                      {new Date(litter.birth_date).toLocaleDateString("cs-CZ")}
                    </Table.Td>
                    <Table.Td>
                      {litter.mother ? (
                        <Text>{litter.mother.name}</Text>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {litter.father ? (
                        <Text>{litter.father.name}</Text>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>{litter.number_of_kittens || 0}</Table.Td>
                    <Table.Td>{litter.number_of_males || 0}</Table.Td>
                    <Table.Td>{litter.number_of_females || 0}</Table.Td>
                    <Table.Td>
                      {litter.description ? (
                        <Text truncate maw={200}>
                          {litter.description}
                        </Text>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Bez popisu
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewLitter(litter)}
                        >
                          <IconCat size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="blue"
                          onClick={() => handleEdit(litter)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDelete(litter.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          {totalPages > 1 && (
            <Center py="md">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
              />
            </Center>
          )}
        </>
      )}

      {/* View Litter Details Modal */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title={
          viewLitter
            ? `Vrh: ${new Date(viewLitter.birth_date).toLocaleDateString(
                "cs-CZ"
              )}`
            : "Detail vrhu"
        }
        size="xl"
      >
        {viewLitter && (
          <Stack gap="md">
            <SimpleGrid cols={2} spacing="md">
              {/* Parents */}
              <Card withBorder shadow="sm" padding="md" radius="md">
                <Title order={4} mb="sm">
                  Rodiče
                </Title>
                <Stack gap="md">
                  <Group>
                    <Text fw={700}>Matka:</Text>
                    <Text>{viewLitter.mother?.name || "Nenastaveno"}</Text>
                  </Group>
                  <Group>
                    <Text fw={700}>Otec:</Text>
                    <Text>{viewLitter.father?.name || "Nenastaveno"}</Text>
                  </Group>
                </Stack>
              </Card>

              {/* Litter Details */}
              <Card withBorder shadow="sm" padding="md" radius="md">
                <Title order={4} mb="sm">
                  Detaily vrhu
                </Title>
                <Stack gap="md">
                  <Group>
                    <Text fw={700}>Datum narození:</Text>
                    <Text>
                      {new Date(viewLitter.birth_date).toLocaleDateString(
                        "cs-CZ"
                      )}
                    </Text>
                  </Group>
                  <Group>
                    <Text fw={700}>Celkem koťat:</Text>
                    <Text>{viewLitter.number_of_kittens || 0}</Text>
                  </Group>
                  <Group>
                    <Text fw={700}>Kocouři:</Text>
                    <Text>{viewLitter.number_of_males || 0}</Text>
                  </Group>
                  <Group>
                    <Text fw={700}>Kočky:</Text>
                    <Text>{viewLitter.number_of_females || 0}</Text>
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>

            {/* Description and Details */}
            {(viewLitter.description || viewLitter.details) && (
              <Card withBorder shadow="sm" padding="md" radius="md">
                <Stack gap="md">
                  {viewLitter.description && (
                    <>
                      <Text fw={700}>Popis:</Text>
                      <Text>{viewLitter.description}</Text>
                    </>
                  )}
                  {viewLitter.details && (
                    <>
                      <Text fw={700}>Podrobnosti:</Text>
                      <Text>{viewLitter.details}</Text>
                    </>
                  )}
                </Stack>
              </Card>
            )}

            {/* Kittens */}
            <Card withBorder shadow="sm" padding="md" radius="md">
              <Title order={4} mb="sm">
                Koťata v tomto vrhu
              </Title>
              {viewLitter.kittens.length === 0 ? (
                <Text color="dimmed">
                  K tomuto vrhu nejsou přiřazena žádná koťata.
                </Text>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                  {viewLitter.kittens.map((kitten) => (
                    <Card
                      key={kitten.id}
                      withBorder
                      shadow="sm"
                      padding="sm"
                      radius="md"
                    >
                      {kitten.images && kitten.images.length > 0 && (
                        <Card.Section>
                          <Image
                            src={
                              kitten.images.find((img) => img.is_primary)
                                ?.url || kitten.images[0].url
                            }
                            height={120}
                            alt={kitten.name}
                            fit="cover"
                          />
                        </Card.Section>
                      )}
                      <Group mt="md" mb="xs">
                        <Text fw={700}>{kitten.name}</Text>
                        <Text fw={700}>{kitten.name}</Text>
                        {kitten.gender === "male" ? (
                          <Badge color="blue">Kocour</Badge>
                        ) : (
                          <Badge color="pink">Kočka</Badge>
                        )}
                      </Group>
                      <Stack gap="xs" mt="xs">
                        {kitten.color && (
                          <Group>
                            <Text size="sm" fw={600}>
                              Barva:
                            </Text>
                            <Text size="sm">{kitten.color.name_cs}</Text>
                          </Group>
                        )}
                        {kitten.variety && (
                          <Group>
                            <Text size="sm" fw={600}>
                              Varieta:
                            </Text>
                            <Text size="sm">{kitten.variety.name_cs}</Text>
                          </Group>
                        )}
                        <Group>
                          <Text size="sm" fw={600}>
                            Narozen(a):
                          </Text>
                          <Text size="sm">
                            {kitten.birth_date
                              ? new Date(kitten.birth_date).toLocaleDateString(
                                  "cs-CZ"
                                )
                              : "Neznámo"}
                          </Text>
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Card>

            <Group justify="right" mt="md">
              <Button variant="outline" onClick={closeView}>
                Zavřít
              </Button>
              <Button
                onClick={() => {
                  closeView();
                  handleEdit(viewLitter);
                }}
              >
                Upravit vrh
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Edit/Create Litter Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          editingLitter
            ? `Upravit vrh z ${new Date(
                editingLitter.birth_date
              ).toLocaleDateString("cs-CZ")}`
            : "Vytvořit nový vrh"
        }
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Matka"
            required
            data={motherOptions}
            value={selectedMother}
            onChange={setSelectedMother}
            searchable
            placeholder="Vyberte matku..."
          />

          <Select
            label="Otec"
            required
            data={fatherOptions}
            value={selectedFather}
            onChange={setSelectedFather}
            searchable
            placeholder="Vyberte otce..."
          />

          <DatePickerInput
            label="Datum narození"
            required
            value={
              formValues.birth_date ? new Date(formValues.birth_date) : null
            }
            onChange={(date) =>
              handleInputChange("birth_date", date?.toISOString().split("T")[0])
            }
            placeholder="Vyberte datum narození..."
          />

          <SimpleGrid cols={3}>
            <NumberInput
              label="Celkem koťat"
              value={formValues.number_of_kittens}
              onChange={(value) =>
                handleInputChange("number_of_kittens", value)
              }
              min={0}
            />

            <NumberInput
              label="Počet samců"
              value={formValues.number_of_males}
              onChange={(value) => handleInputChange("number_of_males", value)}
              min={0}
            />

            <NumberInput
              label="Počet samic"
              value={formValues.number_of_females}
              onChange={(value) =>
                handleInputChange("number_of_females", value)
              }
              min={0}
            />
          </SimpleGrid>

          <TextInput
            label="Popis"
            value={formValues.description || ""}
            onChange={(e) =>
              handleInputChange("description", e.currentTarget.value)
            }
            placeholder="Popis vrhu..."
          />

          <Textarea
            label="Podrobnosti"
            value={formValues.details || ""}
            onChange={(e) =>
              handleInputChange("details", e.currentTarget.value)
            }
            minRows={3}
            placeholder="Další podrobnosti o vrhu..."
          />

          <MultiSelect
            label="Koťata v tomto vrhu"
            data={availableKittens}
            value={selectedKittens}
            onChange={setSelectedKittens}
            searchable
            placeholder="Vyberte koťata..."
          />

          <Group justify="right" mt="md">
            <Button variant="outline" onClick={close}>
              Zrušit
            </Button>
            <Button onClick={editingLitter ? handleSave : handleSaveNewLitter}>
              {editingLitter ? "Uložit změny" : "Vytvořit vrh"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminLittersPage;
