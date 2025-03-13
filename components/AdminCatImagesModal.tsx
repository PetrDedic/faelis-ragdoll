"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Group,
  Button,
  Text,
  SimpleGrid,
  Card,
  Image,
  Badge,
  ActionIcon,
  Menu,
  Stack,
  Center,
  Loader,
  Alert,
  Box,
  Title,
  Flex,
  Tabs,
  Breadcrumbs,
  Anchor,
  Input,
  SegmentedControl,
  Pagination,
  Paper,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconPhoto,
  IconCheck,
  IconTrash,
  IconDotsVertical,
  IconPhotoOff,
  IconCopy,
  IconEye,
  IconFolderPlus,
  IconSearch,
  IconFolder,
} from "@tabler/icons-react";
import supabase from "../utils/supabase/client";

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
  title?: string;
  description?: string;
  created_at?: string;
}

interface GalleryItem {
  id: string;
  name: string;
  type: "folder" | "image";
  url?: string;
  path?: string;
  size?: number;
  cat_id?: string;
  title?: string;
  description?: string;
  is_primary?: boolean;
  created_at?: string;
}

interface CatImagesModalProps {
  catId: string;
  catName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CatImagesModal: React.FC<CatImagesModalProps> = ({
  catId,
  catName,
  isOpen,
  onClose,
}) => {
  // Assigned images state
  const [assignedImages, setAssignedImages] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewedImage, setViewedImage] = useState<CatImage | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("assigned");

  // Gallery browser state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Domů"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Modals
  const [viewImageOpened, { open: openViewImage, close: closeViewImage }] =
    useDisclosure(false);

  // Fetch assigned images when the modal is opened
  useEffect(() => {
    if (isOpen && catId) {
      fetchAssignedImages();

      if (activeTab === "gallery") {
        fetchGalleryItems();
      }
    }
  }, [isOpen, catId, activeTab]);

  // Update breadcrumbs when path changes
  useEffect(() => {
    const pathParts = currentPath ? currentPath.split("/") : [];
    setBreadcrumbs(["Domů", ...pathParts]);
    setCurrentPage(1); // Reset to first page when changing directories
  }, [currentPath]);

  // Fetch gallery items when path, page, sort changes
  useEffect(() => {
    if (activeTab === "gallery") {
      fetchGalleryItems();
    }
  }, [currentPath, currentPage, sortBy, activeTab]);

