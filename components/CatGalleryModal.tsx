import { Modal, Image, Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import classes from "./Carousel.module.css";

interface CatImage {
  id: string;
  url: string;
  is_primary: boolean;
}

interface CatGalleryModalProps {
  images: CatImage[];
  opened: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export function CatGalleryModal({
  images,
  opened,
  onClose,
}: CatGalleryModalProps) {
  if (images.length === 0) return null;

  return (
    <Modal opened={opened} onClose={onClose} size="100%" centered>
      <Stack gap={0} mah="80dvh" pb={16}>
        <Carousel
          classNames={classes}
          styles={{ indicator: { width: 24 } }}
          withIndicators
          withControls
          loop
          slideGap={0}
          slideSize="100%"
          mah="80dvh"
        >
          {images.map((image, index) => (
            <Carousel.Slide key={image.id}>
              <Image
                src={image.url}
                alt={`Cat image ${index + 1}`}
                fit="contain"
                width="100%"
                height="100%"
                mah="calc(80dvh - 32px)"
                radius="md"
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Stack>
    </Modal>
  );
}
