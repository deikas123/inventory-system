-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Kenya',
  contact_person VARCHAR(100),
  contact_phone VARCHAR(50),
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for locations table
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default locations if they don't exist
INSERT INTO locations (name, type, address, city, status)
VALUES 
  ('Main Warehouse', 'warehouse', 'Industrial Area, Nairobi', 'Nairobi', 'active'),
  ('Nakuru Branch', 'branch', 'Kenyatta Avenue, Nakuru', 'Nakuru', 'active'),
  ('Mombasa Branch', 'branch', 'Moi Avenue, Mombasa', 'Mombasa', 'active')
ON CONFLICT (id) DO NOTHING;

Let me implement these features properly:

## 1. First, let's create the database tables for locations:
