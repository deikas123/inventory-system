-- Add created_at and updated_at columns if they don't exist
ALTER TABLE meters 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add a unique constraint on meter_number if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'meters_meter_number_key'
    ) THEN
        ALTER TABLE meters ADD CONSTRAINT meters_meter_number_key UNIQUE (meter_number);
    END IF;
END$$;

-- Create an index on meter_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_meters_meter_number ON meters(meter_number);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_meters_updated_at ON meters;
CREATE TRIGGER update_meters_updated_at
BEFORE UPDATE ON meters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
