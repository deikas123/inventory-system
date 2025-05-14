// Function to get products from local storage
export function getProducts() {
  if (typeof window === "undefined") return []
  const storedProducts = localStorage.getItem("products")
  return storedProducts ? JSON.parse(storedProducts) : []
}

// Function to save products to local storage
export function saveProducts(products: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("products", JSON.stringify(products))
}

// Function to get meters from local storage
export function getMeters() {
  if (typeof window === "undefined") return []
  const storedMeters = localStorage.getItem("meters")
  return storedMeters ? JSON.parse(storedMeters) : []
}

// Function to save meters to local storage
export function saveMeters(meters: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("meters", JSON.stringify(meters))
}

// Function to get customers from local storage
export function getCustomers() {
  if (typeof window === "undefined") return []
  const storedCustomers = localStorage.getItem("customers")
  return storedCustomers ? JSON.parse(storedCustomers) : []
}

// Function to save customers to local storage
export function saveCustomers(customers: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("customers", JSON.stringify(customers))
}

// Function to get sales from local storage
export function getSales() {
  if (typeof window === "undefined") return []
  const storedSales = localStorage.getItem("sales")
  return storedSales ? JSON.parse(storedSales) : []
}

// Function to save sales to local storage
export function saveSales(sales: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("sales", JSON.stringify(sales))
}

// Function to add a pending operation
export function addPendingOperation(operation: any) {
  if (typeof window === "undefined") return
  const pendingOperations = getPendingOperations()
  pendingOperations.push({
    ...operation,
    id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    entity: operation.entity,
    type: operation.type,
    data: operation.data,
  })
  localStorage.setItem("pendingOperations", JSON.stringify(pendingOperations))
}

// Function to get pending operations
export function getPendingOperations() {
  if (typeof window === "undefined") return []
  const storedOperations = localStorage.getItem("pendingOperations")
  return storedOperations ? JSON.parse(storedOperations) : []
}

// Function to remove a pending operation
export function removePendingOperation(operationId: string) {
  if (typeof window === "undefined") return
  const pendingOperations = getPendingOperations()
  const updatedOperations = pendingOperations.filter((op: any) => op.id !== operationId)
  localStorage.setItem("pendingOperations", JSON.stringify(updatedOperations))
}

// Function to clear all pending operations
export function clearPendingOperations() {
  if (typeof window === "undefined") return
  localStorage.removeItem("pendingOperations")
}

// Function to save last sync time
export function saveLastSyncTime(time: Date) {
  if (typeof window === "undefined") return
  localStorage.setItem("lastSyncTime", time.toISOString())
}

// Function to get last sync time
export function getLastSyncTime(): Date | null {
  if (typeof window === "undefined") return null
  const storedTime = localStorage.getItem("lastSyncTime")
  return storedTime ? new Date(storedTime) : null
}

// Function to clear all local data
export function clearAllLocalData() {
  if (typeof window === "undefined") return
  localStorage.removeItem("products")
  localStorage.removeItem("meters")
  localStorage.removeItem("customers")
  localStorage.removeItem("sales")
  localStorage.removeItem("pendingOperations")
  localStorage.removeItem("lastSyncTime")
}

export type PendingOperation = {
  id: string
  timestamp: string
  entity: string
  type: string
  data: any
}

function updateLastSync() {
  if (typeof window === "undefined") return
  localStorage.setItem("lastSyncTime", new Date().toISOString())
}

export { updateLastSync }
