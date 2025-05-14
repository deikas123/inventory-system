import { createClientComponentClient } from "@/lib/supabase"
import type { Customer } from "@/types/inventory"

// Function to fetch all customers
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    console.log("Fetching customers from database...")
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from("customers").select("*")

    if (error) {
      console.error("Error fetching customers:", error)
      throw error
    }

    console.log(`Successfully fetched ${data.length} customers`)

    // Transform database format to application format
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone || "",
      email: item.email || "",
      address: item.address || "",
      accountNumber: item.account_number || "",
      contactPerson: item.contact_person || "",
      type: item.customer_type || "Individual",
      status: item.status || "Active",
    }))
  } catch (error) {
    console.error("Error in fetchCustomers:", error)
    // Return empty array instead of dummy data
    return []
  }
}

// Function to add a new customer
export async function addCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
  try {
    console.log("Adding new customer to database:", customer.name)
    const supabase = createClientComponentClient()

    // Transform application format to database format
    const { data, error } = await supabase
      .from("customers")
      .insert({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        account_number: customer.accountNumber,
        contact_person: customer.contactPerson,
        customer_type: customer.type || "Individual",
        status: customer.status || "Active",
      })
      .select()

    if (error) {
      console.error("Error adding customer:", error)
      throw error
    }

    console.log("Customer added successfully:", data[0].id)

    // Transform database format back to application format
    return {
      id: data[0].id,
      name: data[0].name,
      phone: data[0].phone || "",
      email: data[0].email || "",
      address: data[0].address || "",
      accountNumber: data[0].account_number || "",
      contactPerson: data[0].contact_person || "",
      type: data[0].customer_type || "Individual",
      status: data[0].status || "Active",
    }
  } catch (error) {
    console.error("Error in addCustomer:", error)
    throw error
  }
}

// Function to get customer by ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    console.log(`Fetching customer with ID: ${id}`)
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching customer:", error)
      return null
    }

    // Transform database format to application format
    return {
      id: data.id,
      name: data.name,
      phone: data.phone || "",
      email: data.email || "",
      address: data.address || "",
      accountNumber: data.account_number || "",
      contactPerson: data.contact_person || "",
      type: data.customer_type || "Individual",
      status: data.status || "Active",
    }
  } catch (error) {
    console.error("Error in getCustomerById:", error)
    return null
  }
}
