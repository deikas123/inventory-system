import { createClientComponentClient } from "./supabase"
import * as LocalStorage from "./local-storage"
import type { PendingOperation } from "./local-storage"
import * as ConflictResolution from "./conflict-resolution"
import type { Conflict, ResolutionStrategy } from "./conflict-resolution"

// Sync status type
export type SyncStatus = "idle" | "syncing" | "success" | "error" | "conflict"

// Sync result type
export type SyncResult = {
  status: SyncStatus
  processed: number
  failed: number
  conflicts: number
  errors: string[]
}

// Process a single pending operation with conflict detection
async function processPendingOperation(
  operation: PendingOperation,
): Promise<{ success: boolean; conflict?: Conflict }> {
  const supabase = createClientComponentClient()

  try {
    switch (operation.entity) {
      case "product":
        if (operation.type === "add") {
          const { error } = await supabase.from("products").insert(operation.data)
          if (error) throw error
        } else if (operation.type === "update") {
          // Check for conflicts first
          const { data: serverData, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            // PGRST116 is the error code for "no rows returned"
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with update
          const { error } = await supabase.from("products").update(operation.data).eq("id", operation.data.id)
          if (error) throw error
        } else if (operation.type === "delete") {
          // Check if the product still exists
          const { data: serverData, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with delete
          const { error } = await supabase.from("products").delete().eq("id", operation.data.id)
          if (error) throw error
        }
        break

      case "meter":
        if (operation.type === "add") {
          const { error } = await supabase.from("meters").insert(operation.data)
          if (error) throw error
        } else if (operation.type === "update") {
          // Check for conflicts first
          const { data: serverData, error: fetchError } = await supabase
            .from("meters")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with update
          const { error } = await supabase.from("meters").update(operation.data).eq("id", operation.data.id)
          if (error) throw error
        } else if (operation.type === "delete") {
          // Check if the meter still exists
          const { data: serverData, error: fetchError } = await supabase
            .from("meters")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with delete
          const { error } = await supabase.from("meters").delete().eq("id", operation.data.id)
          if (error) throw error
        }
        break

      case "customer":
        if (operation.type === "add") {
          const { error } = await supabase.from("customers").insert(operation.data)
          if (error) throw error
        } else if (operation.type === "update") {
          // Check for conflicts first
          const { data: serverData, error: fetchError } = await supabase
            .from("customers")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with update
          const { error } = await supabase.from("customers").update(operation.data).eq("id", operation.data.id)
          if (error) throw error
        } else if (operation.type === "delete") {
          // Check if the customer still exists
          const { data: serverData, error: fetchError } = await supabase
            .from("customers")
            .select("*")
            .eq("id", operation.data.id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            throw fetchError
          }

          // Detect conflicts
          const conflict = ConflictResolution.detectConflict(operation, serverData)
          if (conflict) {
            return { success: false, conflict }
          }

          // No conflict, proceed with delete
          const { error } = await supabase.from("customers").delete().eq("id", operation.data.id)
          if (error) throw error
        }
        break

      case "sale":
        if (operation.type === "add") {
          // For sales, we need to handle both the sale and the sale items
          const { data: saleData, error: saleError } = await supabase
            .from("sales_transactions")
            .insert({
              date: operation.data.date,
              customer_id: operation.data.customerId,
              total_amount: operation.data.totalAmount,
              payment_method: operation.data.paymentMethod,
              payment_status: operation.data.paymentStatus,
              notes: operation.data.notes,
              created_by: operation.data.createdBy,
            })
            .select()

          if (saleError) throw saleError

          // Create sales items for each meter
          const saleId = saleData[0].id
          const salesItems = operation.data.meterIds.map((meterId: string) => ({
            sale_id: saleId,
            meter_id: meterId,
            price: operation.data.totalAmount / operation.data.meterIds.length, // Simple price distribution
          }))

          const { error: itemsError } = await supabase.from("sales_items").insert(salesItems)
          if (itemsError) throw itemsError

          // Update each meter's status to 'sold'
          for (const meterId of operation.data.meterIds) {
            // Check for conflicts first
            const { data: serverData, error: fetchError } = await supabase
              .from("meters")
              .select("*")
              .eq("id", meterId)
              .single()

            if (fetchError) {
              console.error(`Error fetching meter ${meterId}:`, fetchError)
              continue
            }

            // If the meter is already sold, this is a conflict
            if (serverData.status === "sold") {
              const conflict = ConflictResolution.addConflict({
                operationId: operation.id,
                entity: "meter",
                entityId: meterId,
                type: "data",
                clientData: { status: "sold", sold_to: operation.data.customerId },
                serverData: serverData,
              })

              return { success: false, conflict }
            }

            const { error: meterError } = await supabase
              .from("meters")
              .update({
                status: "sold",
                sold_to: operation.data.customerId,
                sold_date: operation.data.date,
                sold_by: operation.data.createdBy,
                price: operation.data.totalAmount / operation.data.meterIds.length,
              })
              .eq("id", meterId)

            if (meterError) {
              console.error(`Error updating meter ${meterId}:`, meterError)
            }
          }
        }
        break

      default:
        console.warn(`Unknown entity type: ${operation.entity}`)
        return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error(`Error processing operation ${operation.id}:`, error)
    return { success: false }
  }
}

// Sync all pending operations
export async function syncPendingOperations(): Promise<SyncResult> {
  const result: SyncResult = {
    status: "syncing",
    processed: 0,
    failed: 0,
    conflicts: 0,
    errors: [],
  }

  try {
    const pendingOperations = LocalStorage.getPendingOperations()

    if (pendingOperations.length === 0) {
      result.status = "success"
      return result
    }

    // Process operations in order (oldest first)
    const sortedOperations = [...pendingOperations].sort((a, b) => a.timestamp - b.timestamp)

    for (const operation of sortedOperations) {
      const { success, conflict } = await processPendingOperation(operation)

      if (success) {
        LocalStorage.removePendingOperation(operation.id)
        result.processed++
      } else if (conflict) {
        // We have a conflict
        result.conflicts++

        // Try to auto-resolve the conflict
        const strategy = ConflictResolution.autoResolveConflict(conflict)

        if (strategy !== "manual") {
          // Auto-resolve the conflict
          let resolvedData

          if (strategy === "merge") {
            resolvedData = ConflictResolution.mergeObjects(conflict.clientData, conflict.serverData)
          } else {
            resolvedData = strategy === "server" ? conflict.serverData : conflict.clientData
          }

          ConflictResolution.resolveConflict(conflict.id, strategy, resolvedData)

          // If auto-resolved, we can remove the operation
          LocalStorage.removePendingOperation(operation.id)
          result.processed++
        } else {
          // Manual resolution needed, keep the operation for now
          result.failed++
        }
      } else {
        result.failed++
        result.errors.push(`Failed to process operation: ${operation.entity} ${operation.type}`)
      }
    }

    // Update last sync timestamp
    LocalStorage.updateLastSync()

    // Set the appropriate status
    if (result.conflicts > 0) {
      result.status = "conflict"
    } else if (result.failed > 0) {
      result.status = "error"
    } else {
      result.status = "success"
    }

    return result
  } catch (error) {
    console.error("Error syncing pending operations:", error)
    result.status = "error"
    result.errors.push(`Sync error: ${error instanceof Error ? error.message : String(error)}`)
    return result
  }
}

// Fetch and store all data locally
export async function fetchAndStoreAllData(): Promise<boolean> {
  const supabase = createClientComponentClient()

  try {
    // Fetch products
    const { data: products, error: productsError } = await supabase.from("products").select("*")
    if (productsError) throw productsError
    LocalStorage.saveProducts(products)

    // Fetch meters
    const { data: meters, error: metersError } = await supabase.from("meters").select(`
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
      updated_at,
      products(name, cost)
    `)
    if (metersError) throw metersError
    LocalStorage.saveMeters(meters)

    // Fetch customers
    const { data: customers, error: customersError } = await supabase.from("customers").select("*")
    if (customersError) throw customersError
    LocalStorage.saveCustomers(customers)

    // Fetch sales transactions
    const { data: sales, error: salesError } = await supabase
      .from("sales_transactions")
      .select(`
        id,
        date,
        customer_id,
        total_amount,
        payment_method,
        payment_status,
        notes,
        created_by,
        created_at,
        updated_at,
        customers(name, phone, account_number)
      `)
      .order("created_at", { ascending: false })
    if (salesError) throw salesError

    // Also fetch the meter IDs for each sale
    const salesWithMeters = await Promise.all(
      sales.map(async (sale) => {
        const { data: saleItems, error: itemsError } = await supabase
          .from("sales_items")
          .select("meter_id")
          .eq("sale_id", sale.id)

        if (itemsError) {
          console.error("Error fetching sale items:", itemsError)
          return {
            ...sale,
            meterIds: [],
          }
        }

        return {
          ...sale,
          meterIds: saleItems.map((item) => item.meter_id),
        }
      }),
    )

    LocalStorage.saveSales(salesWithMeters)

    // Update last sync timestamp
    LocalStorage.updateLastSync()

    return true
  } catch (error) {
    console.error("Error fetching and storing data:", error)
    return false
  }
}

// Get the number of pending operations
export function getPendingOperationsCount(): number {
  return LocalStorage.getPendingOperations().length
}

// Get the last sync time
export function getLastSyncTime(): Date | null {
  const timestamp = LocalStorage.getLastSync()
  return timestamp ? new Date(timestamp) : null
}

// Get unresolved conflicts
export function getUnresolvedConflicts(): Conflict[] {
  return ConflictResolution.getUnresolvedConflicts()
}

// Resolve a conflict
export async function resolveConflict(
  conflictId: string,
  strategy: ResolutionStrategy,
  resolvedData?: any,
): Promise<boolean> {
  try {
    const resolvedConflict = ConflictResolution.resolveConflict(conflictId, strategy, resolvedData)

    if (!resolvedConflict) {
      return false
    }

    // If the conflict is resolved, we need to apply the resolution to the server
    const supabase = createClientComponentClient()

    switch (resolvedConflict.entity) {
      case "product":
        if (strategy === "server") {
          // Server data wins, nothing to do
          return true
        } else {
          // Client data or merged data wins
          const data = strategy === "client" ? resolvedConflict.clientData : resolvedData
          const { error } = await supabase.from("products").update(data).eq("id", resolvedConflict.entityId)
          if (error) throw error
        }
        break

      case "meter":
        if (strategy === "server") {
          // Server data wins, nothing to do
          return true
        } else {
          // Client data or merged data wins
          const data = strategy === "client" ? resolvedConflict.clientData : resolvedData
          const { error } = await supabase.from("meters").update(data).eq("id", resolvedConflict.entityId)
          if (error) throw error
        }
        break

      case "customer":
        if (strategy === "server") {
          // Server data wins, nothing to do
          return true
        } else {
          // Client data or merged data wins
          const data = strategy === "client" ? resolvedConflict.clientData : resolvedData
          const { error } = await supabase.from("customers").update(data).eq("id", resolvedConflict.entityId)
          if (error) throw error
        }
        break

      default:
        console.warn(`Unknown entity type: ${resolvedConflict.entity}`)
        return false
    }

    return true
  } catch (error) {
    console.error("Error resolving conflict:", error)
    return false
  }
}
