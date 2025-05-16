-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_types table
CREATE TABLE IF NOT EXISTS product_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some default categories
INSERT INTO product_categories (name, description)
VALUES 
  ('Meters', 'All types of utility meters'),
  ('Accessories', 'Meter accessories and components'),
  ('Tools', 'Installation and maintenance tools'),
  ('Spare Parts', 'Replacement parts for meters')
ON CONFLICT (name) DO NOTHING;

-- Add some default types
INSERT INTO product_types (name, description)
VALUES 
  ('Electricity Meter', 'Meters for measuring electricity consumption'),
  ('Water Meter', 'Meters for measuring water consumption'),
  ('Gas Meter', 'Meters for measuring gas consumption'),
  ('Smart Meter', 'Advanced meters with digital capabilities'),
  ('Prepaid Meter', 'Pay-as-you-go utility meters')
ON CONFLICT (name) DO NOTHING;
