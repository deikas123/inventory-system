import { createClientComponentClient } from "./supabase"

// Function to check if a table exists
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()

    // Query the information_schema to check if the table exists
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", tableName)
      .eq("table_schema", "public")
      .single()

    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error)
      return false
    }

    return !!data
  } catch (error) {
    console.error(`Error in tableExists for ${tableName}:`, error)
    return false
  }
}

// Function to create tables if they don't exist
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log("Initializing database...")
    const supabase = createClientComponentClient()

    // Check if products table exists
    const productsExists = await tableExists("products")
    if (!productsExists) {
      console.log("Creating products table...")
      const { error: productsError } = await supabase.rpc("create_products_table")
      if (productsError) {
        console.error("Error creating products table:", productsError)
        return false
      }
      console.log("Products table created successfully")
    } else {
      console.log("Products table already exists")
    }

    // Check if meters table exists
    const metersExists = await tableExists("meters")
    if (!metersExists) {
      console.log("Creating meters table...")
      const { error: metersError } = await supabase.rpc("create_meters_table")
      if (metersError) {
        console.error("Error creating meters table:", metersError)
        return false
      }
      console.log("Meters table created successfully")
    } else {
      console.log("Meters table already exists")
    }

    // Check if customers table exists
    const customersExists = await tableExists("customers")
    if (!customersExists) {
      console.log("Creating customers table...")
      const { error: customersError } = await supabase.rpc("create_customers_table")
      if (customersError) {
        console.error("Error creating customers table:", customersError)
        return false
      }
      console.log("Customers table created successfully")
    } else {
      console.log("Customers table already exists")
    }

    // Check if sales_transactions table exists
    const salesExists = await tableExists("sales_transactions")
    if (!salesExists) {
      console.log("Creating sales_transactions table...")
      const { error: salesError } = await supabase.rpc("create_sales_table")
      if (salesError) {
        console.error("Error creating sales_transactions table:", salesError)
        return false
      }
      console.log("Sales_transactions table created successfully")
    } else {
      console.log("Sales_transactions table already exists")
    }

    // Check if sales_items table exists
    const salesItemsExists = await tableExists("sales_items")
    if (!salesItemsExists) {
      console.log("Creating sales_items table...")
      const { error: salesItemsError } = await supabase.rpc("create_sales_items_table")
      if (salesItemsError) {
        console.error("Error creating sales_items table:", salesItemsError)
        return false
      }
      console.log("Sales_items table created successfully")
    } else {
      console.log("Sales_items table already exists")
    }

    console.log("Database initialization complete")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

// Function to seed initial data if tables are empty
export async function seedInitialData(): Promise<boolean> {
  try {
    console.log("Checking if seeding is needed...")
    const supabase = createClientComponentClient()

    // Check if products table is empty
    const { data: productsData, error: productsError } = await supabase.from("products").select("id").limit(1)

    if (productsError) {
      console.error("Error checking products table:", productsError)
      return false
    }

    if (productsData.length === 0) {
      console.log("Products table is empty, seeding initial data...")

      // Import initial data
      const { initialProducts, initialMeters, initialCustomers } = await import("./initial-data")

      // Insert products
      const { error: insertProductsError } = await supabase.from("products").insert(
        initialProducts.map((product) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          sku: product.sku,
          category: product.category,
          in_stock: product.inStock,
          allocated: product.allocated,
          min_stock: product.minStock,
          cost: product.cost,
          status: product.status,
          requires_serial_tracking: product.requiresSerialTracking,
        })),
      )

      if (insertProductsError) {
        console.error("Error seeding products:", insertProductsError)
        return false
      }

      console.log("Products seeded successfully")

      // Insert meters
      const { error: insertMetersError } = await supabase.from("meters").insert(
        initialMeters.map((meter) => ({
          id: meter.id,
          product_id: meter.productId,
          meter_number: meter.meterNumber,
          status: meter.status,
          location: meter.location,
        })),
      )

      if (insertMetersError) {
        console.error("Error seeding meters:", insertMetersError)
        return false
      }

      console.log("Meters seeded successfully")

      // Insert customers
      const { error: insertCustomersError } = await supabase.from("customers").insert(
        initialCustomers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          account_number: customer.accountNumber,
        })),
      )

      if (insertCustomersError) {
        console.error("Error seeding customers:", insertCustomersError)
        return false
      }

      console.log("Customers seeded successfully")

      console.log("Initial data seeding complete")
    } else {
      console.log("Tables already contain data, skipping seeding")
    }

    return true
  } catch (error) {
    console.error("Error seeding initial data:", error)
    return false
  }
}
