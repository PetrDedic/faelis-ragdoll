"use client";

import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import AchievementImagesModal from "./AdminAchievementImagesModal";

interface AchievementImagesButtonProps {
  achievementId: string;
  achievementTitle: string;
  catName: string;
}

const AchievementImagesButton: React.FC<AchievementImagesButtonProps> = ({
  achievementId,
  achievementTitle,
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

      <AchievementImagesModal
        achievementId={achievementId}
        achievementTitle={achievementTitle}
        catName={catName}
        isOpen={opened}
        onClose={close}
      />
    </>
  );
};

export default AchievementImagesButton;
