import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { SupabaseClient } from "@supabase/supabase-js"

// Re-export the createClientComponentClient function
export { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Store a singleton instance of the client
let supabaseClient: SupabaseClient | null = null

// Create a Supabase client for use in components
export function getSupabaseClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClientComponentClient()
      console.log("Supabase client created successfully")
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      throw error
    }
  }
  return supabaseClient
}

// Function to test database connection with improved error handling
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log("Testing database connection...")

    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return false
    }

    // Create a new client instance for the test to avoid any cached issues
    const supabase = createClientComponentClient()

    // Set a timeout for the query
    const timeoutPromise = new Promise<{ error: Error }>((_, reject) => {
      setTimeout(() => {
        reject({ error: new Error("Database connection timeout") })
      }, 5000) // 5 second timeout
    })

    // Perform a simple query
    const queryPromise = supabase.from("products").select("id").limit(1)

    // Race the query against the timeout
    const result = await Promise.race([queryPromise, timeoutPromise])

    if ("error" in result && result.error) {
      console.error("Database connection test failed:", result.error)
      return false
    }

    console.log("Database connection test successful")
    return true
  } catch (error) {
    console.error("Database connection test error:", error)

    // Log more detailed information about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return false
  }
}

// Function to get a working Supabase client or null if connection fails
export async function getWorkingSupabaseClient(): Promise<SupabaseClient | null> {
  try {
    const supabase = createClientComponentClient()

    // Test if the client can connect
    const { error } = await supabase.from("products").select("id").limit(1)

    if (error) {
      console.error("Supabase client connection test failed:", error)
      return null
    }

    return supabase
  } catch (error) {
    console.error("Error getting working Supabase client:", error)
    return null
  }
}
