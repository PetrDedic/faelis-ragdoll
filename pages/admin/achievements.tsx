"use client";

import React, { useEffect, useState } from "react";
import "dayjs/locale/cs";
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
  Center,
  Alert,
  Flex,
  Image,
  AspectRatio,
  SimpleGrid,
  Card,
  Menu,
  Box,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
  IconTrophy,
  IconPhoto,
  IconDotsVertical,
  IconArrowUp,
  IconArrowDown,
  IconEye,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import supabase from "../../utils/supabase/client";
import { AdminNav } from "../../components/AdminLinks";
import AchievementImagesButton from "../../components/AdminAchievementImagesButton";

interface Cat {
  id: string;
  name: string;
}

interface AchievementImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  is_primary: boolean;
  display_order?: number;
}

interface Achievement {
  id: string;
  cat_id: string;
  cat_name: string;
  title: string;
  show_name?: string;
  date?: string;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  images: AchievementImage[];
}

const AdminAchievementsPage = () => {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Form state
  const [formData, setFormData] = useState({
    cat_id: "",
    title: "",
    show_name: "",
    date: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchAchievements();
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const { data, error } = await supabase
        .from("cats")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCats(data || []);
    } catch (error) {
      console.error("Error fetching cats:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst seznam koček",
        color: "red",
      });
    }
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("achievements")
        .select(
          `
          *,
          cats!inner(name),
          achievement_images(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const achievementsWithImages =
        data?.map((achievement: any) => ({
          ...achievement,
          cat_name: achievement.cats.name,
          images: achievement.achievement_images || [],
        })) || [];

      setAchievements(achievementsWithImages);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst výstavní úspěchy",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter achievements based on search term
  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.cat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (achievement.show_name &&
        achievement.show_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNew = () => {
    setEditingAchievement(null);
    setFormData({
      cat_id: "",
      title: "",
      show_name: "",
      date: "",
      description: "",
      category: "",
    });
    open();
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      cat_id: achievement.cat_id,
      title: achievement.title,
      show_name: achievement.show_name || "",
      date: achievement.date || "",
      description: achievement.description || "",
      category: achievement.category || "",
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Opravdu chcete smazat tento výstavní úspěch?")) {
      try {
        const { error } = await supabase
          .from("achievements")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setAchievements((prev) => prev.filter((a) => a.id !== id));
        notifications.show({
          title: "Úspěch",
          message: "Výstavní úspěch byl smazán",
          color: "green",
        });
      } catch (error) {
        console.error("Error deleting achievement:", error);
        notifications.show({
          title: "Chyba",
          message: "Nepodařilo se smazat výstavní úspěch",
          color: "red",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!formData.cat_id || !formData.title) {
      notifications.show({
        title: "Chyba",
        message: "Vyplňte povinná pole (kočka, titul)",
        color: "red",
      });
      return;
    }

    try {
      if (editingAchievement) {
        // Update existing achievement
        const { error: achievementError } = await supabase
          .from("achievements")
          .update({
            cat_id: formData.cat_id,
            title: formData.title,
            show_name: formData.show_name || null,
            date: formData.date || null,
            description: formData.description || null,
            category: formData.category || null,
          })
          .eq("id", editingAchievement.id);

        if (achievementError) throw achievementError;

        notifications.show({
          title: "Úspěch",
          message: "Výstavní úspěch byl aktualizován",
          color: "green",
        });
      } else {
        // Add new achievement
        const { error: achievementError } = await supabase
          .from("achievements")
          .insert({
            cat_id: formData.cat_id,
            title: formData.title,
            show_name: formData.show_name || null,
            date: formData.date || null,
            description: formData.description || null,
            category: formData.category || null,
          });

        if (achievementError) throw achievementError;

        notifications.show({
          title: "Úspěch",
          message: "Nový výstavní úspěch byl přidán",
          color: "green",
        });
      }

      close();
      fetchAchievements(); // Refresh the list
    } catch (error) {
      console.error("Error saving achievement:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se uložit výstavní úspěch",
        color: "red",
      });
    }
  };

  const getPrimaryImage = (achievement: Achievement) => {
    return (
      achievement.images.find((img) => img.is_primary) || achievement.images[0]
    );
  };

  return (
    <Stack gap="lg" p={16} maw={1280} mx="auto">
      <AdminNav activePage="achievements" />
      <Group align="apart">
        <Title order={2}>
          <IconTrophy style={{ marginRight: 8 }} />
          Správa výstavních úspěchů
        </Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAddNew}>
          Přidat nový úspěch
        </Button>
      </Group>

      <Flex gap="md" align="center" wrap="wrap">
        <TextInput
          placeholder="Hledat úspěchy..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
      </Flex>

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : filteredAchievements.length === 0 ? (
        <Alert title="Žádné úspěchy nenalezeny" color="blue">
          {searchTerm
            ? "Žádné úspěchy neodpovídají vašim kritériím vyhledávání."
            : "V databázi zatím nejsou žádné výstavní úspěchy."}
        </Alert>
      ) : (
        <Paper withBorder shadow="xs" p={0}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Obrázek</Table.Th>
                <Table.Th>Jméno kočky</Table.Th>
                <Table.Th>Titul</Table.Th>
                <Table.Th>Výstava</Table.Th>
                <Table.Th>Datum</Table.Th>
                <Table.Th>Kategorie</Table.Th>
                <Table.Th>Obrázky</Table.Th>
                <Table.Th>Akce</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredAchievements.map((achievement) => {
                const primaryImage = getPrimaryImage(achievement);
                return (
                  <Table.Tr key={achievement.id}>
                    <Table.Td>
                      {primaryImage && (
                        <AspectRatio ratio={1} w={60}>
                          <Image
                            src={primaryImage.url}
                            alt={`${achievement.cat_name} - ${achievement.title}`}
                            fit="cover"
                          />
                        </AspectRatio>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{achievement.cat_name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color="yellow"
                        variant="filled"
                        leftSection={<IconTrophy size={12} />}
                      >
                        {achievement.title}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {achievement.show_name ? (
                        <Text size="sm">{achievement.show_name}</Text>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {achievement.date ? (
                        <Text size="sm">{achievement.date}</Text>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {achievement.category ? (
                        <Badge variant="outline">{achievement.category}</Badge>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Nenastaveno
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue">
                        {achievement.images.length} obrázků
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <AchievementImagesButton
                          achievementId={achievement.id}
                          achievementTitle={achievement.title}
                          catName={achievement.cat_name}
                        />
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEdit(achievement)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(achievement.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={
          editingAchievement ? "Upravit výstavní úspěch" : "Přidat nový úspěch"
        }
        size="xl"
      >
        <Stack gap="md">
          <Select
            label="Kočka"
            placeholder="Vyberte kočku"
            data={cats.map((cat) => ({ value: cat.id, label: cat.name }))}
            value={formData.cat_id}
            onChange={(value) =>
              setFormData({ ...formData, cat_id: value || "" })
            }
            required
            searchable
          />

          <TextInput
            label="Titul"
            placeholder="Např. Champion, Grand Champion"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <TextInput
            label="Název výstavy"
            placeholder="Zadejte název výstavy"
            value={formData.show_name}
            onChange={(e) =>
              setFormData({ ...formData, show_name: e.target.value })
            }
          />

          <DatePickerInput
            locale="cs"
            label="Datum"
            placeholder="Vyberte datum"
            value={formData.date ? new Date(formData.date) : null}
            onChange={(date) =>
              setFormData({
                ...formData,
                date: date ? date.toISOString().split("T")[0] : "",
              })
            }
          />

          <TextInput
            label="Kategorie"
            placeholder="Zadejte kategorii (např. Dospělé kočky, ...)"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <Textarea
            label="Popis"
            placeholder="Zadejte popis úspěchu"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={close}>
              Zrušit
            </Button>
            <Button onClick={handleSave}>
              {editingAchievement ? "Uložit změny" : "Přidat"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default AdminAchievementsPage;
