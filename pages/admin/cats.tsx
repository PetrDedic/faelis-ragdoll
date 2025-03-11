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
  Switch,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconSearch, IconPlus } from "@tabler/icons-react";
import supabase from "../../utils/supabase/client";

// Define types
interface Cat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  description: string;
  details: string;
  is_breeding: boolean;
  is_neutered: boolean;
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
  blood_type?: {
    id: string;
    type: string;
    genetic_code: string;
  };
  images: CatImage[];
}

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface Option {
  value: string;
  label: string;
}

const AdminCatsPage = () => {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [colorOptions, setColorOptions] = useState<Option[]>([]);
  const [varietyOptions, setVarietyOptions] = useState<Option[]>([]);
  const [bloodTypeOptions, setBloodTypeOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formValues, setFormValues] = useState<Partial<Cat>>({
    name: "",
    birth_date: "",
    gender: "female",
    description: "",
    details: "",
    is_breeding: true,
    is_neutered: false,
    status: "alive",
  });
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(
    null
  );

  // Fetch cats and reference data on component mount
  useEffect(() => {
    fetchCats();
    fetchReferenceData();
  }, []);

  // Filter cats based on active tab and search term
  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      searchTerm === "" ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "male" && cat.gender === "male") ||
      (activeTab === "female" && cat.gender === "female");

    return matchesSearch && matchesTab;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCats.length / itemsPerPage);
  const paginatedCats = filteredCats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch cats with all their related data
  const fetchCats = () => {
    setLoading(true);

    // Get all cats
    supabase
      .from("cats")
      .select("*")
      .order("name")
      .then(({ data: cats, error }) => {
        if (error) {
          console.error("Error fetching cats:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se načíst kočky",
            color: "red",
          });
          setLoading(false);
          return;
        }

        if (!cats || cats.length === 0) {
          setCats([]);
          setLoading(false);
          return;
        }

        // Extract all cat IDs
        const catIds = cats.map((cat) => cat.id);

        // Fetch related data
        Promise.all([
          supabase.from("images").select("*").in("cat_id", catIds),
          supabase.from("cat_colors").select("*").in("cat_id", catIds),
          supabase.from("cat_varieties").select("*").in("cat_id", catIds),
          supabase.from("cat_blood_types").select("*").in("cat_id", catIds),
        ])
          .then(
            ([
              imagesResponse,
              catColorsResponse,
              catVarietiesResponse,
              catBloodTypesResponse,
            ]) => {
              // Get color, variety, and blood type IDs
              const colorIds =
                catColorsResponse.data?.map((cc) => cc.color_id) || [];
              const varietyIds =
                catVarietiesResponse.data?.map((cv) => cv.variety_id) || [];
              const bloodTypeIds =
                catBloodTypesResponse.data?.map((cbt) => cbt.blood_type_id) ||
                [];

              // Fetch reference data
              Promise.all([
                supabase.from("colors").select("*").in("id", colorIds),
                supabase.from("varieties").select("*").in("id", varietyIds),
                supabase.from("blood_types").select("*").in("id", bloodTypeIds),
              ])
                .then(
                  ([colorsResponse, varietiesResponse, bloodTypesResponse]) => {
                    // Map data to cats
                    const enrichedCats = cats.map((cat) => {
                      // Get images for this cat
                      const catImages =
                        imagesResponse.data?.filter(
                          (img) => img.cat_id === cat.id
                        ) || [];

                      // Get color for this cat
                      const catColorRelation = catColorsResponse.data?.find(
                        (cc) => cc.cat_id === cat.id
                      );
                      const color = colorsResponse.data?.find(
                        (c) => c.id === catColorRelation?.color_id
                      );

                      // Get variety for this cat
                      const catVarietyRelation =
                        catVarietiesResponse.data?.find(
                          (cv) => cv.cat_id === cat.id
                        );
                      const variety = varietiesResponse.data?.find(
                        (v) => v.id === catVarietyRelation?.variety_id
                      );

                      // Get blood type for this cat
                      const catBloodTypeRelation =
                        catBloodTypesResponse.data?.find(
                          (cbt) => cbt.cat_id === cat.id
                        );
                      const bloodType = bloodTypesResponse.data?.find(
                        (bt) => bt.id === catBloodTypeRelation?.blood_type_id
                      );

                      return {
                        ...cat,
                        images: catImages,
                        color,
                        variety,
                        blood_type: bloodType,
                      };
                    });

                    setCats(enrichedCats);
                    setLoading(false);
                  }
                )
                .catch((err) => {
                  console.error("Error fetching reference data:", err);
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
        console.error("Error in fetchCats:", err);
        setLoading(false);
      });
  };

  // Fetch reference data for dropdowns
  const fetchReferenceData = () => {
    // Fetch colors
    supabase
      .from("colors")
      .select("id, name_cs, code")
      .order("name_cs")
      .then(({ data: colors, error }) => {
        if (error) {
          console.error("Error fetching colors:", error);
          return;
        }

        if (colors) {
          setColorOptions(
            colors.map((color) => ({
              value: color.id,
              label: `${color.name_cs} (${color.code})`,
            }))
          );
        }
      });

    // Fetch varieties
    supabase
      .from("varieties")
      .select("id, name_cs, code")
      .order("name_cs")
      .then(({ data: varieties, error }) => {
        if (error) {
          console.error("Error fetching varieties:", error);
          return;
        }

        if (varieties) {
          setVarietyOptions(
            varieties.map((variety) => ({
              value: variety.id,
              label: `${variety.name_cs} ${
                variety.code ? `(${variety.code})` : ""
              }`,
            }))
          );
        }
      });

    // Fetch blood types
    supabase
      .from("blood_types")
      .select("id, type, genetic_code, is_carrier")
      .order("type")
      .then(({ data: bloodTypes, error }) => {
        if (error) {
          console.error("Error fetching blood types:", error);
          return;
        }

        if (bloodTypes) {
          setBloodTypeOptions(
            bloodTypes.map((bt) => ({
              value: bt.id,
              label: `${bt.type} (${bt.genetic_code})${
                bt.is_carrier ? " - přenašeč" : ""
              }`,
            }))
          );
        }
      });
  };

  // Handle edit button click
  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setFormValues({
      name: cat.name,
      birth_date: cat.birth_date,
      gender: cat.gender,
      description: cat.description,
      details: cat.details,
      is_breeding: cat.is_breeding,
      is_neutered: cat.is_neutered,
      status: cat.status,
    });
    setSelectedColor(cat.color?.id || null);
    setSelectedVariety(cat.variety?.id || null);
    setSelectedBloodType(cat.blood_type?.id || null);
    open();
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited cat
  const handleSave = () => {
    if (!editingCat) return;

    // Update the cat record
    supabase
      .from("cats")
      .update({
        name: formValues.name,
        birth_date: formValues.birth_date,
        gender: formValues.gender,
        description: formValues.description,
        details: formValues.details,
        is_breeding: formValues.is_breeding,
        is_neutered: formValues.is_neutered,
        status: formValues.status,
      })
      .eq("id", editingCat.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating cat:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se aktualizovat kočku",
            color: "red",
          });
          return;
        }

        // Update related records
        const promises = [];

        // Update cat_colors
        if (selectedColor) {
          promises.push(
            // First check if a record exists
            supabase
              .from("cat_colors")
              .select("*")
              .eq("cat_id", editingCat.id)
              .then(({ data: existingColors }) => {
                if (existingColors && existingColors.length > 0) {
                  // Update existing record
                  return supabase
                    .from("cat_colors")
                    .update({
                      color_id: selectedColor,
                      is_phenotype: true,
                      is_genotype: true,
                    })
                    .eq("cat_id", editingCat.id)
                    .eq("is_phenotype", true);
                } else {
                  // Insert new record
                  return supabase.from("cat_colors").insert({
                    cat_id: editingCat.id,
                    color_id: selectedColor,
                    is_phenotype: true,
                    is_genotype: true,
                  });
                }
              })
          );
        }

        // Update cat_varieties
        if (selectedVariety) {
          promises.push(
            // First check if a record exists
            supabase
              .from("cat_varieties")
              .select("*")
              .eq("cat_id", editingCat.id)
              .then(({ data: existingVarieties }) => {
                if (existingVarieties && existingVarieties.length > 0) {
                  // Update existing record
                  return supabase
                    .from("cat_varieties")
                    .update({
                      variety_id: selectedVariety,
                      is_phenotype: true,
                      is_genotype: true,
                    })
                    .eq("cat_id", editingCat.id)
                    .eq("is_phenotype", true);
                } else {
                  // Insert new record
                  return supabase.from("cat_varieties").insert({
                    cat_id: editingCat.id,
                    variety_id: selectedVariety,
                    is_phenotype: true,
                    is_genotype: true,
                  });
                }
              })
          );
        }

        // Update cat_blood_types
        if (selectedBloodType) {
          promises.push(
            // First check if a record exists
            supabase
              .from("cat_blood_types")
              .select("*")
              .eq("cat_id", editingCat.id)
              .then(({ data: existingBloodTypes }) => {
                if (existingBloodTypes && existingBloodTypes.length > 0) {
                  // Update existing record
                  return supabase
                    .from("cat_blood_types")
                    .update({
                      blood_type_id: selectedBloodType,
                      test_method: "genetic",
                    })
                    .eq("cat_id", editingCat.id);
                } else {
                  // Insert new record
                  return supabase.from("cat_blood_types").insert({
                    cat_id: editingCat.id,
                    blood_type_id: selectedBloodType,
                    test_method: "genetic",
                  });
                }
              })
          );
        }

        // Wait for all updates to complete
        Promise.all(promises)
          .then(() => {
            notifications.show({
              title: "Úspěch",
              message: "Kočka byla úspěšně aktualizována",
              color: "green",
            });

            // Refresh data
            fetchCats();
            close();
          })
          .catch((error) => {
            console.error("Error updating related data:", error);
            notifications.show({
              title: "Chyba",
              message: "Nepodařilo se aktualizovat související údaje o kočce",
              color: "red",
            });
          });
      });
  };

  // Delete a cat
  const handleDelete = (catId: string) => {
    if (!window.confirm("Opravdu chcete tuto kočku smazat?")) {
      return;
    }

    supabase
      .from("cats")
      .delete()
      .eq("id", catId)
      .then(({ error }) => {
        if (error) {
          console.error("Error deleting cat:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se smazat kočku",
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Úspěch",
          message: "Kočka byla úspěšně smazána",
          color: "green",
        });

        // Refresh data
        fetchCats();
      });
  };

  // Handle creating a new cat
  const handleCreateNew = () => {
    setEditingCat(null);
    setFormValues({
      name: "",
      birth_date: "",
      gender: "female",
      description: "",
      details: "",
      is_breeding: true,
      is_neutered: false,
      status: "alive",
    });
    setSelectedColor(null);
    setSelectedVariety(null);
    setSelectedBloodType(null);
    open();
  };

  // Save new cat
  const handleSaveNewCat = () => {
    // Create new cat record
    supabase
      .from("cats")
      .insert({
        name: formValues.name,
        birth_date: formValues.birth_date,
        gender: formValues.gender,
        description: formValues.description,
        details: formValues.details,
        is_breeding: formValues.is_breeding,
        is_neutered: formValues.is_neutered,
        status: formValues.status,
      })
      .select()
      .single()
      .then(({ data: newCat, error }) => {
        if (error) {
          console.error("Error creating cat:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se vytvořit novou kočku",
            color: "red",
          });
          return;
        }

        if (!newCat) {
          console.error("Failed to create cat - no data returned");
          notifications.show({
            title: "Chyba",
            message:
              "Nepodařilo se vytvořit novou kočku - nebyla vrácena žádná data",
            color: "red",
          });
          return;
        }

        // Add related records
        const promises = [];

        // Add color if selected
        if (selectedColor) {
          promises.push(
            supabase.from("cat_colors").insert({
              cat_id: newCat.id,
              color_id: selectedColor,
              is_phenotype: true,
              is_genotype: true,
            })
          );
        }

        // Add variety if selected
        if (selectedVariety) {
          promises.push(
            supabase.from("cat_varieties").insert({
              cat_id: newCat.id,
              variety_id: selectedVariety,
              is_phenotype: true,
              is_genotype: true,
            })
          );
        }

        // Add blood type if selected
        if (selectedBloodType) {
          promises.push(
            supabase.from("cat_blood_types").insert({
              cat_id: newCat.id,
              blood_type_id: selectedBloodType,
              test_method: "genetic",
            })
          );
        }

        // Wait for all inserts to complete
        Promise.all(promises)
          .then(() => {
            notifications.show({
              title: "Úspěch",
              message: "Nová kočka byla úspěšně vytvořena",
              color: "green",
            });

            // Refresh data
            fetchCats();
            close();
          })
          .catch((error) => {
            console.error("Error creating related data:", error);
            notifications.show({
              title: "Chyba",
              message: "Nepodařilo se vytvořit související údaje o kočce",
              color: "red",
            });
          });
      });
  };

  return (
    <Stack gap="lg" p={16} maw={1280} mx="auto">
      <Group align="apart">
        <Title order={2}>Správa koček</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateNew}>
          Přidat novou kočku
        </Button>
      </Group>

      <Flex gap="md" align="center">
        <TextInput
          placeholder="Hledat kočky..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="all">Všechny</Tabs.Tab>
            <Tabs.Tab value="male">Kocouři</Tabs.Tab>
            <Tabs.Tab value="female">Kočky</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Flex>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : paginatedCats.length === 0 ? (
        <Alert title="Žádné kočky nenalezeny" color="blue">
          {searchTerm
            ? "Žádné kočky neodpovídají vašim kritériím vyhledávání."
            : "V databázi zatím nejsou žádné kočky."}
        </Alert>
      ) : (
        <>
          <Paper withBorder shadow="xs" p={0}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Jméno</Table.Th>
                  <Table.Th>Pohlaví</Table.Th>
                  <Table.Th>Barva</Table.Th>
                  <Table.Th>Varieta</Table.Th>
                  <Table.Th>Datum narození</Table.Th>
                  <Table.Th>Stav</Table.Th>
                  <Table.Th>Akce</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedCats.map((cat) => (
                  <Table.Tr key={cat.id}>
                    <Table.Td>{cat.name}</Table.Td>
                    <Table.Td>
                      {cat.gender === "male" ? "Kocour" : "Kočka"}
                    </Table.Td>
                    <Table.Td>
                      {cat.color ? (
                        <Badge color="blue">{cat.color.name_cs}</Badge>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {cat.variety ? (
                        <Badge color="green">{cat.variety.name_cs}</Badge>
                      ) : (
                        <Text size="sm" color="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {cat.birth_date
                        ? new Date(cat.birth_date).toLocaleDateString("cs-CZ")
                        : "Nenastaveno"}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          cat.status === "alive"
                            ? "green"
                            : cat.status === "sold"
                            ? "blue"
                            : cat.status === "reserved"
                            ? "yellow"
                            : "gray"
                        }
                      >
                        {cat.status === "alive"
                          ? "Aktivní"
                          : cat.status === "sold"
                          ? "Prodaná"
                          : cat.status === "reserved"
                          ? "Rezervovaná"
                          : "Neživá"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          onClick={() => handleEdit(cat)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDelete(cat.id)}
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

      {/* Edit/Create Cat Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          editingCat
            ? `Upravit kočku: ${editingCat.name}`
            : "Vytvořit novou kočku"
        }
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Jméno"
            required
            value={formValues.name || ""}
            onChange={(e) => handleInputChange("name", e.currentTarget.value)}
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
          />

          <Select
            label="Pohlaví"
            required
            data={[
              { value: "male", label: "Kocour" },
              { value: "female", label: "Kočka" },
            ]}
            value={formValues.gender}
            onChange={(value) => handleInputChange("gender", value)}
          />

          <TextInput
            label="Popis"
            value={formValues.description || ""}
            onChange={(e) =>
              handleInputChange("description", e.currentTarget.value)
            }
            placeholder="např., 100% tradiční rodokmen, RAG n 04"
          />

          <Select
            label="Barva"
            data={colorOptions}
            value={selectedColor}
            onChange={setSelectedColor}
            searchable
            clearable
          />

          <Select
            label="Varieta"
            data={varietyOptions}
            value={selectedVariety}
            onChange={setSelectedVariety}
            searchable
            clearable
          />

          <Select
            label="Krevní skupina"
            data={bloodTypeOptions}
            value={selectedBloodType}
            onChange={setSelectedBloodType}
            searchable
            clearable
          />

          <Select
            label="Stav"
            required
            data={[
              { value: "alive", label: "Aktivní" },
              { value: "sold", label: "Prodaná" },
              { value: "reserved", label: "Rezervovaná" },
              { value: "deceased", label: "Neživá" },
            ]}
            value={formValues.status}
            onChange={(value) => handleInputChange("status", value)}
          />

          <Group>
            <Switch
              label="Chovná kočka"
              checked={formValues.is_breeding}
              onChange={(e) =>
                handleInputChange("is_breeding", e.currentTarget.checked)
              }
            />

            <Switch
              label="Kastrovaná"
              checked={formValues.is_neutered}
              onChange={(e) =>
                handleInputChange("is_neutered", e.currentTarget.checked)
              }
            />
          </Group>

          <Textarea
            label="Podrobnosti"
            value={formValues.details || ""}
            onChange={(e) =>
              handleInputChange("details", e.currentTarget.value)
            }
            minRows={3}
            placeholder="Další podrobnosti o kočce..."
          />

          <Group justify="right" mt="md">
            <Button variant="outline" onClick={close}>
              Zrušit
            </Button>
            <Button onClick={editingCat ? handleSave : handleSaveNewCat}>
              {editingCat ? "Uložit změny" : "Vytvořit kočku"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminCatsPage;
