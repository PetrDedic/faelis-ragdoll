-- Add name field to litters table
ALTER TABLE litters
ADD COLUMN name TEXT NOT NULL DEFAULT '';

-- Add comment explaining the field
COMMENT ON COLUMN litters.name IS 'Name or identifier for the litter';

-- Create an index for better query performance
CREATE INDEX idx_litters_name ON litters(name);
