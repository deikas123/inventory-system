-- Create meter_types table
CREATE TABLE IF NOT EXISTS meter_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  phase VARCHAR(20) NOT NULL,
  connection_type VARCHAR(50) NOT NULL,
  max_current NUMERIC(10, 2),
  voltage VARCHAR(50),
  communication_type VARCHAR(50),
  features JSONB,
  image_url VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add meter_type_id column to meters table
ALTER TABLE meters ADD COLUMN IF NOT EXISTS meter_type_id UUID REFERENCES meter_types(id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for meter_types table
CREATE TRIGGER update_meter_types_updated_at
BEFORE UPDATE ON meter_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
