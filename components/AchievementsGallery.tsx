import { useState } from "react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Modal,
  Stack,
  Title,
  Container,
  SimpleGrid,
  AspectRatio,
  Button,
} from "@mantine/core";
import { IconTrophy, IconX } from "@tabler/icons-react";

export interface Achievement {
  id: string;
  imageUrl: string;
  catName: string;
  title: string;
  showName?: string;
  date?: string;
  description?: string;
  category?: string;
}

interface AchievementsGalleryProps {
  achievements: Achievement[];
  onImageClick?: (achievement: Achievement) => void;
}

export function AchievementsGallery({
  achievements,
  onImageClick,
}: AchievementsGalleryProps) {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const handleImageClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    if (onImageClick) {
      onImageClick(achievement);
    }
  };

  const closeModal = () => {
    setSelectedAchievement(null);
  };

  if (achievements.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="md">
          <IconTrophy size={64} color="gray" />
          <Text size="lg" c="dimmed" ta="center">
            Zatím nemáme žádné výstavní úspěchy k zobrazení.
          </Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="lg"
        verticalSpacing="lg"
      >
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(achievement)}
          >
            <Card.Section>
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={achievement.imageUrl}
                  alt={`${achievement.catName} - ${achievement.title}`}
                  fit="cover"
                />
              </AspectRatio>
            </Card.Section>

            <Stack mt="md" gap="xs">
              <Group justify="space-between">
                <Text fw={500} size="lg">
                  {achievement.catName}
                </Text>
                <Badge
                  color="yellow"
                  variant="filled"
                  leftSection={<IconTrophy size={12} />}
                >
                  {achievement.title}
                </Badge>
              </Group>

              {achievement.showName && (
                <Text size="sm" c="dimmed">
                  {achievement.showName}
                </Text>
              )}

              {achievement.date && (
                <Text size="xs" c="dimmed">
                  {achievement.date}
                </Text>
              )}

              {achievement.description && (
                <Text size="sm" lineClamp={2}>
                  {achievement.description}
                </Text>
              )}

              {achievement.category && (
                <Badge variant="outline" size="sm">
                  {achievement.category}
                </Badge>
              )}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={!!selectedAchievement}
        onClose={closeModal}
        size="lg"
        centered
        title={
          selectedAchievement && (
            <Group>
              <IconTrophy color="gold" />
              <Title order={3}>{selectedAchievement.catName}</Title>
            </Group>
          )
        }
      >
        {selectedAchievement && (
          <Stack gap="md">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={selectedAchievement.imageUrl}
                alt={`${selectedAchievement.catName} - ${selectedAchievement.title}`}
                fit="contain"
              />
            </AspectRatio>

            <Group justify="space-between">
              <Badge
                color="yellow"
                variant="filled"
                size="lg"
                leftSection={<IconTrophy size={16} />}
              >
                {selectedAchievement.title}
              </Badge>
              {selectedAchievement.category && (
                <Badge variant="outline" size="lg">
                  {selectedAchievement.category}
                </Badge>
              )}
            </Group>

            {selectedAchievement.showName && (
              <Text size="lg" fw={500}>
                {selectedAchievement.showName}
              </Text>
            )}

            {selectedAchievement.date && (
              <Text size="md" c="dimmed">
                {selectedAchievement.date}
              </Text>
            )}

            {selectedAchievement.description && (
              <Text size="md">{selectedAchievement.description}</Text>
            )}

            <Group justify="flex-end">
              <Button
                variant="outline"
                onClick={closeModal}
                leftSection={<IconX size={16} />}
              >
                Zavřít
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
