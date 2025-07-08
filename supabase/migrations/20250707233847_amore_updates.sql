-- Create medical_tests table for tracking various medical tests for cats
CREATE TABLE medical_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE NOT NULL,
    test_name TEXT NOT NULL,
    test_result TEXT,
    test_date DATE NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE,
    laboratory TEXT,
    certificate_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comments to explain the fields
COMMENT ON TABLE medical_tests IS 'Table for storing various medical test results for cats';
COMMENT ON COLUMN medical_tests.test_name IS 'Name of the medical test (e.g., FIV, FeLV, HCM, PKD, etc.)';
COMMENT ON COLUMN medical_tests.test_result IS 'Result of the medical test (e.g., Negative, Positive, Normal, etc.)';
COMMENT ON COLUMN medical_tests.test_date IS 'Date when the test was performed';
COMMENT ON COLUMN medical_tests.valid_from IS 'Date from which the test result is valid';
COMMENT ON COLUMN medical_tests.valid_until IS 'Date until which the test result is valid (NULL for permanent results)';
COMMENT ON COLUMN medical_tests.laboratory IS 'Name of the laboratory that performed the test';
COMMENT ON COLUMN medical_tests.certificate_number IS 'Certificate or reference number for the test';

-- Create indexes for better performance
CREATE INDEX idx_medical_tests_cat_id ON medical_tests(cat_id);
CREATE INDEX idx_medical_tests_test_date ON medical_tests(test_date);
CREATE INDEX idx_medical_tests_valid_until ON medical_tests(valid_until);
CREATE INDEX idx_medical_tests_test_name ON medical_tests(test_name);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_medical_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_medical_tests_updated_at
    BEFORE UPDATE ON medical_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_medical_tests_updated_at();

-- Add pedigree_link field to litters table
ALTER TABLE litters
ADD COLUMN pedigree_link TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN litters.pedigree_link IS 'URL or reference to the litter''s pedigree documentation';
