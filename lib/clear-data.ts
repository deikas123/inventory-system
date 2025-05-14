import { createClientComponentClient } from "./supabase"
import * as LocalStorage from "./local-storage"

// Function to clear all local storage data
export async function clearAllLocalData(): Promise<void> {
  console.log("Clearing all local storage data...")
  LocalStorage.clearAllLocalData()
  console.log("Local storage data cleared successfully")
}

// Function to clear all database data
export async function clearAllDatabaseData(): Promise<void> {
  try {
    console.log("Clearing all database data...")
    const supabase = createClientComponentClient()

    // Clear sales_items table first (due to foreign key constraints)
    await supabase.from("sales_items").delete().neq("id", "none")
    console.log("Sales items data cleared")

    // Clear sales_transactions table
    await supabase.from("sales_transactions").delete().neq("id", "none")
    console.log("Sales transactions data cleared")

    // Clear meters table
    await supabase.from("meters").delete().neq("id", "none")
    console.log("Meters data cleared")

    // Clear products table
    await supabase.from("products").delete().neq("id", "none")
    console.log("Products data cleared")

    // Clear customers table
    await supabase.from("customers").delete().neq("id", "none")
    console.log("Customers data cleared")

    console.log("All database data cleared successfully")
  } catch (error) {
    console.error("Error clearing database data:", error)
    throw error
  }
}

// Function to clear all data (both local storage and database)
export async function clearAllData(): Promise<void> {
  try {
    await clearAllLocalData()
    await clearAllDatabaseData()
    console.log("All data cleared successfully")
  } catch (error) {
    console.error("Error clearing all data:", error)
    throw error
  }
}
