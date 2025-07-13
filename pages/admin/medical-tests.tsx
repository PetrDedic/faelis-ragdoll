"use client";

import React, { useEffect, useState } from "react";
import "dayjs/locale/cs";
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
  MultiSelect,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
  IconStethoscope,
} from "@tabler/icons-react";
import supabase from "../../utils/supabase/client";
import { AdminNav } from "../../components/AdminLinks";
import { formatDateToLocalString } from "../../utils/dateUtils";

// Define types
interface MedicalTest {
  id: string;
  cat_id: string;
  test_name: string;
  test_result: string;
  test_date: string;
  valid_from: string;
  valid_until: string | null;
  laboratory: string;
  certificate_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
  cat?: Cat;
}

interface Cat {
  id: string;
  name: string;
  gender: string;
  status: string;
}

interface Option {
  value: string;
  label: string;
}

const AdminMedicalTestsPage = () => {
  const router = useRouter();
  const [medicalTests, setMedicalTests] = useState<MedicalTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<MedicalTest | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [catOptions, setCatOptions] = useState<Option[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formValues, setFormValues] = useState<Partial<MedicalTest>>({
    test_name: "",
    test_result: "",
    test_date: "",
    valid_from: "",
    valid_until: null,
    laboratory: "",
    certificate_number: "",
    notes: "",
  });
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  // Fetch medical tests and reference data on component mount
  useEffect(() => {
    fetchMedicalTests();
    fetchCats();
  }, []);

  // Filter medical tests based on active tab and search term
  const filteredTests = medicalTests.filter((test) => {
    const catName = test.cat?.name || "";
    const matchesSearch =
      searchTerm === "" ||
      catName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_result.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.laboratory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "valid" &&
        (!test.valid_until || new Date(test.valid_until) > new Date())) ||
      (activeTab === "expired" &&
        test.valid_until &&
        new Date(test.valid_until) <= new Date()) ||
      (activeTab === "permanent" && !test.valid_until);

    return matchesSearch && matchesTab;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch medical tests with cat information
  const fetchMedicalTests = () => {
    setLoading(true);

    supabase
      .from("medical_tests")
      .select(
        `
        *,
        cat:cats(id, name, gender, status)
      `
      )
      .order("test_date", { ascending: false })
      .then(({ data: tests, error }) => {
        if (error) {
          console.error("Error fetching medical tests:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se načíst lékařské testy",
            color: "red",
          });
          setLoading(false);
          return;
        }

        setMedicalTests(tests || []);
        setLoading(false);
      });
  };

  // Fetch cats for the dropdown
  const fetchCats = () => {
    supabase
      .from("cats")
      .select("id, name, gender, status")
      .order("name")
      .then(({ data: cats, error }) => {
        if (error) {
          console.error("Error fetching cats:", error);
          return;
        }

        if (cats) {
          setCatOptions(
            cats.map((cat) => ({
              value: cat.id,
              label: `${cat.name} (${
                cat.gender === "male" ? "samec" : "samice"
              })`,
            }))
          );
        }
      });
  };

  // Handle edit button click
  const handleEdit = (test: MedicalTest) => {
    setEditingTest(test);
    setFormValues({
      test_name: test.test_name,
      test_result: test.test_result,
      test_date: test.test_date,
      valid_from: test.valid_from,
      valid_until: test.valid_until,
      laboratory: test.laboratory,
      certificate_number: test.certificate_number,
      notes: test.notes,
    });
    setSelectedCat(test.cat_id);
    open();
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save (update existing test)
  const handleSave = () => {
    if (!editingTest || !selectedCat) {
      notifications.show({
        title: "Chyba",
        message: "Vyberte kočku pro test",
        color: "red",
      });
      return;
    }

    const updateData = {
      ...formValues,
      cat_id: selectedCat,
    };

    supabase
      .from("medical_tests")
      .update(updateData)
      .eq("id", editingTest.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating medical test:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se aktualizovat lékařský test",
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Úspěch",
          message: "Lékařský test byl úspěšně aktualizován",
          color: "green",
        });

        close();
        setEditingTest(null);
        setFormValues({
          test_name: "",
          test_result: "",
          test_date: "",
          valid_from: "",
          valid_until: null,
          laboratory: "",
          certificate_number: "",
          notes: "",
        });
        setSelectedCat(null);
        fetchMedicalTests();
      });
  };

  // Handle delete
  const handleDelete = (testId: string) => {
    if (confirm("Opravdu chcete smazat tento lékařský test?")) {
      supabase
        .from("medical_tests")
        .delete()
        .eq("id", testId)
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting medical test:", error);
            notifications.show({
              title: "Chyba",
              message: "Nepodařilo se smazat lékařský test",
              color: "red",
            });
            return;
          }

          notifications.show({
            title: "Úspěch",
            message: "Lékařský test byl úspěšně smazán",
            color: "green",
          });

          fetchMedicalTests();
        });
    }
  };

  // Handle create new test
  const handleCreateNew = () => {
    setEditingTest(null);
    setFormValues({
      test_name: "",
      test_result: "",
      test_date: "",
      valid_from: "",
      valid_until: null,
      laboratory: "",
      certificate_number: "",
      notes: "",
    });
    setSelectedCat(null);
    open();
  };

  // Handle save new test
  const handleSaveNewTest = () => {
    if (!selectedCat) {
      notifications.show({
        title: "Chyba",
        message: "Vyberte kočku pro test",
        color: "red",
      });
      return;
    }

    const newTest = {
      ...formValues,
      cat_id: selectedCat,
    };

    supabase
      .from("medical_tests")
      .insert(newTest)
      .then(({ error }) => {
        if (error) {
          console.error("Error creating medical test:", error);
          notifications.show({
            title: "Chyba",
            message: "Nepodařilo se vytvořit lékařský test",
            color: "red",
          });
          return;
        }

        notifications.show({
          title: "Úspěch",
          message: "Lékařský test byl úspěšně vytvořen",
          color: "green",
        });

        close();
        setFormValues({
          test_name: "",
          test_result: "",
          test_date: "",
          valid_from: "",
          valid_until: null,
          laboratory: "",
          certificate_number: "",
          notes: "",
        });
        setSelectedCat(null);
        fetchMedicalTests();
      });
  };

  // Get status badge for test validity
  const getValidityBadge = (test: MedicalTest) => {
    if (!test.valid_until) {
      return <Badge color="green">Trvalý</Badge>;
    }

    const validUntil = new Date(test.valid_until);
    const now = new Date();

    if (validUntil > now) {
      return <Badge color="blue">Platný</Badge>;
    } else {
      return <Badge color="red">Expirovaný</Badge>;
    }
  };

  // Get days until expiration
  const getDaysUntilExpiration = (test: MedicalTest) => {
    if (!test.valid_until) return null;

    const validUntil = new Date(test.valid_until);
    const now = new Date();
    const diffTime = validUntil.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <AdminNav />
        <Center>
          <Loader size="lg" />
        </Center>
      </div>
    );
  }

  return (
    <Stack gap="lg" p={16} maw={1280} mx="auto">
      <AdminNav activePage="medical-tests" />

      <Group justify="apart">
        <Title order={2}>Lékařské testy</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateNew}
          color="blue"
        >
          Nový test
        </Button>
      </Group>

      {/* Search and Filters */}
      <Paper p="md" mb="md">
        <Group>
          <TextInput
            placeholder="Hledat podle kočky, testu, výsledku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab} mt="md">
          <Tabs.List>
            <Tabs.Tab value="all">Všechny</Tabs.Tab>
            <Tabs.Tab value="valid">Platné</Tabs.Tab>
            <Tabs.Tab value="expired">Expirované</Tabs.Tab>
            <Tabs.Tab value="permanent">Trvalé</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Paper>

      {/* Medical Tests Table */}
      <Paper>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Kočka</Table.Th>
              <Table.Th>Test</Table.Th>
              <Table.Th>Výsledek</Table.Th>
              <Table.Th>Datum testu</Table.Th>
              <Table.Th>Platnost</Table.Th>
              <Table.Th>Laboratoř</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Akce</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedTests.map((test) => (
              <Table.Tr key={test.id}>
                <Table.Td>
                  <Text fw={500}>{test.cat?.name}</Text>
                  <Text size="xs" c="dimmed">
                    {test.cat?.gender === "male" ? "Samec" : "Samice"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{test.test_name}</Text>
                  {test.certificate_number && (
                    <Text size="xs" c="dimmed">
                      Číslo: {test.certificate_number}
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Text>{test.test_result}</Text>
                </Table.Td>
                <Table.Td>
                  <Text>
                    {formatDateToLocalString(new Date(test.test_date))}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    Od: {formatDateToLocalString(new Date(test.valid_from))}
                  </Text>
                  {test.valid_until && (
                    <Text size="sm">
                      Do: {formatDateToLocalString(new Date(test.valid_until))}
                    </Text>
                  )}
                  {test.valid_until && (
                    <Text size="xs" c="dimmed">
                      {getDaysUntilExpiration(test)} dní
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{test.laboratory}</Text>
                </Table.Td>
                <Table.Td>{getValidityBadge(test)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(test)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(test.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {paginatedTests.length === 0 && (
          <Center p="xl">
            <Text c="dimmed">Žádné lékařské testy nebyly nalezeny</Text>
          </Center>
        )}
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Center mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Center>
      )}

      {/* Edit/Create Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingTest ? "Upravit lékařský test" : "Nový lékařský test"}
        size="lg"
      >
        <Stack>
          <Select
            label="Kočka"
            placeholder="Vyberte kočku"
            data={catOptions}
            value={selectedCat}
            onChange={setSelectedCat}
            required
            searchable
            clearable
          />

          <TextInput
            label="Název testu"
            placeholder="Např. FIV, FeLV, HCM, PKD..."
            value={formValues.test_name}
            onChange={(e) => handleInputChange("test_name", e.target.value)}
            required
          />

          <TextInput
            label="Výsledek testu"
            placeholder="Např. Negativní, Pozitivní, Normální..."
            value={formValues.test_result}
            onChange={(e) => handleInputChange("test_result", e.target.value)}
            required
          />

          <DatePickerInput
            label="Datum testu"
            placeholder="Vyberte datum"
            value={formValues.test_date ? new Date(formValues.test_date) : null}
            onChange={(date) =>
              handleInputChange("test_date", date?.toISOString().split("T")[0])
            }
            locale="cs"
            clearable
          />

          <DatePickerInput
            label="Platnost od"
            placeholder="Vyberte datum"
            value={
              formValues.valid_from ? new Date(formValues.valid_from) : null
            }
            onChange={(date) =>
              handleInputChange("valid_from", date?.toISOString().split("T")[0])
            }
            locale="cs"
            clearable
          />

          <DatePickerInput
            label="Platnost do (volitelné)"
            placeholder="Vyberte datum nebo nechte prázdné pro trvalý test"
            value={
              formValues.valid_until ? new Date(formValues.valid_until) : null
            }
            onChange={(date) =>
              handleInputChange(
                "valid_until",
                date?.toISOString().split("T")[0] || null
              )
            }
            locale="cs"
            clearable
          />

          <TextInput
            label="Laboratoř"
            placeholder="Název laboratoře"
            value={formValues.laboratory}
            onChange={(e) => handleInputChange("laboratory", e.target.value)}
          />

          <TextInput
            label="Číslo certifikátu"
            placeholder="Číslo certifikátu nebo reference"
            value={formValues.certificate_number}
            onChange={(e) =>
              handleInputChange("certificate_number", e.target.value)
            }
          />

          <Textarea
            label="Poznámky"
            placeholder="Další poznámky k testu..."
            value={formValues.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={close}>
              Zrušit
            </Button>
            <Button
              onClick={editingTest ? handleSave : handleSaveNewTest}
              color="blue"
            >
              {editingTest ? "Uložit" : "Vytvořit"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminMedicalTestsPage;
