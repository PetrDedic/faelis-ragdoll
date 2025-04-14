-- Add pedigree_link field to cats table
ALTER TABLE cats
ADD COLUMN pedigree_link TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN cats.pedigree_link IS 'URL or reference to the cat''s pedigree documentation';
