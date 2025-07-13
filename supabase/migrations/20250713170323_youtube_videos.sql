-- Add YouTube video link to cats table
ALTER TABLE cats
ADD COLUMN youtube_video_link TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN cats.youtube_video_link IS 'YouTube video URL for the cat (e.g., https://www.youtube.com/watch?v=VIDEO_ID)';

-- Add YouTube video link to litters table
ALTER TABLE litters
ADD COLUMN youtube_video_link TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN litters.youtube_video_link IS 'YouTube video URL for the litter (e.g., https://www.youtube.com/watch?v=VIDEO_ID)';

-- Create indexes for better query performance when filtering by YouTube links
CREATE INDEX idx_cats_youtube_video_link ON cats(youtube_video_link) WHERE youtube_video_link IS NOT NULL;
CREATE INDEX idx_litters_youtube_video_link ON litters(youtube_video_link) WHERE youtube_video_link IS NOT NULL;
