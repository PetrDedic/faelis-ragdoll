-- Create achievements table for storing cat show achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id UUID REFERENCES cats(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    show_name TEXT,
    date DATE,
    description TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create achievement_images table for storing multiple images per achievement
CREATE TABLE achievement_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add comments to explain the tables and fields
COMMENT ON TABLE achievements IS 'Table for storing cat show achievements and awards';
COMMENT ON COLUMN achievements.cat_id IS 'Reference to the cat that won the achievement';
COMMENT ON COLUMN achievements.title IS 'Title of the achievement (e.g., Champion, Grand Champion)';
COMMENT ON COLUMN achievements.show_name IS 'Name of the cat show where the achievement was won';
COMMENT ON COLUMN achievements.date IS 'Date when the achievement was won';
COMMENT ON COLUMN achievements.description IS 'Detailed description of the achievement';
COMMENT ON COLUMN achievements.category IS 'Category of the achievement (e.g., Adult Cats, Junior Cats)';

COMMENT ON TABLE achievement_images IS 'Table for storing multiple images per achievement';
COMMENT ON COLUMN achievement_images.achievement_id IS 'Reference to the achievement';
COMMENT ON COLUMN achievement_images.url IS 'URL of the image';
COMMENT ON COLUMN achievement_images.title IS 'Title of the image';
COMMENT ON COLUMN achievement_images.description IS 'Description of the image';
COMMENT ON COLUMN achievement_images.is_primary IS 'Whether this is the primary image for the achievement';
COMMENT ON COLUMN achievement_images.display_order IS 'Custom display order for images. Lower numbers appear first. NULL values appear last.';

-- Create indexes for better performance
CREATE INDEX idx_achievements_cat_id ON achievements(cat_id);
CREATE INDEX idx_achievements_date ON achievements(date);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievement_images_achievement_id ON achievement_images(achievement_id);
CREATE INDEX idx_achievement_images_display_order ON achievement_images(display_order);
CREATE INDEX idx_achievement_images_achievement_id_display_order ON achievement_images(achievement_id, display_order);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_achievements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_achievements_updated_at
    BEFORE UPDATE ON achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_achievements_updated_at();

-- Ensure only one primary image per achievement
CREATE UNIQUE INDEX idx_achievement_images_primary 
ON achievement_images(achievement_id) 
WHERE is_primary = true;
