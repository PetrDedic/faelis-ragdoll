"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Group,
  Stack,
  Text,
  Card,
  Image,
  SimpleGrid,
  Modal,
  LoadingOverlay,
  Paper,
  Box,
  Breadcrumbs,
  Anchor,
  Pagination,
  SegmentedControl,
  Flex,
  Input,
  CopyButton,
  Button,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconFolder,
  IconSearch,
  IconDownload,
  IconCopy,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import supabase from "../utils/supabase/client";

// Import translations
import csTranslations from "../locales/cs/gallery.json";
import enTranslations from "../locales/en/gallery.json";
import deTranslations from "../locales/de/gallery.json";
import GalleryPageSEO from "../components/SEO/GalleryPageSEO";

// Define types
interface GalleryItem {
  id: string;
  name: string;
  type: "folder" | "image";
  url?: string;
  path?: string;
  size?: number;
  title?: string;
  description?: string;
  created_at?: string;
}

const GalleryPage = () => {
  const router = useRouter();
  const { locale } = router;

  // Create a translations object with all locales
  const translations = {
    cs: csTranslations,
    en: enTranslations,
    de: deTranslations,
  };

  // Use the current locale from router or fallback to Czech
  const t =
    translations[locale as keyof typeof translations] || translations.cs;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Modals state
  const [viewImageOpened, { open: openViewImage, close: closeViewImage }] =
    useDisclosure(false);

  // Initialize and fetch gallery items
  useEffect(() => {
    fetchGalleryItems();
  }, [currentPath, currentPage, sortBy]);

  // Update breadcrumbs when path changes
  useEffect(() => {
    const pathParts = currentPath ? currentPath.split("/") : [];
    setBreadcrumbs([t.breadcrumbs.home, ...pathParts]);
    setCurrentPage(1); // Reset to first page when changing directories
  }, [currentPath, t.breadcrumbs.home]);

  // Fetch gallery items for current path
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;

      // First, get folders with pagination
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

      if (folderError) {
        throw folderError;
      }

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
        setTotalItems(filteredCount);
        setTotalPages(Math.ceil(filteredCount / itemsPerPage));
      }

      // Process folder data
      const folderItems: GalleryItem[] = folders
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
      const imageItems = folderItems.filter((item) => item.type === "image");
      if (imageItems.length > 0) {
        // Get all image URLs to match against database
        const imageUrls = imageItems.map((item) => item.url);

        const { data: imageData, error: imageError } = await supabase
          .from("images")
          .select("id, url, title, description, created_at")
          .in("url", imageUrls);

        if (!imageError && imageData) {
          // Merge database data with storage data
          folderItems.forEach((item) => {
            if (item.type === "image" && item.url) {
              // Match by full URL
              const matchingImage = imageData.find(
                (img) => img.url === item.url
              );
              if (matchingImage) {
                item.id = matchingImage.id;
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

      setItems(folderItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      notifications.show({
        title: t.notifications.error.title,
        message: t.notifications.error.loadFailed,
        color: "red",
      });
    } finally {
      setLoading(false);
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

  // Download image
  const handleDownload = async (item: GalleryItem) => {
    if (!item.url) return;

    try {
      // Fetch the image
      const response = await fetch(item.url);
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      notifications.show({
        title: t.notifications.error.title,
        message: t.notifications.error.downloadFailed,
        color: "red",
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
    fetchGalleryItems(); // Trigger reload with search
  };

  // Render gallery items (folders and images)
  const renderGalleryItems = () => {
    if (items.length === 0) {
      return (
        <Center py="xl">
          <Text c="dimmed">
            {searchTerm ? t.empty.noSearchResults : t.empty.noItems}
          </Text>
        </Center>
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
        {items.map((item) => (
          <Card key={item.id || item.name} padding="xs" radius="md" withBorder>
            <Card.Section pos="relative">
              {item.type === "folder" ? (
                <Box
                  onClick={() => navigateToFolder(item.path || "")}
                  py="xl"
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <IconFolder size={64} opacity={0.7} />
                </Box>
              ) : (
                <Image
                  src={item.url}
                  height={150}
                  alt={item.name}
                  fit="cover"
                  onClick={() => {
                    setSelectedItem(item);
                    openViewImage();
                  }}
                  style={{ cursor: "pointer" }}
                />
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
      <GalleryPageSEO />
      <Stack gap="lg" p={16} maw={1280} mx="auto">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Title order={2}>{t.title}</Title>

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
          placeholder={t.search.placeholder}
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
            { label: t.sort.nameAsc, value: "name-asc" },
            { label: t.sort.nameDesc, value: "name-desc" },
            { label: t.sort.dateAsc, value: "date-asc" },
            { label: t.sort.dateDesc, value: "date-desc" },
          ]}
        />
      </Flex>

      {/* Gallery items */}
      <Paper withBorder p="md">
        {renderGalleryItems()}

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

      {/* View Image Modal */}
      <Modal
        opened={viewImageOpened}
        onClose={closeViewImage}
        title={
          selectedItem?.title || selectedItem?.name || t.modal.imagePreview
        }
        size="lg"
        centered
      >
        {selectedItem?.url && (
          <Stack>
            <Image
              src={selectedItem.url}
              alt={selectedItem.name}
              fit="contain"
              mah={500}
            />
            {selectedItem.description && (
              <Text size="sm" c="dimmed">
                {selectedItem.description}
              </Text>
            )}
            {selectedItem.size && (
              <Text size="sm">
                <strong>{t.fileInfo.size}</strong>{" "}
                {selectedItem.size > 1024 * 1024
                  ? `${(selectedItem.size / (1024 * 1024)).toFixed(1)} MB`
                  : `${(selectedItem.size / 1024).toFixed(0)} KB`}
              </Text>
            )}
            <Group justify="right">
              <CopyButton
                value={selectedItem.url ? encodeURI(selectedItem.url) : ""}
                timeout={2000}
              >
                {({ copied, copy }) => (
                  <Button
                    leftSection={<IconCopy size={16} />}
                    variant="outline"
                    onClick={copy}
                  >
                    {copied ? t.buttons.copied : t.buttons.copy}
                  </Button>
                )}
              </CopyButton>
              <Button
                leftSection={<IconDownload size={16} />}
                variant="outline"
                onClick={() => handleDownload(selectedItem)}
              >
                {t.buttons.download}
              </Button>
              <Button onClick={closeViewImage}>{t.buttons.close}</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
    </>
  );
};

export default GalleryPage;
