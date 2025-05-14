// Define the types for our inventory system
export type Product = {
  id: string
  name: string
  type: string
  sku: string
  category: string
  inStock: number
  allocated: number
  minStock: number
  cost: number
  status: string
  requiresSerialTracking?: boolean
}

export type Agent = {
  id: string
  name: string
  phone: string
  region: string
  status: string
  totalAllocated: number
  pendingReturns: number
  installationsThisMonth: number
  lastActivity: string
}

export type StockMovement = {
  id: string
  date: string
  type: string
  reference: string
  product: string
  quantity: number
  location: string
  notes?: string
}

export type Installation = {
  id: string
  meterNumber: string
  customer: string
  location: string
  agent: string
  installDate: string
  status: string
}

// Update the MeterItem type to emphasize serial number tracking
export type MeterItem = {
  id: string
  productId: string
  meterNumber: string // This is the serial number (e.g., 58102527205)
  status: "in-stock" | "allocated" | "sold" | "installed" | "returned" | "faulty"
  location: string
  allocatedTo?: string
  soldTo?: string
  soldDate?: string
  soldBy?: string
  price?: number
  notes?: string
  // Add tracking metadata
  addedDate: string
  lastUpdated: string
  // Add tracking history
  trackingHistory?: MeterTrackingEvent[]
}

// Add a type for meter tracking events
export type MeterTrackingEvent = {
  id: string
  timestamp: string
  eventType: "added" | "allocated" | "sold" | "installed" | "returned" | "status-change" | "location-change"
  description: string
  performedBy?: string
  details?: Record<string, any>
}

export type Customer = {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  accountNumber: string
}

export type SalesTransaction = {
  id: string
  date: string
  meterIds: string[]
  customerId: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "partial" | "cancelled"
  notes?: string
  createdBy: string
}
