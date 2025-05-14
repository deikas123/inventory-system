import type { PendingOperation } from "./local-storage"

// Conflict types
export type ConflictType = "update" | "delete" | "version" | "data"

// Conflict resolution strategies
export type ResolutionStrategy = "server" | "client" | "merge" | "manual"

// Conflict object
export type Conflict = {
  id: string
  operationId: string
  entity: string
  entityId: string
  type: ConflictType
  clientData: any
  serverData: any
  resolved: boolean
  resolution?: ResolutionStrategy
  resolvedData?: any
  createdAt: Date
  resolvedAt?: Date
}

// Conflict history for tracking
export type ConflictHistory = {
  conflicts: Conflict[]
  lastChecked: Date | null
}

// Initialize conflict history
let conflictHistory: ConflictHistory = {
  conflicts: [],
  lastChecked: null,
}

// Load conflict history from local storage
export function loadConflictHistory(): ConflictHistory {
  try {
    const storedHistory = localStorage.getItem("ums_conflict_history")
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory)

      // Convert date strings back to Date objects
      parsed.lastChecked = parsed.lastChecked ? new Date(parsed.lastChecked) : null
      parsed.conflicts.forEach((conflict: Conflict) => {
        conflict.createdAt = new Date(conflict.createdAt)
        if (conflict.resolvedAt) {
          conflict.resolvedAt = new Date(conflict.resolvedAt)
        }
      })

      conflictHistory = parsed
    }
    return conflictHistory
  } catch (error) {
    console.error("Error loading conflict history:", error)
    return conflictHistory
  }
}

// Save conflict history to local storage
export function saveConflictHistory(): void {
  try {
    localStorage.setItem("ums_conflict_history", JSON.stringify(conflictHistory))
  } catch (error) {
    console.error("Error saving conflict history:", error)
  }
}

// Add a new conflict
export function addConflict(conflict: Omit<Conflict, "id" | "createdAt" | "resolved">): Conflict {
  const newConflict: Conflict = {
    ...conflict,
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    resolved: false,
  }

  conflictHistory.conflicts.push(newConflict)
  conflictHistory.lastChecked = new Date()
  saveConflictHistory()

  return newConflict
}

// Get all unresolved conflicts
export function getUnresolvedConflicts(): Conflict[] {
  return conflictHistory.conflicts.filter((conflict) => !conflict.resolved)
}

// Get all conflicts for an entity
export function getConflictsForEntity(entity: string, entityId: string): Conflict[] {
  return conflictHistory.conflicts.filter((conflict) => conflict.entity === entity && conflict.entityId === entityId)
}

// Resolve a conflict
export function resolveConflict(conflictId: string, strategy: ResolutionStrategy, resolvedData?: any): Conflict | null {
  const conflictIndex = conflictHistory.conflicts.findIndex((c) => c.id === conflictId)

  if (conflictIndex === -1) {
    return null
  }

  const conflict = conflictHistory.conflicts[conflictIndex]

  // Apply resolution strategy
  let finalData: any

  switch (strategy) {
    case "server":
      finalData = conflict.serverData
      break
    case "client":
      finalData = conflict.clientData
      break
    case "merge":
      // For merge, we need the resolved data to be provided
      if (!resolvedData) {
        throw new Error("Resolved data must be provided for merge strategy")
      }
      finalData = resolvedData
      break
    case "manual":
      // For manual, we need the resolved data to be provided
      if (!resolvedData) {
        throw new Error("Resolved data must be provided for manual strategy")
      }
      finalData = resolvedData
      break
    default:
      finalData = conflict.serverData
  }

  // Update the conflict
  const updatedConflict: Conflict = {
    ...conflict,
    resolved: true,
    resolution: strategy,
    resolvedData: finalData,
    resolvedAt: new Date(),
  }

  conflictHistory.conflicts[conflictIndex] = updatedConflict
  saveConflictHistory()

  return updatedConflict
}

// Check for conflicts between a pending operation and server data
export function detectConflict(operation: PendingOperation, serverData: any): Conflict | null {
  // Skip conflict detection for add operations
  if (operation.type === "add") {
    return null
  }

  // For update and delete operations, we need to check for conflicts
  if (operation.type === "update" || operation.type === "delete") {
    // If the entity doesn't exist on the server anymore, it's a conflict
    if (!serverData) {
      return addConflict({
        operationId: operation.id,
        entity: operation.entity,
        entityId: operation.data.id,
        type: "delete",
        clientData: operation.data,
        serverData: null,
      })
    }

    // Check for version conflicts (if the server data has been updated since the client's last sync)
    if (serverData.updated_at && operation.data.updated_at) {
      const serverDate = new Date(serverData.updated_at)
      const clientDate = new Date(operation.data.updated_at)

      // If server data is newer than the client's operation, it's a conflict
      if (serverDate > clientDate) {
        return addConflict({
          operationId: operation.id,
          entity: operation.entity,
          entityId: operation.data.id,
          type: "version",
          clientData: operation.data,
          serverData: serverData,
        })
      }
    }

    // For specific entities, check for data conflicts
    if (operation.entity === "meter") {
      // Check for status conflicts (e.g., if a meter was already sold or allocated)
      if (operation.data.status && serverData.status && operation.data.status !== serverData.status) {
        return addConflict({
          operationId: operation.id,
          entity: operation.entity,
          entityId: operation.data.id,
          type: "data",
          clientData: operation.data,
          serverData: serverData,
        })
      }
    }
  }

  return null
}

// Auto-resolve simple conflicts
export function autoResolveConflict(conflict: Conflict): ResolutionStrategy {
  // For delete conflicts, server wins
  if (conflict.type === "delete") {
    return "server"
  }

  // For version conflicts, use a merge strategy if possible
  if (conflict.type === "version") {
    // If the changes don't overlap, we can merge them
    const clientChanges = getChangedFields(conflict.clientData, conflict.serverData)
    const serverChanges = getChangedFields(conflict.serverData, conflict.clientData)

    // Check if there's any overlap in the changed fields
    const overlap = clientChanges.filter((field) => serverChanges.includes(field))

    if (overlap.length === 0) {
      return "merge"
    }
  }

  // For data conflicts, we need manual resolution
  return "manual"
}

// Helper function to get changed fields between two objects
function getChangedFields(obj1: any, obj2: any): string[] {
  const changedFields: string[] = []

  for (const key in obj1) {
    // Skip id and timestamps
    if (key === "id" || key === "created_at") continue

    // Check if the field exists in both objects and has different values
    if (obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
      changedFields.push(key)
    }
  }

  return changedFields
}

// Merge two objects based on changed fields
export function mergeObjects(clientData: any, serverData: any): any {
  const result = { ...serverData }
  const clientChanges = getChangedFields(clientData, serverData)

  // Apply client changes to the server data
  for (const field of clientChanges) {
    result[field] = clientData[field]
  }

  return result
}

// Get conflict resolution options based on conflict type
export function getResolutionOptions(conflict: Conflict): ResolutionStrategy[] {
  switch (conflict.type) {
    case "delete":
      return ["server", "client"]
    case "version":
      return ["server", "client", "merge", "manual"]
    case "data":
      return ["server", "client", "manual"]
    default:
      return ["server", "client", "manual"]
  }
}

// Initialize conflict history on load
loadConflictHistory()
