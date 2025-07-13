-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name VARCHAR(100) NOT NULL UNIQUE,
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default hero images for existing pages
INSERT INTO hero_images (page_name, background_image_url) VALUES
  ('home', 'https://tcdwmbbmqgeuzzubnjmg.supabase.co/storage/v1/object/public/gallery/Web%20obrazky/IMG_6363.jpg'),
  ('about', 'https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('cats', 'https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('litters', 'https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('contact', 'https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
  ('ragdoll', 'https://images.unsplash.com/photo-1620933288385-b2f6f1931d9e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
ON CONFLICT (page_name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_images_updated_at 
    BEFORE UPDATE ON hero_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
