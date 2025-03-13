"use client";

import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import CatImagesModal from "./AdminCatImagesModal";

interface CatImagesButtonProps {
  catId: string;
  catName: string;
}

const CatImagesButton: React.FC<CatImagesButtonProps> = ({
  catId,
  catName,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Tooltip label="Správa obrázků">
        <ActionIcon color="teal" onClick={open}>
          <IconPhoto size={16} />
        </ActionIcon>
      </Tooltip>

      <CatImagesModal
        catId={catId}
        catName={catName}
        isOpen={opened}
        onClose={close}
      />
    </>
  );
};

export default CatImagesButton;
