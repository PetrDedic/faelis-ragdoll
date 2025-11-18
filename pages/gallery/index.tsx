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
  Skeleton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconFolder,
  IconSearch,
  IconDownload,
  IconCopy,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import supabase from "../../utils/supabase/client";

// Import translations
import csTranslations from "../../locales/cs/gallery.json";
import enTranslations from "../../locales/en/gallery.json";
import deTranslations from "../../locales/de/gallery.json";
import GalleryPageSEO from "../../components/SEO/GalleryPageSEO";

// Define types
interface GalleryItem {
  id: string;
  name: string;
  type: "folder" | "image";
  url?: string | null;
  path?: string;
  size?: number | null;
  title?: string | null;
  description?: string | null;
  created_at?: string | null;
}

interface GalleryPageProps {
  initialItems: GalleryItem[];
  initialTotalItems: number;
  initialTotalPages: number;
}

const GalleryPage = ({
  initialItems,
  initialTotalItems,
  initialTotalPages,
}: GalleryPageProps) => {
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

  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const itemsPerPage = 20;

  // Modals state
  const [viewImageOpened, { open: openViewImage, close: closeViewImage }] =
    useDisclosure(false);

  // Helper function to safely encode path segments for URLs
  // This handles special characters like spaces, commas, etc.
  // Example: ["former cats", "Jipsiglenn Orion Azragbey, RAG b"]
  //       -> "former%20cats/Jipsiglenn%20Orion%20Azragbey%2C%20RAG%20b"
  const encodePathSegments = (segments: string[]) => {
    return segments.map((segment) => encodeURIComponent(segment)).join("/");
  };

  // Helper function to generate gallery href from path
  const getGalleryHref = (path: string) => {
    if (!path) return "/gallery";
    const pathSegments = path.split("/");
    const encodedPath = encodePathSegments(pathSegments);
    return `/gallery/${encodedPath}`;
  };

  // Root gallery - no path
  const currentPath = "";
  const urlPath: string[] = [];

  // Generate breadcrumbs from URL path
  const breadcrumbs = [t.breadcrumbs.home];

  // Mark initial load as complete after router is ready
  useEffect(() => {
    if (router.isReady && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [router.isReady]);

  // Fetch gallery items only when user interacts (pagination, sorting)
  // Skip initial load since data comes from SSR
  useEffect(() => {
    if (router.isReady && !isInitialLoad) {
      fetchGalleryItems();
    }
  }, [currentPage, sortBy]);

  // Fetch gallery items for current path
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;

      // Root folder
      const folderPath = "";

      // First, get folders with pagination
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

          const itemPath = folder.name;

          // Generate full URL for images
          const fullUrl = isImage
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${itemPath}`
            : undefined;

          return {
            id: folder.id || folder.name,
            name: folder.name,
            type: isImage ? "image" : "folder",
            path: itemPath,
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

  // Handle image click - now updates the URL
  const handleImageClick = (item: GalleryItem) => {
    setSelectedItem(item);
    openViewImage();

    // Update URL to include the image with proper encoding
    const imagePath = item.path || item.name;
    const pathSegments = imagePath.split("/");
    const encodedPath = encodePathSegments(pathSegments);
    router.push(`/gallery/${encodedPath}`, undefined, { shallow: true });
  };

  // Handle modal close - remove image from URL
  const handleCloseImage = () => {
    closeViewImage();

    // Navigate back to the root gallery
    router.push("/gallery", undefined, { shallow: true });
  };

  // Navigate to previous/next image
  const imageItems = items.filter((item) => item.type === "image");
  const currentImageIndex = selectedItem
    ? imageItems.findIndex(
        (item) => item.id === selectedItem.id || item.name === selectedItem.name
      )
    : -1;
  const hasPrevious = currentImageIndex > 0;
  const hasNext =
    currentImageIndex >= 0 && currentImageIndex < imageItems.length - 1;

  const navigateToPrevious = () => {
    if (hasPrevious) {
      const previousImage = imageItems[currentImageIndex - 1];
      setSelectedItem(previousImage);
      const imagePath = previousImage.path || previousImage.name;
      const pathSegments = imagePath.split("/");
      const encodedPath = encodePathSegments(pathSegments);
      router.push(`/gallery/${encodedPath}`, undefined, { shallow: true });
    }
  };

  const navigateToNext = () => {
    if (hasNext) {
      const nextImage = imageItems[currentImageIndex + 1];
      setSelectedItem(nextImage);
      const imagePath = nextImage.path || nextImage.name;
      const pathSegments = imagePath.split("/");
      const encodedPath = encodePathSegments(pathSegments);
      router.push(`/gallery/${encodedPath}`, undefined, { shallow: true });
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!viewImageOpened) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCloseImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewImageOpened, currentImageIndex, imageItems]);

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

  // Render skeleton loaders while loading
  const renderSkeletons = () => {
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Card key={index} padding="xs" radius="md" withBorder>
            <Card.Section>
              <Skeleton height={150} />
            </Card.Section>
            <Skeleton height={16} mt={10} width="80%" />
            <Skeleton height={12} mt={6} width="40%" />
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  // Render gallery items (folders and images)
  const renderGalleryItems = () => {
    if (loading) {
      return renderSkeletons();
    }

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
                <Link
                  prefetch={false}
                  href={getGalleryHref(item.path || "")}
                  onClick={() => setSearchTerm("")}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <Box
                    py="xl"
                    style={{ cursor: "pointer", textAlign: "center" }}
                  >
                    <IconFolder size={64} opacity={0.7} />
                  </Box>
                </Link>
              ) : (
                <Link
                  prefetch={false}
                  href={getGalleryHref(item.path || item.name)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick(item);
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Image
                    src={item.url}
                    height={150}
                    alt={item.name}
                    fit="cover"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
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
        <Title order={2}>{t.title}</Title>

        {/* Navigation breadcrumbs */}
        <Breadcrumbs>
          {breadcrumbs.map((crumb, index) => (
            <Anchor key={index}>{crumb}</Anchor>
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
          onClose={handleCloseImage}
          title={
            selectedItem?.title || selectedItem?.name || t.modal.imagePreview
          }
          size="lg"
          centered
        >
          {selectedItem?.url && (
            <Stack>
              {/* Image with navigation arrows */}
              <Box pos="relative">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  fit="contain"
                  mah={500}
                />

                {/* Previous button overlay */}
                {hasPrevious && (
                  <Button
                    pos="absolute"
                    left={10}
                    top="50%"
                    style={{ transform: "translateY(-50%)" }}
                    variant="filled"
                    color="gray"
                    size="lg"
                    radius="xl"
                    onClick={navigateToPrevious}
                    aria-label="Previous image"
                  >
                    <IconChevronLeft size={24} />
                  </Button>
                )}

                {/* Next button overlay */}
                {hasNext && (
                  <Button
                    pos="absolute"
                    right={10}
                    top="50%"
                    style={{ transform: "translateY(-50%)" }}
                    variant="filled"
                    color="gray"
                    size="lg"
                    radius="xl"
                    onClick={navigateToNext}
                    aria-label="Next image"
                  >
                    <IconChevronRight size={24} />
                  </Button>
                )}
              </Box>

              {/* Image counter */}
              {imageItems.length > 1 && (
                <Text size="sm" ta="center" c="dimmed">
                  {currentImageIndex + 1} / {imageItems.length}
                </Text>
              )}

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
              <Group justify="space-between">
                {/* Navigation buttons */}
                <Group gap="xs">
                  <Button
                    leftSection={<IconChevronLeft size={16} />}
                    variant="default"
                    onClick={navigateToPrevious}
                    disabled={!hasPrevious}
                  >
                    Previous
                  </Button>
                  <Button
                    rightSection={<IconChevronRight size={16} />}
                    variant="default"
                    onClick={navigateToNext}
                    disabled={!hasNext}
                  >
                    Next
                  </Button>
                </Group>

                {/* Action buttons */}
                <Group gap="xs">
                  <CopyButton
                    value={
                      typeof window !== "undefined" && window.location.href
                        ? window.location.href
                        : selectedItem.url || ""
                    }
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
                  <Button onClick={handleCloseImage}>{t.buttons.close}</Button>
                </Group>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </>
  );
};

// Server-side rendering for better SEO and crawler indexing
export const getServerSideProps: GetServerSideProps<
  GalleryPageProps
> = async () => {
  const itemsPerPage = 20;
  const folderPath = ""; // Root folder

  try {
    // Fetch folders from Supabase storage
    const { data: folders, error: folderError } = await supabase.storage
      .from("gallery")
      .list(folderPath, {
        limit: itemsPerPage,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (folderError) {
      console.error("Error fetching gallery items:", folderError);
      return {
        props: {
          initialItems: [],
          initialTotalItems: 0,
          initialTotalPages: 0,
        },
      };
    }

    // Get total count for pagination
    const { data: allFolders, error: countError } = await supabase.storage
      .from("gallery")
      .list(folderPath, {
        limit: 1000,
      });

    const totalItems =
      !countError && allFolders
        ? allFolders.filter(
            (item) => item && item.name !== ".emptyFolderPlaceholder"
          ).length
        : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Process folder data
    const folderItems: GalleryItem[] = folders
      .filter((item) => item && item.name !== ".emptyFolderPlaceholder")
      .map((folder) => {
        const isImage =
          /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(folder.name) &&
          folder.metadata?.size;

        const itemPath = folder.name;

        const fullUrl = isImage
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${itemPath}`
          : undefined;

        return {
          id: folder.id || folder.name,
          name: folder.name,
          type: isImage ? "image" : "folder",
          path: itemPath,
          size: folder.metadata?.size ?? null,
          created_at: folder.created_at ?? null,
          url: fullUrl ?? null,
        };
      });

    // Fetch related metadata for images from database
    const imageItems = folderItems.filter((item) => item.type === "image");
    if (imageItems.length > 0) {
      const imageUrls = imageItems.map((item) => item.url);

      const { data: imageData, error: imageError } = await supabase
        .from("images")
        .select("id, url, title, description, created_at")
        .in("url", imageUrls);

      if (!imageError && imageData) {
        folderItems.forEach((item) => {
          if (item.type === "image" && item.url) {
            const matchingImage = imageData.find((img) => img.url === item.url);
            if (matchingImage) {
              item.id = matchingImage.id;
              item.title = matchingImage.title ?? null;
              item.description = matchingImage.description ?? null;
              item.created_at = matchingImage.created_at ?? null;
            }
          }
        });
      }
    }

    return {
      props: {
        initialItems: folderItems,
        initialTotalItems: totalItems,
        initialTotalPages: totalPages,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialItems: [],
        initialTotalItems: 0,
        initialTotalPages: 0,
      },
    };
  }
};

export default GalleryPage;