  // Fetch images assigned to this cat
  const fetchAssignedImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("images")
        .select("id, url, title, description, is_primary, created_at")
        .eq("cat_id", catId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAssignedImages(data || []);
    } catch (error) {
      console.error("Error fetching cat images:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst obrázky kočky",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch gallery items for browser
  const fetchGalleryItems = async () => {
    setGalleryLoading(true);
    try {
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;

      // Get folders with pagination
      const folderPath = currentPath ? `${currentPath}/` : "";
      const { data: folders, error: folderError } = await supabase.storage
        .from("gallery")
        .list(folderPath, {
          limit: itemsPerPage,
          offset: offset,
          sortBy: {
            column: "name",
            order: sortBy.includes("asc") ? "asc" : "desc",
          },
          search: searchTerm,
        });

      if (folderError) throw folderError;

      // Get total count for pagination
      const { data: allFolders, error: countError } = await supabase.storage
        .from("gallery")
        .list(folderPath, {
          limit: 1000, // Just to get a count, using a large number
        });

      if (!countError && allFolders) {
        const filteredCount = allFolders.filter(
          (item) => item && item.name !== ".emptyFolderPlaceholder"
        ).length;
        setTotalPages(Math.ceil(filteredCount / itemsPerPage));
      }

      // Process folder data
      const items: GalleryItem[] = folders
        .filter((item) => item && item.name !== ".emptyFolderPlaceholder")
        .map((folder) => {
          // Check if the name has a file extension typical for images AND has a size
          const isImage =
            /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(folder.name) &&
            folder.metadata?.size;

          const path = currentPath
            ? `${currentPath}/${folder.name}`
            : folder.name;

          // Generate full URL for images
          const fullUrl = isImage
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${path}`
            : undefined;

          return {
            id: folder.id || folder.name,
            name: folder.name,
            type: isImage ? "image" : "folder",
            path: path,
            size: folder.metadata?.size,
            created_at: folder.created_at,
            url: fullUrl,
          };
        });

      // Fetch related metadata for images from database
      const imageItems = items.filter((item) => item.type === "image");
      if (imageItems.length > 0) {
        // Get all image URLs to match against database
        const imageUrls = imageItems
          .map((item) => item.url)
          .filter(Boolean) as string[];

        const { data: imageData, error: imageError } = await supabase
          .from("images")
          .select("id, cat_id, url, title, description, is_primary, created_at")
          .in("url", imageUrls);

        if (!imageError && imageData) {
          // Merge database data with storage data
          items.forEach((item) => {
            if (item.type === "image" && item.url) {
              // Match by full URL
              const matchingImage = imageData.find(
                (img) => img.url === item.url
              );
              if (matchingImage) {
                item.id = matchingImage.id;
                item.cat_id = matchingImage.cat_id;
                item.title = matchingImage.title;
                item.description = matchingImage.description;
                item.is_primary = matchingImage.is_primary;
                if (matchingImage.created_at) {
                  item.created_at = matchingImage.created_at;
                }
              }
            }
          });
        }
      }

      setGalleryItems(items);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst položky z galerie",
        color: "red",
      });
    } finally {
      setGalleryLoading(false);
    }
  };

  // Handle setting an image as primary
  const handleSetPrimary = async (imageId: string) => {
    try {
      // First, set all images for this cat to not primary
      await supabase
        .from("images")
        .update({ is_primary: false })
        .eq("cat_id", catId)
        .eq("is_primary", true);

      // Then, set this image as primary
      const { error } = await supabase
        .from("images")
        .update({ is_primary: true })
        .eq("id", imageId);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl nastaven jako primární",
        color: "green",
      });

      // Refresh images
      fetchAssignedImages();
    } catch (error) {
      console.error("Error setting primary image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se nastavit primární obrázek",
        color: "red",
      });
    }
  };

  // Handle unassigning an image from the cat
  const handleUnassignImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("images")
        .update({ cat_id: null, is_primary: false })
        .eq("id", imageId);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl odebrán z kočky",
        color: "green",
      });

      // Refresh images
      fetchAssignedImages();
    } catch (error) {
      console.error("Error unassigning image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se odebrat obrázek",
        color: "red",
      });
    }
  };

  // Handle assigning an image to the cat
  const handleAssignImage = async (url: string) => {
    try {
      // First check if this image is already in the database
      const { data: existingImages, error: fetchError } = await supabase
        .from("images")
        .select("id")
        .eq("url", url);

      if (fetchError) throw fetchError;

      if (existingImages && existingImages.length > 0) {
        // Image exists in database, update it
        const { error } = await supabase
          .from("images")
          .update({ cat_id: catId })
          .eq("id", existingImages[0].id);

        if (error) throw error;
      } else {
        // Image doesn't exist in database, create it
        const fileName = url.split("/").pop() || "image";

        const { error } = await supabase.from("images").insert({
          url: url,
          title: fileName,
          cat_id: catId,
          is_primary: false,
        });

        if (error) throw error;
      }

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl přiřazen ke kočce",
        color: "green",
      });

      // Refresh images
      fetchAssignedImages();
      if (activeTab === "gallery") {
        fetchGalleryItems();
      }
    } catch (error) {
      console.error("Error assigning image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přiřadit obrázek",
        color: "red",
      });
    }
  };

  // Handle setting a newly assigned image as primary
  const handleAssignAsPrimary = async (url: string) => {
    try {
      // First, set all images for this cat to not primary
      await supabase
        .from("images")
        .update({ is_primary: false })
        .eq("cat_id", catId)
        .eq("is_primary", true);

      // Check if this image is already in the database
      const { data: existingImages, error: fetchError } = await supabase
        .from("images")
        .select("id")
        .eq("url", url);

      if (fetchError) throw fetchError;

      if (existingImages && existingImages.length > 0) {
        // Image exists in database, update it
        const { error } = await supabase
          .from("images")
          .update({ cat_id: catId, is_primary: true })
          .eq("id", existingImages[0].id);

        if (error) throw error;
      } else {
        // Image doesn't exist in database, create it
        const fileName = url.split("/").pop() || "image";

        const { error } = await supabase.from("images").insert({
          url: url,
          title: fileName,
          cat_id: catId,
          is_primary: true,
        });

        if (error) throw error;
      }

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl přiřazen ke kočce a nastaven jako primární",
        color: "green",
      });

      // Refresh images
      fetchAssignedImages();
      if (activeTab === "gallery") {
        fetchGalleryItems();
      }
    } catch (error) {
      console.error("Error assigning image as primary:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přiřadit obrázek jako primární",
        color: "red",
      });
    }
  };

  // Handle folder navigation
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setSearchTerm(""); // Clear search term when navigating to a folder
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      // Home
      setCurrentPath("");
    } else {
      // Navigate to specific path
      const newPath = breadcrumbs.slice(1, index + 1).join("/");
      setCurrentPath(newPath);
    }
    setSearchTerm(""); // Clear search term when using breadcrumb navigation
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Render assigned images grid
  const renderAssignedImages = () => {
    if (loading) {
      return (
        <Center py="xl">
          <Loader />
        </Center>
      );
    }

    if (assignedImages.length === 0) {
      return (
        <Alert title="Žádné obrázky" color="blue">
          Tato kočka nemá přiřazené žádné obrázky.
        </Alert>
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
        {assignedImages.map((image) => (
          <Card key={image.id} padding="xs" radius="md" withBorder>
            <Card.Section pos="relative">
              <Image
                src={image.url}
                height={150}
                alt={image.title || "Obrázek kočky"}
                fit="cover"
                onClick={() => {
                  setViewedImage(image);
                  openViewImage();
                }}
                style={{ cursor: "pointer" }}
              />
              {image.is_primary && (
                <Box
                  pos="absolute"
                  top={5}
                  left={5}
                  bg="green.6"
                  px={5}
                  py={2}
                  style={{ borderRadius: 4 }}
                >
                  <Text size="xs" c="white">
                    Primární
                  </Text>
                </Box>
              )}
              <Menu position="bottom-end" withArrow>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    pos="absolute"
                    top={5}
                    right={5}
                    bg="rgba(255,255,255,0.8)"
                  >
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => {
                      setViewedImage(image);
                      openViewImage();
                    }}
                  >
                    Zobrazit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconCheck size={14} />}
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={image.is_primary}
                  >
                    Nastavit jako primární
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPhotoOff size={14} />}
                    color="orange"
                    onClick={() => handleUnassignImage(image.id)}
                  >
                    Odebrat z kočky
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Card.Section>
            <Text size="sm" fw={500} lineClamp={1} mt={5}>
              {image.title || "Bez názvu"}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  // Render gallery browser
  const renderGalleryBrowser = () => {
    if (galleryLoading) {
      return (
        <Center py="xl">
          <Loader />
        </Center>
      );
    }

    if (galleryItems.length === 0) {
      return (
        <Center py="xl">
          <Text c="dimmed">
            {searchTerm
              ? "Nenalezeny žádné položky odpovídající vašemu vyhledávání"
              : "Žádné položky v této složce"}
          </Text>
        </Center>
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
        {galleryItems.map((item) => (
          <Card key={item.id || item.name} padding="xs" radius="md" withBorder>
            <Card.Section pos="relative">
              {item.type === "folder" ? (
                <Box
                  onClick={() => navigateToFolder(item.path || "")}
                  style={{ cursor: "pointer", textAlign: "center" }}
                  py="xl"
                >
                  <IconFolder size={64} opacity={0.7} />
                </Box>
              ) : (
                <>
                  <Image
                    src={item.url}
                    height={150}
                    alt={item.name}
                    fit="cover"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (item.url) {
                        if (item.cat_id === catId) {
                          notifications.show({
                            title: "Informace",
                            message:
                              "Tento obrázek již je přiřazen k této kočce",
                            color: "blue",
                          });
                        } else if (item.cat_id) {
                          notifications.show({
                            title: "Varování",
                            message:
                              "Tento obrázek je již přiřazen k jiné kočce",
                            color: "yellow",
                          });
                        } else {
                          // If this is the first image for this cat, set it as primary
                          if (assignedImages.length === 0) {
                            handleAssignAsPrimary(item.url);
                          } else {
                            handleAssignImage(item.url);
                          }
                        }
                      }
                    }}
                  />
                  {item.cat_id === catId && item.is_primary && (
                    <Box
                      pos="absolute"
                      top={5}
                      left={5}
                      bg="green.6"
                      px={5}
                      py={2}
                      style={{ borderRadius: 4 }}
                    >
                      <Text size="xs" c="white">
                        Primární
                      </Text>
                    </Box>
                  )}
                  {item.cat_id === catId && !item.is_primary && (
                    <Box
                      pos="absolute"
                      top={5}
                      left={5}
                      bg="blue.6"
                      px={5}
                      py={2}
                      style={{ borderRadius: 4 }}
                    >
                      <Text size="xs" c="white">
                        Přiřazeno
                      </Text>
                    </Box>
                  )}
                  {item.cat_id && item.cat_id !== catId && (
                    <Box
                      pos="absolute"
                      top={5}
                      left={5}
                      bg="yellow.6"
                      px={5}
                      py={2}
                      style={{ borderRadius: 4 }}
                    >
                      <Text size="xs" c="white">
                        Jiná kočka
                      </Text>
                    </Box>
                  )}
                </>
              )}
            </Card.Section>
            <Text size="sm" fw={500} lineClamp={1} title={item.name} mt={5}>
              {item.name}
            </Text>
            {item.type === "image" && item.size && (
              <Text size="xs" c="dimmed">
                {item.size > 1024 * 1024
                  ? `${(item.size / (1024 * 1024)).toFixed(1)} MB`
                  : `${(item.size / 1024).toFixed(0)} KB`}
              </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={onClose}
        title={`Obrázky kočky: ${catName}`}
        size="xl"
      >
        <Stack>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="assigned" leftSection={<IconPhoto size={16} />}>
                Přiřazené obrázky
              </Tabs.Tab>
              <Tabs.Tab
                value="gallery"
                leftSection={<IconFolderPlus size={16} />}
              >
                Galerie
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          {activeTab === "assigned" ? (
            <Box py="md">{renderAssignedImages()}</Box>
          ) : (
            <Box py="md">
              {/* Gallery browser UI */}
              <Stack gap="md">
                {/* Navigation breadcrumbs */}
                <Breadcrumbs>
                  {breadcrumbs.map((crumb, index) => (
                    <Anchor
                      key={index}
                      onClick={() => handleBreadcrumbClick(index)}
                    >
                      {crumb}
                    </Anchor>
                  ))}
                </Breadcrumbs>

                {/* Search and sort controls */}
                <Flex gap="md" align="center" wrap="wrap">
                  <Input
                    placeholder="Hledat..."
                    leftSection={<IconSearch size={16} />}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ flexGrow: 1 }}
                  />

                  <SegmentedControl
                    size="xs"
                    value={sortBy}
                    onChange={setSortBy}
                    data={[
                      { label: "Název ↑", value: "name-asc" },
                      { label: "Název ↓", value: "name-desc" },
                    ]}
                  />
                </Flex>

                {/* Gallery items */}
                <Paper withBorder p="md">
                  {renderGalleryBrowser()}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Center mt="xl">
                      <Pagination
                        value={currentPage}
                        onChange={setCurrentPage}
                        total={totalPages}
                        withEdges
                      />
                    </Center>
                  )}
                </Paper>
              </Stack>
            </Box>
          )}

          <Group justify="right">
            <Button onClick={onClose}>Zavřít</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Image Modal */}
      <Modal
        opened={viewImageOpened}
        onClose={closeViewImage}
        title={viewedImage?.title || "Náhled obrázku"}
        size="lg"
        centered
      >
        {viewedImage && (
          <Stack>
            <Image
              src={viewedImage.url}
              alt={viewedImage.title || "Obrázek kočky"}
              fit="contain"
              mah={500}
            />
            {viewedImage.description && (
              <Text size="sm" c="dimmed">
                {viewedImage.description}
              </Text>
            )}
            <Group gap="md">
              {viewedImage.is_primary && (
                <Badge color="green">Primární obrázek</Badge>
              )}
              {viewedImage.created_at && (
                <Text size="sm">
                  Nahráno:{" "}
                  {new Date(viewedImage.created_at).toLocaleDateString("cs-CZ")}
                </Text>
              )}
            </Group>
            <Group justify="right" mt="md">
              <Button
                leftSection={<IconCopy size={16} />}
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(viewedImage.url);
                  notifications.show({
                    title: "Zkopírováno",
                    message: "URL obrázku bylo zkopírováno do schránky",
                    color: "green",
                  });
                }}
              >
                Kopírovat URL
              </Button>
              <Button
                leftSection={<IconCheck size={14} />}
                variant="outline"
                onClick={() => {
                  handleSetPrimary(viewedImage.id);
                  closeViewImage();
                }}
                disabled={viewedImage.is_primary}
              >
                Nastavit jako primární
              </Button>
              <Button
                leftSection={<IconPhotoOff size={16} />}
                variant="outline"
                color="orange"
                onClick={() => {
                  handleUnassignImage(viewedImage.id);
                  closeViewImage();
                }}
              >
                Odebrat z kočky
              </Button>
              <Button onClick={closeViewImage}>Zavřít</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default CatImagesModal;
