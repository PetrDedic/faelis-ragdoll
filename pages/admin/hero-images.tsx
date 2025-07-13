"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Table,
  Group,
  Button,
  TextInput,
  ActionIcon,
  Modal,
  Stack,
  Text,
  Badge,
  Loader,
  Paper,
  Center,
  Alert,
  Flex,
  Image,
  FileButton,
  Progress,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconEdit,
  IconSearch,
  IconPlus,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import supabase from "../../utils/supabase/client";
import { AdminNav } from "../../components/AdminLinks";

// Define types
interface HeroImage {
  id: string;
  page_name: string;
  background_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminHeroImagesPage = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHeroImage, setEditingHeroImage] = useState<HeroImage | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formValues, setFormValues] = useState<Partial<HeroImage>>({
    page_name: "",
    background_image_url: "",
  });

  // Fetch hero images on component mount
  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("hero_images").select("*");

      if (error) {
        console.error("Error fetching hero images:", error);
        notifications.show({
          title: "Chyba",
          message: "Nepodařilo se načíst hero obrázky",
          color: "red",
        });
        return;
      }

      setHeroImages(data || []);
    } catch (error) {
      console.error("Error:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst hero obrázky",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (heroImage: HeroImage) => {
    setEditingHeroImage(heroImage);
    setFormValues({
      page_name: heroImage.page_name,
      background_image_url: heroImage.background_image_url || "",
    });
    open();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editingHeroImage) return;

    try {
      const { error } = await supabase
        .from("hero_images")
        .update({
          background_image_url: formValues.background_image_url || null,
        })
        .eq("id", editingHeroImage.id);

      if (error) {
        console.error("Error updating hero image:", error);
        notifications.show({
          title: "Chyba",
          message: "Nepodařilo se uložit změny",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Úspěch",
        message: "Hero obrázek byl úspěšně aktualizován",
        color: "green",
      });

      close();
      fetchHeroImages();
    } catch (error) {
      console.error("Error:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se uložit změny",
        color: "red",
      });
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `hero-images/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        notifications.show({
          title: "Chyba",
          message: "Nepodařilo se nahrát obrázek",
          color: "red",
        });
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(filePath);

      // Update form with new image URL
      handleInputChange("background_image_url", publicUrl);

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl úspěšně nahrán",
        color: "green",
      });
    } catch (error) {
      console.error("Error:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se nahrát obrázek",
        color: "red",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    handleInputChange("background_image_url", "");
  };

  const filteredHeroImages = heroImages.filter((heroImage) =>
    heroImage.page_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredHeroImages.map((heroImage) => (
    <Table.Tr key={heroImage.id}>
      <Table.Td>
        <Text fw={500}>{heroImage.page_name}</Text>
      </Table.Td>
      <Table.Td>
        {heroImage.background_image_url ? (
          <Image
            src={heroImage.background_image_url}
            alt={heroImage.page_name}
            width={80}
            height={60}
            maw={80}
            mah={60}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <Badge color="gray" variant="light">
            Bez obrázku
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {new Date(heroImage.updated_at).toLocaleDateString("cs-CZ")}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => handleEdit(heroImage)}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: "20px" }}>
      <Title order={1} mb="xl">
        Správa Hero Obrázků
      </Title>

      <AdminNav activePage="hero-images" />

      <Paper shadow="xs" p="md" mb="md">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Hledat stránky..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1, maxWidth: 300 }}
          />
        </Group>

        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Stránka</Table.Th>
                <Table.Th>Obrázek</Table.Th>
                <Table.Th>Poslední úprava</Table.Th>
                <Table.Th>Akce</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}

        {!loading && filteredHeroImages.length === 0 && (
          <Center py="xl">
            <Alert title="Žádné výsledky" color="blue">
              Nebyly nalezeny žádné hero obrázky odpovídající vyhledávání.
            </Alert>
          </Center>
        )}
      </Paper>

      {/* Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Upravit Hero Obrázek"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Kód stránky"
            value={formValues.page_name || ""}
            disabled
            description="Kód stránky nelze změnit"
          />

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Hero Obrázek
            </Text>

            {formValues.background_image_url && (
              <Stack gap="xs">
                <Image
                  src={formValues.background_image_url}
                  alt="Hero obrázek"
                  height={200}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconX size={16} />}
                  onClick={handleRemoveImage}
                  size="sm"
                >
                  Odstranit obrázek
                </Button>
              </Stack>
            )}

            {!formValues.background_image_url && (
              <Paper
                withBorder
                p="xl"
                style={{
                  borderStyle: "dashed",
                  borderColor: "var(--mantine-color-gray-4)",
                }}
              >
                <Center>
                  <Stack align="center" gap="xs">
                    <IconPhoto size={48} color="var(--mantine-color-gray-5)" />
                    <Text size="sm" c="dimmed" ta="center">
                      Nebyl vybrán žádný obrázek
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            )}

            <FileButton
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading}
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                  loading={uploading}
                >
                  {uploading ? "Nahrávání..." : "Nahrát nový obrázek"}
                </Button>
              )}
            </FileButton>

            {uploading && (
              <Stack gap="xs">
                <Progress value={uploadProgress} size="sm" />
                <Text size="sm" c="dimmed" ta="center">
                  {Math.round(uploadProgress)}%
                </Text>
              </Stack>
            )}
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Zrušit
            </Button>
            <Button onClick={handleSave} loading={uploading}>
              Uložit změny
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default AdminHeroImagesPage;
