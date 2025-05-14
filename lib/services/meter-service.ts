import { createClientComponentClient } from "@/lib/supabase"
import type { MeterItem } from "@/types/inventory"

export async function getMetersByStatus(status: string) {
  try {
    console.log(`Fetching meters with status: ${status}`)
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("meters")
      .select(`
        id,
        meter_number,
        status,
        location,
        product_id,
        allocated_to,
        sold_to,
        sold_date,
        sold_by,
        price,
        notes,
        products(name, cost)
      `)
      .eq("status", status)

    if (error) {
      console.error("Error fetching meters:", error)
      // Return empty array instead of dummy data
      return []
    }

    console.log(`Successfully fetched ${data.length} meters with status: ${status}`)

    return data.map((meter) => ({
      id: meter.id,
      productId: meter.product_id,
      meterNumber: meter.meter_number,
      status: meter.status,
      location: meter.location,
      allocatedTo: meter.allocated_to,
      soldTo: meter.sold_to,
      soldDate: meter.sold_date,
      soldBy: meter.sold_by,
      price: meter.price,
      notes: meter.notes,
      productName: meter.products?.name,
      productCost: meter.products?.cost,
    }))
  } catch (error) {
    console.error("Error in getMetersByStatus:", error)
    // Return empty array instead of dummy data
    return []
  }
}

export async function getAllMeters() {
  try {
    console.log("Fetching all meters")
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("meters").select(`
      id,
      meter_number,
      status,
      location,
      product_id,
      allocated_to,
      sold_to,
      sold_date,
      sold_by,
      price,
      notes,
      products(name, cost)
    `)

    if (error) {
      console.error("Error fetching meters:", error)
      // Return empty array instead of dummy data
      return []
    }

    console.log(`Successfully fetched ${data.length} meters`)

    if (!data || data.length === 0) {
      // Return empty array instead of dummy data
      return []
    }

    return data.map((meter) => ({
      id: meter.id,
      productId: meter.product_id,
      meterNumber: meter.meter_number,
      status: meter.status,
      location: meter.location,
      allocatedTo: meter.allocated_to,
      soldTo: meter.sold_to,
      soldDate: meter.sold_date,
      soldBy: meter.sold_by,
      price: meter.price,
      notes: meter.notes,
      productName: meter.products?.name,
      productCost: meter.products?.cost,
    }))
  } catch (error) {
    console.error("Error in getAllMeters:", error)
    // Return empty array instead of dummy data
    return []
  }
}

export async function addMeter(meter: Omit<MeterItem, "id">): Promise<MeterItem> {
  try {
    console.log("Adding new meter to database:", meter.meterNumber)
    const supabase = createClientComponentClient()

    // Transform application format to database format
    const { data, error } = await supabase
      .from("meters")
      .insert({
        product_id: meter.productId,
        meter_number: meter.meterNumber,
        status: meter.status,
        location: meter.location,
        notes: meter.notes,
      })
      .select(`
        *,
        products:product_id (name, cost)
      `)

    if (error) {
      console.error("Error adding meter:", error)
      throw error
    }

    console.log("Meter added successfully:", data[0].id)

    // Transform database format back to application format
    return {
      id: data[0].id,
      productId: data[0].product_id,
      productName: data[0].products?.name || "Unknown Product",
      meterNumber: data[0].meter_number,
      status: data[0].status,
      location: data[0].location || "",
      allocatedTo: data[0].allocated_to || null,
      soldTo: data[0].sold_to || null,
      soldDate: data[0].sold_date || null,
      soldBy: data[0].sold_by || null,
      price: data[0].price || 0,
      notes: data[0].notes || "",
    }
  } catch (error) {
    console.error("Error in addMeter:", error)
    throw error
  }
}

export async function updateMeterStatus(
  id: string,
  status: MeterItem["status"],
  details?: Partial<MeterItem>,
): Promise<MeterItem> {
  try {
    console.log(`Updating meter status for ${id} to ${status}`)
    const supabase = createClientComponentClient()

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    // Add optional details if provided
    if (details) {
      if (details.location) updateData.location = details.location
      if (details.allocatedTo) updateData.allocated_to = details.allocatedTo
      if (details.soldTo) updateData.sold_to = details.soldTo
      if (details.soldDate) updateData.sold_date = details.soldDate
      if (details.soldBy) updateData.sold_by = details.soldBy
      if (details.price) updateData.price = details.price
      if (details.notes) updateData.notes = details.notes
    }

    // Update the meter
    const { data, error } = await supabase
      .from("meters")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        products:product_id (name, cost)
      `)

    if (error) {
      console.error("Error updating meter status:", error)
      throw error
    }

    console.log(`Meter status updated successfully to ${status}`)

    // Transform database format back to application format
    return {
      id: data[0].id,
      productId: data[0].product_id,
      productName: data[0].products?.name || "Unknown Product",
      meterNumber: data[0].meter_number,
      status: data[0].status,
      location: data[0].location || "",
      allocatedTo: data[0].allocated_to || null,
      soldTo: data[0].sold_to || null,
      soldDate: data[0].sold_date || null,
      soldBy: data[0].sold_by || null,
      price: data[0].price || 0,
      notes: data[0].notes || "",
    }
  } catch (error) {
    console.error("Error in updateMeterStatus:", error)
    throw error
  }
}

export async function fetchMeters(): Promise<MeterItem[]> {
  try {
    console.log("Fetching meters from database...")
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.from("meters").select(`
        *,
        products:product_id (name, cost)
      `)

    if (error) {
      console.error("Error fetching meters:", error)
      throw error
    }

    console.log(`Successfully fetched ${data.length} meters`)

    // Transform database format to application format
    return data.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.products?.name || "Unknown Product",
      meterNumber: item.meter_number,
      status: item.status,
      location: item.location || "",
      allocatedTo: item.allocated_to || null,
      soldTo: item.sold_to || null,
      soldDate: item.sold_date || null,
      soldBy: item.sold_by || null,
      price: item.price || 0,
      notes: item.notes || "",
    }))
  } catch (error) {
    console.error("Error in fetchMeters:", error)
    // Return empty array instead of dummy data
    return []
  }
}
