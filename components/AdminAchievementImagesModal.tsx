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
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import supabase from "../utils/supabase/client";

interface AchievementImage {
  id: string;
  url: string;
  is_primary: boolean;
  title?: string;
  description?: string;
  created_at?: string;
  display_order?: number;
}

interface GalleryItem {
  id: string;
  name: string;
  type: "folder" | "image";
  url?: string;
  path?: string;
  size?: number;
  created_at?: string;
  title?: string;
  description?: string;
}

interface AchievementImagesModalProps {
  achievementId: string;
  achievementTitle: string;
  catName: string;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementImagesModal: React.FC<AchievementImagesModalProps> = ({
  achievementId,
  achievementTitle,
  catName,
  isOpen,
  onClose,
}) => {
  // Assigned images state
  const [assignedImages, setAssignedImages] = useState<AchievementImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewedImage, setViewedImage] = useState<AchievementImage | null>(null);
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
    if (isOpen && achievementId) {
      fetchAssignedImages();

      if (activeTab === "gallery") {
        fetchGalleryItems();
      }
    }
  }, [isOpen, achievementId, activeTab]);

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

  // Initialize display_order for images that don't have it
  const initializeDisplayOrder = async () => {
    const imagesWithoutOrder = assignedImages.filter(
      (img) => img.display_order === undefined || img.display_order === null
    );
    const imagesWithOrder = assignedImages.filter(
      (img) => img.display_order !== undefined && img.display_order !== null
    );

    if (imagesWithoutOrder.length > 0) {
      const maxOrder =
        imagesWithOrder.length > 0
          ? Math.max(...imagesWithOrder.map((img) => img.display_order!))
          : 0;

      const updatePromises = imagesWithoutOrder.map((img, index) =>
        supabase
          .from("achievement_images")
          .update({ display_order: maxOrder + index + 1 })
          .eq("id", img.id)
      );

      await Promise.all(updatePromises);
      fetchAssignedImages(); // Refresh the list
    }
  };

  const fetchAssignedImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("achievement_images")
        .select(
          "id, url, title, description, is_primary, created_at, display_order"
        )
        .eq("achievement_id", achievementId)
        .order("display_order", { ascending: true })
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAssignedImages(data || []);

      // Initialize display_order for images that don't have it
      const imagesWithoutOrder = (data || []).filter(
        (img) => img.display_order === undefined || img.display_order === null
      );
      const imagesWithOrder = (data || []).filter(
        (img) => img.display_order !== undefined && img.display_order !== null
      );

      if (imagesWithoutOrder.length > 0) {
        const maxOrder =
          imagesWithOrder.length > 0
            ? Math.max(...imagesWithOrder.map((img) => img.display_order!))
            : 0;

        const updatePromises = imagesWithoutOrder.map((img, index) =>
          supabase
            .from("achievement_images")
            .update({ display_order: maxOrder + index + 1 })
            .eq("id", img.id)
        );

        await Promise.all(updatePromises);

        // Fetch again to get updated data
        const { data: updatedData, error: updatedError } = await supabase
          .from("achievement_images")
          .select(
            "id, url, title, description, is_primary, created_at, display_order"
          )
          .eq("achievement_id", achievementId)
          .order("display_order", { ascending: true })
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false });

        if (!updatedError) {
          setAssignedImages(updatedData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching assigned images:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst obrázky",
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
        const imageUrls = imageItems.map((item) => item.url);

        const { data: imageData, error: imageError } = await supabase
          .from("images")
          .select("id, cat_id, url, title, description, is_primary, created_at")
          .in("url", imageUrls);

        if (!imageError && imageData) {
          // Merge database data with storage data
          items.forEach((item) => {
            if (item.type === "image" && item.url) {
              // Match by full URL now
              const matchingImage = imageData.find(
                (img) => img.url === item.url
              );
              if (matchingImage) {
                item.id = matchingImage.id;
                // Note: We don't set cat_id for achievement images
                item.title = matchingImage.title;
                item.description = matchingImage.description;
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

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  const handleBreadcrumbClick = (index: number) => {
    const pathParts = breadcrumbs.slice(1, index + 1); // Skip "Domů"
    setCurrentPath(pathParts.join("/"));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleAssignAsPrimary = async (imageUrl: string) => {
    try {
      const { error } = await supabase.from("achievement_images").insert({
        achievement_id: achievementId,
        url: imageUrl,
        is_primary: true,
        display_order: 1,
      });

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl přiřazen jako primární",
        color: "green",
      });

      fetchAssignedImages();
    } catch (error) {
      console.error("Error assigning primary image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přiřadit primární obrázek",
        color: "red",
      });
    }
  };

  const handleAssignImage = async (imageUrl: string) => {
    try {
      // Get the next display_order value
      const { data: existingImages, error: existingError } = await supabase
        .from("achievement_images")
        .select("display_order")
        .eq("achievement_id", achievementId)
        .not("display_order", "is", null)
        .order("display_order", { ascending: false })
        .limit(1);

      if (existingError) throw existingError;

      const nextOrder =
        existingImages && existingImages.length > 0
          ? (existingImages[0].display_order || 0) + 1
          : 1;

      const { error } = await supabase.from("achievement_images").insert({
        achievement_id: achievementId,
        url: imageUrl,
        is_primary: assignedImages.length === 0, // First image becomes primary
        display_order: nextOrder,
      });

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl přiřazen k úspěchu",
        color: "green",
      });

      fetchAssignedImages();
    } catch (error) {
      console.error("Error assigning image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přiřadit obrázek",
        color: "red",
      });
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("achievement_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Obrázek byl odebrán",
        color: "green",
      });

      fetchAssignedImages();
    } catch (error) {
      console.error("Error removing image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se odebrat obrázek",
        color: "red",
      });
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // First, unset all primary images for this achievement
      await supabase
        .from("achievement_images")
        .update({ is_primary: false })
        .eq("achievement_id", achievementId);

      // Then set the selected image as primary
      const { error } = await supabase
        .from("achievement_images")
        .update({ is_primary: true })
        .eq("id", imageId);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Primární obrázek byl nastaven",
        color: "green",
      });

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

  const handleMoveImage = async (imageId: string, direction: "up" | "down") => {
    try {
      const currentImage = assignedImages.find((img) => img.id === imageId);
      if (!currentImage || currentImage.display_order === undefined) return;

      const currentPosition = currentImage.display_order;
      let targetPosition: number;

      if (direction === "up") {
        targetPosition = currentPosition - 1;
        if (targetPosition < 1) return; // Already at the top
      } else {
        targetPosition = currentPosition + 1;
        if (targetPosition > assignedImages.length) return; // Already at the bottom
      }

      const targetImage = assignedImages.find(
        (img) => img.display_order === targetPosition
      );
      if (!targetImage) return;

      // Swap positions
      await supabase
        .from("achievement_images")
        .update({ display_order: targetPosition })
        .eq("id", imageId);

      await supabase
        .from("achievement_images")
        .update({ display_order: currentPosition })
        .eq("id", targetImage.id);

      notifications.show({
        title: "Úspěch",
        message: "Pořadí obrázků bylo změněno",
        color: "green",
      });

      fetchAssignedImages();
    } catch (error) {
      console.error("Error moving image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se změnit pořadí obrázků",
        color: "red",
      });
    }
  };

  const handleCopyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    notifications.show({
      title: "Úspěch",
      message: "URL obrázku bylo zkopírováno",
      color: "green",
    });
  };

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
          K tomuto úspěchu zatím nejsou přiřazeny žádné obrázky.
        </Alert>
      );
    }

    return (
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
        {assignedImages.map((image, index) => (
          <Card key={image.id} padding="xs" withBorder>
            <Card.Section pos="relative">
              <Image
                src={image.url}
                height={150}
                alt={image.title || `Obrázek ${index + 1}`}
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
                    variant="filled"
                    color="gray"
                    size="sm"
                    pos="absolute"
                    top={5}
                    right={5}
                  >
                    <IconDotsVertical size={12} />
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
                  {!image.is_primary && (
                    <Menu.Item
                      leftSection={<IconCheck size={14} />}
                      onClick={() => handleSetPrimary(image.id)}
                    >
                      Nastavit jako primární
                    </Menu.Item>
                  )}
                  {index > 0 && (
                    <Menu.Item
                      leftSection={<IconArrowUp size={14} />}
                      onClick={() => handleMoveImage(image.id, "up")}
                    >
                      Posunout nahoru
                    </Menu.Item>
                  )}
                  {index < assignedImages.length - 1 && (
                    <Menu.Item
                      leftSection={<IconArrowDown size={14} />}
                      onClick={() => handleMoveImage(image.id, "down")}
                    >
                      Posunout dolů
                    </Menu.Item>
                  )}
                  <Menu.Item
                    leftSection={<IconCopy size={14} />}
                    onClick={() => handleCopyImageUrl(image.url)}
                  >
                    Zkopírovat URL
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    Odebrat
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Card.Section>
            <Text
              size="sm"
              fw={500}
              lineClamp={1}
              title={image.title || image.url}
              mt={5}
            >
              {image.title || `Obrázek ${index + 1}`}
            </Text>
            {image.description && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {image.description}
              </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>
    );
  };

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
        <Alert title="Žádné položky" color="blue">
          {searchTerm
            ? "Nenalezeny žádné položky odpovídající vašemu vyhledávání"
            : "Žádné položky v této složce"}
        </Alert>
      );
    }

    return (
      <Stack gap="md">
        {/* Navigation breadcrumbs */}
        <Breadcrumbs>
          {breadcrumbs.map((crumb, index) => (
            <Anchor key={index} onClick={() => handleBreadcrumbClick(index)}>
              {crumb}
            </Anchor>
          ))}
        </Breadcrumbs>

        {/* Search and sort controls */}
        <Flex gap="md" align="center" wrap="wrap">
          <Input
            placeholder="Hledat v galerii..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ flexGrow: 1 }}
          />
          <SegmentedControl
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: "name-asc", label: "Název A-Z" },
              { value: "name-desc", label: "Název Z-A" },
            ]}
          />
        </Flex>

        {/* Gallery items */}
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
          {galleryItems.map((item) => (
            <Card
              key={item.id || item.name}
              padding="xs"
              radius="md"
              withBorder
            >
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
                          // Check if image is already assigned to this achievement
                          const isAssigned = assignedImages.some(
                            (img) => img.url === item.url
                          );
                          if (isAssigned) {
                            notifications.show({
                              title: "Informace",
                              message:
                                "Tento obrázek již je přiřazen k tomuto úspěchu",
                              color: "blue",
                            });
                          } else {
                            // If this is the first image for this achievement, set it as primary
                            if (assignedImages.length === 0) {
                              handleAssignAsPrimary(item.url);
                            } else {
                              handleAssignImage(item.url);
                            }
                          }
                        }
                      }}
                    />
                    {/* Show status badges */}
                    {assignedImages.some((img) => img.url === item.url) &&
                      assignedImages.find((img) => img.url === item.url)
                        ?.is_primary && (
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
                    {assignedImages.some((img) => img.url === item.url) &&
                      !assignedImages.find((img) => img.url === item.url)
                        ?.is_primary && (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Flex>
        )}
      </Stack>
    );
  };

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={onClose}
        title={`Správa obrázků - ${catName}: ${achievementTitle}`}
        size="xl"
        fullScreen
      >
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="assigned" leftSection={<IconPhoto size={14} />}>
              Přiřazené obrázky ({assignedImages.length})
            </Tabs.Tab>
            <Tabs.Tab value="gallery" leftSection={<IconFolder size={14} />}>
              Galerie
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="assigned" pt="md">
            {renderAssignedImages()}
          </Tabs.Panel>

          <Tabs.Panel value="gallery" pt="md">
            {renderGalleryBrowser()}
          </Tabs.Panel>
        </Tabs>
      </Modal>

      {/* View Image Modal */}
      <Modal
        opened={viewImageOpened}
        onClose={closeViewImage}
        title={viewedImage?.title || "Náhled obrázku"}
        size="lg"
        centered
      >
        {viewedImage?.url && (
          <Stack>
            <Image
              src={viewedImage.url}
              alt={viewedImage.title || "Obrázek"}
              fit="contain"
              mah={500}
            />
            {viewedImage.description && (
              <Text size="sm" c="dimmed">
                {viewedImage.description}
              </Text>
            )}
            <Group>
              <Text size="sm">
                <strong>URL:</strong> {viewedImage.url}
              </Text>
            </Group>
            <Group justify="right">
              <Button
                variant="outline"
                leftSection={<IconCopy size={14} />}
                onClick={() => handleCopyImageUrl(viewedImage.url)}
              >
                Zkopírovat URL
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default AchievementImagesModal;
