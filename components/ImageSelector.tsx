"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  SimpleGrid,
  Image,
  Text,
  LoadingOverlay,
  Pagination,
  Breadcrumbs,
  Anchor,
  Stack,
  Input,
  Flex,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import supabase from "../utils/supabase/client";

interface GalleryItem {
  id: string;
  name: string;
  type: "folder" | "image";
  url?: string;
  path?: string;
}

interface ImageSelectorProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  opened,
  onClose,
  onSelect,
}) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Domů"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (opened) fetchGalleryItems();
  }, [opened, currentPath, currentPage]);

  useEffect(() => {
    const pathParts = currentPath ? currentPath.split("/") : [];
    setBreadcrumbs(["Domů", ...pathParts]);
  }, [currentPath]);

  const fetchGalleryItems = async () => {
    try {
      const offset = (currentPage - 1) * 20;
      const folderPath = currentPath ? `${currentPath}/` : "";

      const { data: items, error } = await supabase.storage
        .from("gallery")
        .list(folderPath, { limit: 20, offset });

      if (error) throw error;

      const galleryItems: GalleryItem[] = items
        .filter((item) => item.name !== ".emptyFolderPlaceholder")
        .map((item) => ({
          id: item.id || item.name,
          name: item.name,
          type: /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.name)
            ? "image"
            : "folder",
          path: currentPath ? `${currentPath}/${item.name}` : item.name,
          url: /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(item.name)
            ? `${
                process.env.NEXT_PUBLIC_SUPABASE_URL
              }/storage/v1/object/public/gallery/${
                currentPath ? `${currentPath}/` : ""
              }${item.name}`
            : undefined,
        }));

      setTotalPages(Math.ceil(galleryItems.length / 20));
      setItems(galleryItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setCurrentPage(1);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) setCurrentPath("");
    else setCurrentPath(breadcrumbs.slice(1, index + 1).join("/"));
    setCurrentPage(1);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Vybrat obrázek"
      size="xl"
      centered
    >
      <LoadingOverlay visible={false} />

      <Stack gap="sm">
        <Breadcrumbs>
          {breadcrumbs.map((crumb, index) => (
            <Anchor key={crumb} onClick={() => handleBreadcrumbClick(index)}>
              {crumb}
            </Anchor>
          ))}
        </Breadcrumbs>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
          {items.map((item) =>
            item.type === "folder" ? (
              <Stack key={item.id} gap={2} align="center">
                <Image
                  src="/folder-placeholder.svg"
                  height={120}
                  width="100%"
                  fit="contain"
                  alt="folder"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateToFolder(item.path || "")}
                />
                <Text size="sm">{item.name}</Text>
              </Stack>
            ) : (
              <Stack key={item.id} gap={2} align="center">
                <Image
                  src={item.url}
                  height={120}
                  width="100%"
                  fit="cover"
                  radius="sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => item.url && handleSelect(item.url)}
                />
                <Text size="xs" lineClamp={1}>
                  {item.name}
                </Text>
              </Stack>
            )
          )}
        </SimpleGrid>

        {totalPages > 1 && (
          <Flex justify="center">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
            />
          </Flex>
        )}
      </Stack>
    </Modal>
  );
};

export default ImageSelector;
