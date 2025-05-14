import { createClientComponentClient } from "@/lib/supabase"
import type { SalesTransaction } from "@/types/inventory"

// Function to fetch all sales
export async function fetchSales(): Promise<SalesTransaction[]> {
  try {
    console.log("Fetching sales from database...")
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from("sales_transactions")
      .select(`
        *,
        customers:customer_id (name, phone)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching sales:", error)
      // Return empty array instead of dummy data
      return []
    }

    console.log(`Successfully fetched ${data.length} sales`)

    // For each sale, fetch the associated meter IDs
    const salesWithMeters = await Promise.all(
      data.map(async (sale) => {
        const { data: saleItems, error: itemsError } = await supabase
          .from("sales_items")
          .select("meter_id")
          .eq("sale_id", sale.id)

        if (itemsError) {
          console.error(`Error fetching sale items for sale ${sale.id}:`, itemsError)
          return {
            id: sale.id,
            date: sale.date,
            customerId: sale.customer_id,
            customerName: sale.customers?.name || "Unknown Customer",
            totalAmount: sale.total_amount,
            paymentMethod: sale.payment_method || "Cash",
            paymentStatus: sale.payment_status,
            notes: sale.notes || "",
            createdBy: sale.created_by || "System",
            meterIds: [],
          }
        }

        return {
          id: sale.id,
          date: sale.date,
          customerId: sale.customer_id,
          customerName: sale.customers?.name || "Unknown Customer",
          totalAmount: sale.total_amount,
          paymentMethod: sale.payment_method || "Cash",
          paymentStatus: sale.payment_status,
          notes: sale.notes || "",
          createdBy: sale.created_by || "System",
          meterIds: saleItems.map((item) => item.meter_id),
        }
      }),
    )

    return salesWithMeters
  } catch (error) {
    console.error("Error in fetchSales:", error)
    // Return empty array instead of dummy data
    return []
  }
}

// Function to record a new sale
export async function recordSale(sale: Omit<SalesTransaction, "id">): Promise<SalesTransaction> {
  try {
    console.log("Recording new sale in database for customer:", sale.customerId)
    const supabase = createClientComponentClient()

    // First, create the sale record
    const { data: saleData, error: saleError } = await supabase
      .from("sales_transactions")
      .insert({
        date: sale.date,
        customer_id: sale.customerId,
        total_amount: sale.totalAmount,
        payment_method: sale.paymentMethod,
        payment_status: sale.paymentStatus,
        notes: sale.notes,
        created_by: sale.createdBy,
      })
      .select()

    if (saleError) {
      console.error("Error recording sale:", saleError)
      throw saleError
    }

    const saleId = saleData[0].id
    console.log("Sale recorded successfully:", saleId)

    // Then, create sale items for each meter
    const salesItems = sale.meterIds.map((meterId) => ({
      sale_id: saleId,
      meter_id: meterId,
      price: sale.totalAmount / sale.meterIds.length, // Simple price distribution
    }))

    const { error: itemsError } = await supabase.from("sales_items").insert(salesItems)

    if (itemsError) {
      console.error("Error recording sale items:", itemsError)
      throw itemsError
    }

    console.log(`Recorded ${salesItems.length} sale items`)

    // Update each meter's status to 'sold'
    for (const meterId of sale.meterIds) {
      const { error: meterError } = await supabase
        .from("meters")
        .update({
          status: "sold",
          sold_to: sale.customerId,
          sold_date: sale.date,
          sold_by: sale.createdBy,
          price: sale.totalAmount / sale.meterIds.length,
        })
        .eq("id", meterId)

      if (meterError) {
        console.error(`Error updating meter ${meterId} status:`, meterError)
        // Continue with other meters even if one fails
      }
    }

    // Fetch customer name for the response
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("name")
      .eq("id", sale.customerId)
      .single()

    if (customerError) {
      console.error("Error fetching customer name:", customerError)
    }

    // Return the complete sale object
    return {
      id: saleId,
      date: sale.date,
      customerId: sale.customerId,
      customerName: customerData?.name || "Unknown Customer",
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      notes: sale.notes,
      createdBy: sale.createdBy,
      meterIds: sale.meterIds,
    }
  } catch (error) {
    console.error("Error in recordSale:", error)
    throw error
  }
}

// Function to get sales by customer ID
export async function getSalesByCustomer(customerId: string): Promise<SalesTransaction[]> {
  try {
    console.log(`Fetching sales for customer: ${customerId}`)
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from("sales_transactions")
      .select(`
        *,
        customers:customer_id (name, phone)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customer sales:", error)
      return []
    }

    console.log(`Successfully fetched ${data.length} sales for customer`)

    // For each sale, fetch the associated meter IDs
    const salesWithMeters = await Promise.all(
      data.map(async (sale) => {
        const { data: saleItems, error: itemsError } = await supabase
          .from("sales_items")
          .select("meter_id")
          .eq("sale_id", sale.id)

        if (itemsError) {
          console.error(`Error fetching sale items for sale ${sale.id}:`, itemsError)
          return {
            id: sale.id,
            date: sale.date,
            customerId: sale.customer_id,
            customerName: sale.customers?.name || "Unknown Customer",
            totalAmount: sale.total_amount,
            paymentMethod: sale.payment_method || "Cash",
            paymentStatus: sale.payment_status,
            notes: sale.notes || "",
            createdBy: sale.created_by || "System",
            meterIds: [],
          }
        }

        return {
          id: sale.id,
          date: sale.date,
          customerId: sale.customer_id,
          customerName: sale.customers?.name || "Unknown Customer",
          totalAmount: sale.total_amount,
          paymentMethod: sale.payment_method || "Cash",
          paymentStatus: sale.payment_status,
          notes: sale.notes || "",
          createdBy: sale.created_by || "System",
          meterIds: saleItems.map((item) => item.meter_id),
        }
      }),
    )

    return salesWithMeters
  } catch (error) {
    console.error("Error in getSalesByCustomer:", error)
    return []
  }
}
