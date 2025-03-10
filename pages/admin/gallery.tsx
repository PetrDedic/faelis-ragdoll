"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Title,
  Group,
  Button,
  Stack,
  Text,
  Card,
  Image,
  SimpleGrid,
  Menu,
  ActionIcon,
  Modal,
  TextInput,
  Center,
  LoadingOverlay,
  Paper,
  Box,
  Breadcrumbs,
  Anchor,
  FileButton,
  Progress,
  Select,
  Switch,
  Textarea,
  Pagination,
  SegmentedControl,
  Flex,
  Input,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconFolderPlus,
  IconUpload,
  IconTrash,
  IconDotsVertical,
  IconEdit,
  IconDownload,
  IconFolder,
  IconLink,
  IconPhoto,
  IconCheck,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX,
} from "@tabler/icons-react";
import supabase from "../../utils/supabase/client";

// Define types
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

interface Cat {
  id: string;
  name: string;
}

interface Option {
  value: string;
  label: string;
}

const GalleryManagementPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Cat assignment
  const [catOptions, setCatOptions] = useState<Option[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [setAsPrimary, setSetAsPrimary] = useState(false);

  // Modals state
  const [newFolderOpened, { open: openNewFolder, close: closeNewFolder }] =
    useDisclosure(false);
  const [renameOpened, { open: openRename, close: closeRename }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [viewImageOpened, { open: openViewImage, close: closeViewImage }] =
    useDisclosure(false);
  const [assignCatOpened, { open: openAssignCat, close: closeAssignCat }] =
    useDisclosure(false);
  const [
    editMetadataOpened,
    { open: openEditMetadata, close: closeEditMetadata },
  ] = useDisclosure(false);

  // Form state
  const [newFolderName, setNewFolderName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const resetRef = useRef<() => void>(null);

  // Initialize and fetch gallery items
  useEffect(() => {
    fetchGalleryItems();
  }, [currentPath, currentPage, sortBy]);

  // Update breadcrumbs when path changes
  useEffect(() => {
    const pathParts = currentPath ? currentPath.split("/") : [];
    setBreadcrumbs(["Domů", ...pathParts]);
    setCurrentPage(1); // Reset to first page when changing directories
  }, [currentPath]);

  // Filter and sort items based on search term and sort option
  const filterAndSortItems = () => {
    let filtered = [...items];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "date-asc":
        filtered.sort((a, b) => {
          if (!a.created_at) return 1;
          if (!b.created_at) return -1;
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
        break;
      case "date-desc":
        filtered.sort((a, b) => {
          if (!a.created_at) return 1;
          if (!b.created_at) return -1;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        break;
      case "size-asc":
        filtered.sort((a, b) => (a.size || 0) - (b.size || 0));
        break;
      case "size-desc":
        filtered.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
    }

    // Always ensure folders appear first
    filtered = [
      ...filtered.filter((item) => item.type === "folder"),
      ...filtered.filter((item) => item.type === "image"),
    ];

    setFilteredItems(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

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

          return {
            id: folder.id || folder.name,
            name: folder.name,
            type: isImage ? "image" : "folder",
            path: currentPath ? `${currentPath}/${folder.name}` : folder.name,
            size: folder.metadata?.size,
            created_at: folder.created_at,
            url: isImage
              ? `${
                  process.env.NEXT_PUBLIC_SUPABASE_URL
                }/storage/v1/object/public/gallery/${
                  currentPath ? `${currentPath}/` : ""
                }${folder.name}`
              : undefined,
          };
        });

      // Fetch related metadata for images from database
      const imageItems = folderItems.filter((item) => item.type === "image");
      if (imageItems.length > 0) {
        const imagePaths = imageItems.map((item) =>
          currentPath ? `${currentPath}/${item.name}` : item.name
        );

        const { data: imageData, error: imageError } = await supabase
          .from("images")
          .select("id, cat_id, url, title, description, is_primary, created_at")
          .in("url", imagePaths);

        if (!imageError && imageData) {
          // Merge database data with storage data
          folderItems.forEach((item) => {
            if (item.type === "image") {
              const imagePath = currentPath
                ? `${currentPath}/${item.name}`
                : item.name;
              const matchingImage = imageData.find(
                (img) => img.url === imagePath
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

      setItems(folderItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst položky z galerie",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cats for dropdown
  const fetchCats = async () => {
    try {
      const { data: cats, error } = await supabase
        .from("cats")
        .select("id, name")
        .order("name");

      if (error) throw error;

      if (cats) {
        setCatOptions(
          cats.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching cats:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se načíst kočky",
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

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      notifications.show({
        title: "Chyba",
        message: "Zadejte platný název složky",
        color: "red",
      });
      return;
    }

    setLoading(true);
    const folderPath = currentPath
      ? `${currentPath}/${newFolderName}/.emptyFolderPlaceholder`
      : `${newFolderName}/.emptyFolderPlaceholder`;

    try {
      // Create empty file in the folder to ensure folder creation
      const { error } = await supabase.storage
        .from("gallery")
        .upload(folderPath, new Blob([""]), {
          contentType: "text/plain",
        });

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: `Složka '${newFolderName}' byla vytvořena`,
        color: "green",
      });

      setNewFolderName("");
      closeNewFolder();
      fetchGalleryItems();
    } catch (error) {
      console.error("Error creating folder:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se vytvořit složku",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload files
  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let completedFiles = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        // Create file path
        const filePath = currentPath
          ? `${currentPath}/${file.name}`
          : file.name;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath);

        // Create database record
        const { error: dbError } = await supabase.from("images").insert({
          url: filePath,
          title: file.name,
          is_primary: false,
        });

        if (dbError) throw dbError;

        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errorCount++;
      }
    }

    setUploading(false);
    if (errorCount > 0) {
      notifications.show({
        title: "Varování",
        message: `Nahráno ${completedFiles} z ${totalFiles} souborů. ${errorCount} souborů se nepodařilo nahrát.`,
        color: "yellow",
      });
    } else {
      notifications.show({
        title: "Úspěch",
        message: `Úspěšně nahráno ${completedFiles} souborů`,
        color: "green",
      });
    }

    if (resetRef.current) {
      resetRef.current();
    }

    fetchGalleryItems();
  };

  // Delete item (folder or image)
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      if (selectedItem.type === "folder") {
        // For folders, we need to recursively delete all contents
        // This is a simplified approach - in production you might want a more robust solution
        const { data: folderContents, error: listError } =
          await supabase.storage.from("gallery").list(`${selectedItem.path}`, {
            limit: 100,
            offset: 0,
          });

        if (listError) throw listError;

        // Delete all items in folder
        for (const item of folderContents) {
          const itemPath = `${selectedItem.path}/${item.name}`;

          if (!item.id.includes(".")) {
            // This is a subfolder, recursively delete
            // Note: This is simplified and might not handle deeply nested folders
            const { data: subContents, error: subListError } =
              await supabase.storage.from("gallery").list(itemPath);

            if (!subListError && subContents) {
              for (const subItem of subContents) {
                await supabase.storage
                  .from("gallery")
                  .remove([`${itemPath}/${subItem.name}`]);
              }
            }
          }

          // Remove the item
          await supabase.storage.from("gallery").remove([itemPath]);
        }

        // Finally remove the folder itself (by removing the placeholder)
        await supabase.storage
          .from("gallery")
          .remove([`${selectedItem.path}/.emptyFolderPlaceholder`]);
      } else {
        // For images, delete from storage
        const { error: storageError } = await supabase.storage
          .from("gallery")
          .remove([selectedItem.path || ""]);

        if (storageError) throw storageError;

        // Delete from database if it has an ID
        if (selectedItem.id) {
          const { error: dbError } = await supabase
            .from("images")
            .delete()
            .eq("id", selectedItem.id);

          if (dbError) throw dbError;
        }
      }

      notifications.show({
        title: "Úspěch",
        message: `'${selectedItem.name}' byl(a) smazán(a)`,
        color: "green",
      });

      setSelectedItem(null);
      closeDelete();
      fetchGalleryItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se smazat položku",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rename item
  const handleRenameConfirm = async () => {
    if (!selectedItem || !newItemName.trim()) return;

    setLoading(true);
    try {
      // For rename, we need to copy and delete due to Supabase storage limitations
      const oldPath = selectedItem.path || "";
      const pathParts = oldPath.split("/");
      pathParts[pathParts.length - 1] = newItemName;
      const newPath = pathParts.join("/");

      if (selectedItem.type === "folder") {
        // For folders, create new folder and move contents
        // Create the new folder first
        await supabase.storage
          .from("gallery")
          .upload(`${newPath}/.emptyFolderPlaceholder`, new Blob([""]), {
            contentType: "text/plain",
          });

        // List the contents of the old folder
        const { data: contents, error: listError } = await supabase.storage
          .from("gallery")
          .list(oldPath);

        if (listError) throw listError;

        // Move each item to the new folder
        for (const item of contents) {
          if (item.name === ".emptyFolderPlaceholder") continue;

          // Download the file
          const { data: fileData, error: downloadError } =
            await supabase.storage
              .from("gallery")
              .download(`${oldPath}/${item.name}`);

          if (downloadError) throw downloadError;

          // Upload to new location
          await supabase.storage
            .from("gallery")
            .upload(`${newPath}/${item.name}`, fileData);

          // Delete from old location
          await supabase.storage
            .from("gallery")
            .remove([`${oldPath}/${item.name}`]);
        }

        // Delete the old folder
        await supabase.storage
          .from("gallery")
          .remove([`${oldPath}/.emptyFolderPlaceholder`]);
      } else {
        // For images, download and reupload with new name
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("gallery")
          .download(oldPath);

        if (downloadError) throw downloadError;

        // Upload to new location
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(newPath, fileData);

        if (uploadError) throw uploadError;

        // Delete from old location
        await supabase.storage.from("gallery").remove([oldPath]);

        // Update database record if it exists
        if (selectedItem.id) {
          const { error: dbError } = await supabase
            .from("images")
            .update({ url: newPath, title: newItemName })
            .eq("id", selectedItem.id);

          if (dbError) throw dbError;
        }
      }

      notifications.show({
        title: "Úspěch",
        message: `'${selectedItem.name}' byl(a) přejmenován(a) na '${newItemName}'`,
        color: "green",
      });

      setSelectedItem(null);
      setNewItemName("");
      closeRename();
      fetchGalleryItems();
    } catch (error) {
      console.error("Error renaming item:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přejmenovat položku",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
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
        title: "Chyba",
        message: "Nepodařilo se stáhnout obrázek",
        color: "red",
      });
    }
  };

  // Assign image to a cat and optionally set as primary
  const handleAssignAndSetPrimary = async (
    item: GalleryItem,
    catId: string,
    makePrimary: boolean
  ) => {
    if (!item.id) {
      notifications.show({
        title: "Chyba",
        message: "Tento obrázek nemá ID v databázi",
        color: "red",
      });
      return;
    }

    try {
      // If setting as primary, first clear any existing primary images
      if (makePrimary) {
        await supabase
          .from("images")
          .update({ is_primary: false })
          .eq("cat_id", catId)
          .eq("is_primary", true);
      }

      // Update the image with cat_id and primary status
      const { error } = await supabase
        .from("images")
        .update({
          cat_id: catId,
          is_primary: makePrimary,
        })
        .eq("id", item.id);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: `Obrázek byl přiřazen ke kočce${
          makePrimary ? " a nastaven jako primární" : ""
        }`,
        color: "green",
      });

      // Reset state
      setSelectedCatId(null);
      setSetAsPrimary(false);
      fetchGalleryItems();
    } catch (error) {
      console.error("Error assigning image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se přiřadit obrázek",
        color: "red",
      });
    }
  };

  // Set image as primary for a cat
  const handleSetPrimary = async (item: GalleryItem) => {
    if (!item.id || !item.cat_id) {
      notifications.show({
        title: "Chyba",
        message: "Tento obrázek nemá ID nebo není přiřazen ke kočce",
        color: "red",
      });
      return;
    }

    try {
      // First reset any existing primary images for this cat
      await supabase
        .from("images")
        .update({ is_primary: false })
        .eq("cat_id", item.cat_id)
        .eq("is_primary", true);

      // Then set this image as primary
      const { error } = await supabase
        .from("images")
        .update({ is_primary: true })
        .eq("id", item.id);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: `Obrázek byl nastaven jako primární`,
        color: "green",
      });

      fetchGalleryItems();
    } catch (error) {
      console.error("Error setting primary image:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se nastavit obrázek jako primární",
        color: "red",
      });
    }
  };

  // Update image metadata
  const handleUpdateMetadata = async () => {
    if (!selectedItem || !selectedItem.id) return;

    try {
      const { error } = await supabase
        .from("images")
        .update({
          title: imageTitle,
          description: imageDescription,
        })
        .eq("id", selectedItem.id);

      if (error) throw error;

      notifications.show({
        title: "Úspěch",
        message: "Metadata obrázku byla aktualizována",
        color: "green",
      });

      closeEditMetadata();
      fetchGalleryItems();
    } catch (error) {
      console.error("Error updating image metadata:", error);
      notifications.show({
        title: "Chyba",
        message: "Nepodařilo se aktualizovat metadata obrázku",
        color: "red",
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
    fetchGalleryItems(); // Add this line to trigger reload with search
  };

  // Render gallery items (folders and images)
  const renderGalleryItems = () => {
    // Remove filteredItems and use items directly
    if (items.length === 0) {
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
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
        {items.map((item) => (
          <Card key={item.id || item.name} padding="xs" radius="md" withBorder>
            <Card.Section pos="relative">
              {item.type === "folder" ? (
                <Box
                  onClick={() => navigateToFolder(item.path || "")}
                  py="xl"
                  sx={{
                    backgroundColor: "#f0f0f0",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 150,
                  }}
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
                    onClick={() => {
                      setSelectedItem(item);
                      openViewImage();
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {item.is_primary && (
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
                </>
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
                  {item.type === "image" && (
                    <>
                      <Menu.Item
                        leftSection={<IconDownload size={14} />}
                        onClick={() => handleDownload(item)}
                      >
                        Stáhnout
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconLink size={14} />}
                        onClick={() => {
                          setSelectedItem(item);
                          setSelectedCatId(item.cat_id || null);
                          setSetAsPrimary(false);
                          fetchCats();
                          openAssignCat();
                        }}
                      >
                        Přiřadit ke kočce
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => {
                          setSelectedItem(item);
                          setImageTitle(item.title || "");
                          setImageDescription(item.description || "");
                          openEditMetadata();
                        }}
                      >
                        Upravit metadata
                      </Menu.Item>
                      {item.cat_id ? (
                        <Menu.Item
                          leftSection={<IconCheck size={14} />}
                          onClick={() => handleSetPrimary(item)}
                          disabled={item.is_primary}
                        >
                          Nastavit jako primární
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          leftSection={<IconPhoto size={14} />}
                          disabled
                        >
                          Nepřiřazeno ke kočce
                        </Menu.Item>
                      )}
                    </>
                  )}
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => {
                      setSelectedItem(item);
                      setNewItemName(item.name);
                      openRename();
                    }}
                  >
                    Přejmenovat
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => {
                      setSelectedItem(item);
                      openDelete();
                    }}
                  >
                    Smazat
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Card.Section>
            <Text size="sm" weight={500} lineClamp={1} title={item.name} mt={5}>
              {item.name}
            </Text>
            {item.type === "image" && (
              <Text size="xs" c="dimmed">
                {item.size && item.size > 1024 * 1024
                  ? `${(item.size / (1024 * 1024)).toFixed(1)} MB`
                  : item.size
                  ? `${(item.size / 1024).toFixed(0)} KB`
                  : ""}
              </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Stack gap="lg" p={16} maw={1280} mx="auto">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Group align="apart">
        <Title order={2}>Správa galerie</Title>
        <Group>
          <Button
            leftSection={<IconFolderPlus size={16} />}
            variant="outline"
            onClick={openNewFolder}
          >
            Nová složka
          </Button>
          <FileButton
            onChange={handleUpload}
            accept="image/*"
            multiple
            resetRef={resetRef}
          >
            {(props) => (
              <Button leftSection={<IconUpload size={16} />} {...props}>
                Nahrát obrázky
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>

      {/* Navigation breadcrumbs */}
      <Breadcrumbs>
        {breadcrumbs.map((crumb, index) => (
          <Anchor
            key={index}
            onClick={() => handleBreadcrumbClick(index)}
            sx={{ cursor: "pointer" }}
          >
            {crumb}
          </Anchor>
        ))}
      </Breadcrumbs>

      {/* Search, sort, and filter controls */}
      <Flex gap="md" align="center" wrap="wrap">
        <Input
          placeholder="Hledat..."
          icon={<IconSearch size={16} />}
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
            { label: "Datum ↑", value: "date-asc" },
            { label: "Datum ↓", value: "date-desc" },
            { label: "Velikost ↑", value: "size-asc" },
            { label: "Velikost ↓", value: "size-desc" },
          ]}
        />
      </Flex>

      {/* Upload progress indicator */}
      {uploading && (
        <Paper withBorder p="xs">
          <Stack gap="xs">
            <Group position="apart">
              <Text size="sm">Nahrávání...</Text>
              <ActionIcon size="sm" onClick={() => setUploading(false)}>
                <IconX size={14} />
              </ActionIcon>
            </Group>
            <Progress value={uploadProgress} />
          </Stack>
        </Paper>
      )}

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

      {/* New Folder Modal */}
      <Modal
        opened={newFolderOpened}
        onClose={closeNewFolder}
        title="Vytvořit novou složku"
        centered
      >
        <Stack>
          <TextInput
            label="Název složky"
            placeholder="Zadejte název nové složky"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.currentTarget.value)}
            required
          />
          <Group position="right">
            <Button variant="outline" onClick={closeNewFolder}>
              Zrušit
            </Button>
            <Button onClick={handleCreateFolder}>Vytvořit</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Rename Modal */}
      <Modal
        opened={renameOpened}
        onClose={closeRename}
        title={`Přejmenovat ${
          selectedItem?.type === "folder" ? "složku" : "obrázek"
        }`}
        centered
      >
        <Stack>
          <TextInput
            label="Nový název"
            placeholder={`Zadejte nový název pro ${selectedItem?.name || ""}`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.currentTarget.value)}
            required
          />
          <Group position="right">
            <Button variant="outline" onClick={closeRename}>
              Zrušit
            </Button>
            <Button onClick={handleRenameConfirm}>Přejmenovat</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Potvrzení smazání"
        centered
      >
        <Stack>
          <Text>
            Opravdu chcete smazat{" "}
            {selectedItem?.type === "folder" ? "složku" : "obrázek"} &quot;
            {selectedItem?.name}&quot;?
            {selectedItem?.type === "folder" &&
              " Všechny soubory ve složce budou také smazány."}
          </Text>
          <Group position="right">
            <Button variant="outline" onClick={closeDelete}>
              Zrušit
            </Button>
            <Button color="red" onClick={handleDeleteConfirm}>
              Smazat
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Assign to Cat Modal */}
      <Modal
        opened={assignCatOpened}
        onClose={closeAssignCat}
        title="Přiřadit obrázek ke kočce"
        centered
      >
        <Stack>
          <Select
            label="Vyberte kočku"
            placeholder="Vyberte kočku ze seznamu"
            data={catOptions}
            value={selectedCatId}
            onChange={setSelectedCatId}
            searchable
            clearable
            required
          />
          <Switch
            label="Nastavit jako primární obrázek"
            checked={setAsPrimary}
            onChange={(e) => setSetAsPrimary(e.currentTarget.checked)}
          />
          <Group position="right">
            <Button variant="outline" onClick={closeAssignCat}>
              Zrušit
            </Button>
            <Button
              onClick={() => {
                if (selectedItem && selectedCatId) {
                  handleAssignAndSetPrimary(
                    selectedItem,
                    selectedCatId,
                    setAsPrimary
                  );
                  closeAssignCat();
                }
              }}
              disabled={!selectedCatId}
            >
              Přiřadit
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Metadata Modal */}
      <Modal
        opened={editMetadataOpened}
        onClose={closeEditMetadata}
        title="Upravit metadata obrázku"
        centered
      >
        <Stack>
          <TextInput
            label="Název"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.currentTarget.value)}
          />
          <Textarea
            label="Popis"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.currentTarget.value)}
            minRows={3}
          />
          <Group position="right">
            <Button variant="outline" onClick={closeEditMetadata}>
              Zrušit
            </Button>
            <Button onClick={handleUpdateMetadata}>Uložit</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Image Modal */}
      <Modal
        opened={viewImageOpened}
        onClose={closeViewImage}
        title={selectedItem?.title || selectedItem?.name || "Náhled obrázku"}
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
            <Group>
              {selectedItem.cat_id && (
                <Text size="sm">
                  <strong>Přiřazeno ke kočce</strong>
                  {selectedItem.is_primary && " (primární)"}
                </Text>
              )}
              <Text size="sm">
                <strong>Velikost:</strong>{" "}
                {selectedItem.size && selectedItem.size > 1024 * 1024
                  ? `${(selectedItem.size / (1024 * 1024)).toFixed(1)} MB`
                  : selectedItem.size
                  ? `${(selectedItem.size / 1024).toFixed(0)} KB`
                  : "Neznámá"}
              </Text>
            </Group>
            <Group position="right">
              <Button
                leftSection={<IconDownload size={16} />}
                variant="outline"
                onClick={() => handleDownload(selectedItem)}
              >
                Stáhnout
              </Button>
              {!selectedItem.cat_id && (
                <Button
                  leftSection={<IconLink size={14} />}
                  variant="outline"
                  onClick={() => {
                    closeViewImage();
                    fetchCats();
                    openAssignCat();
                  }}
                >
                  Přiřadit ke kočce
                </Button>
              )}
              <Button onClick={closeViewImage}>Zavřít</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default GalleryManagementPage;
