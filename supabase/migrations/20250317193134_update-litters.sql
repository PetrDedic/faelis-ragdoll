-- Add status field to litters table
ALTER TABLE litters 
ADD COLUMN status TEXT CHECK (status IN ('planned', 'current', 'past')) NOT NULL DEFAULT 'past';

-- Add expected_date field to litters table for upcoming litters
ALTER TABLE litters
ADD COLUMN expected_date DATE;

-- Add an index for better query performance
CREATE INDEX idx_litters_status ON litters(status);

-- Comment explaining the usage of status and expected_date
COMMENT ON COLUMN litters.status IS 'Indicates if the litter is planned (upcoming), current, or past';
COMMENT ON COLUMN litters.expected_date IS 'Expected birth date for planned litters';