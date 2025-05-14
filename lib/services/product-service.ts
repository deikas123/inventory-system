import { createClientComponentClient } from "@/lib/supabase"
import type { Product } from "@/types/inventory"

// Function to fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log("Fetching products from database...")
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from("products").select("*")

    if (error) {
      console.error("Error fetching products:", error)
      throw error
    }

    console.log(`Successfully fetched ${data.length} products`)

    // Transform database format to application format
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      sku: item.sku || "",
      category: item.category || "",
      inStock: item.in_stock,
      allocated: item.allocated,
      minStock: item.min_stock,
      cost: item.cost,
      status: item.status,
      requiresSerialTracking: item.requires_serial_tracking,
    }))
  } catch (error) {
    console.error("Error in fetchProducts:", error)
    // Return empty array instead of dummy data
    return []
  }
}

// Function to add a new product
export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  try {
    console.log("Adding new product to database:", product.name)
    const supabase = createClientComponentClient()

    // Transform application format to database format
    const { data, error } = await supabase
      .from("products")
      .insert({
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
      })
      .select()

    if (error) {
      console.error("Error adding product:", error)
      throw error
    }

    console.log("Product added successfully:", data[0].id)

    // Transform database format back to application format
    return {
      id: data[0].id,
      name: data[0].name,
      type: data[0].type,
      sku: data[0].sku || "",
      category: data[0].category || "",
      inStock: data[0].in_stock,
      allocated: data[0].allocated,
      minStock: data[0].min_stock,
      cost: data[0].cost,
      status: data[0].status,
      requiresSerialTracking: data[0].requires_serial_tracking,
    }
  } catch (error) {
    console.error("Error in addProduct:", error)
    throw error
  }
}

// Function to update product stock
export async function updateProductStock(id: string, change: number): Promise<Product> {
  try {
    console.log(`Updating product stock for ${id} by ${change}`)
    const supabase = createClientComponentClient()

    // First, get the current product
    const { data: currentProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching product for stock update:", fetchError)
      throw fetchError
    }

    // Calculate new stock
    const newStock = currentProduct.in_stock + change
    const status = newStock < currentProduct.min_stock ? "Low Stock" : "Active"

    // Update the product
    const { data, error } = await supabase
      .from("products")
      .update({
        in_stock: newStock,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating product stock:", error)
      throw error
    }

    console.log(`Product stock updated successfully. New stock: ${newStock}`)

    // Transform database format back to application format
    return {
      id: data[0].id,
      name: data[0].name,
      type: data[0].type,
      sku: data[0].sku || "",
      category: data[0].category || "",
      inStock: data[0].in_stock,
      allocated: data[0].allocated,
      minStock: data[0].min_stock,
      cost: data[0].cost,
      status: data[0].status,
      requiresSerialTracking: data[0].requires_serial_tracking,
    }
  } catch (error) {
    console.error("Error in updateProductStock:", error)
    throw error
  }
}
