import { createClientComponentClient } from "@/lib/supabase"
import type { MeterItem } from "@/types/inventory"
import type { MeterImportRow } from "@/lib/csv-parser"

export type BulkImportResult = {
  success: boolean
  totalProcessed: number
  successCount: number
  failedCount: number
  errors: Record<string, string>
  successfulMeters: MeterItem[]
}

export async function bulkImportMeters(meters: MeterImportRow[]): Promise<BulkImportResult> {
  const supabase = createClientComponentClient()
  const result: BulkImportResult = {
    success: true,
    totalProcessed: meters.length,
    successCount: 0,
    failedCount: 0,
    errors: {},
    successfulMeters: [],
  }

  // First, check for duplicate meter numbers within the import batch
  const meterNumbers = meters.map((m) => m.meterNumber)
  const duplicatesInBatch = meterNumbers.filter((num, index) => meterNumbers.indexOf(num) !== index)

  if (duplicatesInBatch.length > 0) {
    const uniqueDuplicates = [...new Set(duplicatesInBatch)]
    uniqueDuplicates.forEach((dup) => {
      result.errors[dup] = "Duplicate meter number within import batch"
    })
    result.success = false
    result.failedCount += uniqueDuplicates.length
  }

  // Check for existing meter numbers in the database
  const { data: existingMeters, error: fetchError } = await supabase
    .from("meters")
    .select("meter_number")
    .in("meter_number", meterNumbers)

  if (fetchError) {
    console.error("Error checking existing meters:", fetchError)
    return {
      ...result,
      success: false,
      failedCount: meters.length,
      errors: { general: "Database error: " + fetchError.message },
    }
  }

  const existingMeterNumbers = existingMeters?.map((m) => m.meter_number) || []

  // Filter out meters that already exist
  existingMeterNumbers.forEach((num) => {
    result.errors[num] = "Meter number already exists in the database"
    result.failedCount += 1
  })

  // Filter out meters with errors
  const validMeters = meters.filter(
    (meter) => !duplicatesInBatch.includes(meter.meterNumber) && !existingMeterNumbers.includes(meter.meterNumber),
  )

  // If we have valid meters, insert them
  if (validMeters.length > 0) {
    const metersToInsert = validMeters.map((meter) => ({
      product_id: meter.productId,
      meter_number: meter.meterNumber,
      status: "in-stock",
      location: meter.location || "Warehouse",
      notes: meter.notes || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { data: insertedMeters, error: insertError } = await supabase
      .from("meters")
      .insert(metersToInsert)
      .select(`
        *,
        products:product_id (name, cost)
      `)

    if (insertError) {
      console.error("Error inserting meters:", insertError)
      return {
        ...result,
        success: false,
        failedCount: meters.length,
        errors: { ...result.errors, general: "Database error: " + insertError.message },
      }
    }

    // Transform the inserted meters to the application format
    result.successfulMeters = insertedMeters.map((meter) => ({
      id: meter.id,
      productId: meter.product_id,
      productName: meter.products?.name || "Unknown Product",
      meterNumber: meter.meter_number,
      status: meter.status,
      location: meter.location || "",
      allocatedTo: meter.allocated_to || null,
      soldTo: meter.sold_to || null,
      soldDate: meter.sold_date || null,
      soldBy: meter.sold_by || null,
      price: meter.price || 0,
      notes: meter.notes || "",
      addedDate: meter.created_at,
      lastUpdated: meter.updated_at,
    }))

    result.successCount = result.successfulMeters.length
  }

  // Update the final counts
  result.failedCount = meters.length - result.successCount
  result.success = result.failedCount === 0

  return result
}

// Function to validate product IDs
export async function validateProductIds(productIds: string[]): Promise<string[]> {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("products").select("id").in("id", productIds)

  if (error) {
    console.error("Error validating product IDs:", error)
    return []
  }

  return data.map((p) => p.id)
}

// Function to get product options for the dropdown
export async function getProductOptions() {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("products").select("id, name").eq("status", "Active")

  if (error) {
    console.error("Error fetching product options:", error)
    return []
  }

  return data.map((product) => ({
    value: product.id,
    label: product.name,
  }))
}
