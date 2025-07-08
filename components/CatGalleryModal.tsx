import { AspectRatio, Modal, Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import classes from "./Carousel.module.css";
import Image from "next/image";

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
    <Modal opened={opened} onClose={onClose} size="xl" centered>
      <Stack gap={0} pb={16}>
        <Carousel
          classNames={classes}
          styles={{ indicator: { width: 24 } }}
          withIndicators={images.length > 1}
          withControls={images.length > 1}
          loop
          slideGap={0}
          slideSize="100%"
        >
          {images.map((image, index) => (
            <Carousel.Slide
              key={image.id}
              style={{
                position: "relative",
              }}
            >
              <AspectRatio
                ratio={16 / 9}
                style={{
                  position: "relative",
                  alignItems: "center",
                  aspectRatio: "16/9",
                }}
                mx="auto"
              >
                <Image
                  src={image.url}
                  alt={`Cat image ${index + 1}`}
                  style={{
                    objectFit: "contain",
                  }}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Stack>
    </Modal>
  );
}
