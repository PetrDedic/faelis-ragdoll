-- Add display_order column to images table for custom photo ordering
ALTER TABLE images ADD COLUMN display_order INTEGER;

-- Add index for better performance when ordering by display_order
CREATE INDEX idx_images_display_order ON images(display_order);

-- Add index for ordering by display_order within each cat's images
CREATE INDEX idx_images_cat_id_display_order ON images(cat_id, display_order);

-- Add comment to explain the column
COMMENT ON COLUMN images.display_order IS 'Custom display order for images. Lower numbers appear first. NULL values appear last.';
