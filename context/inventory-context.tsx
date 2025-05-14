"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type {
  Product,
  Agent,
  StockMovement,
  Installation,
  MeterItem,
  Customer,
  SalesTransaction,
} from "@/types/inventory"

// Import services
import * as ProductService from "@/lib/services/product-service"
import * as MeterService from "@/lib/services/meter-service"
import * as CustomerService from "@/lib/services/customer-service"
import * as SalesService from "@/lib/services/sales-service"

// Import local storage and sync services
import * as LocalStorage from "@/lib/local-storage"
import * as SyncService from "@/lib/sync-service"
import type { SyncStatus } from "@/lib/sync-service"

// Import clear data functions
import { clearAllData } from "@/lib/clear-data"

// Import the updated Supabase functions
import { getWorkingSupabaseClient } from "@/lib/supabase"

// Define the context state
type InventoryContextType = {
  products: Product[]
  agents: Agent[]
  stockMovements: StockMovement[]
  installations: Installation[]
  meters: MeterItem[]
  customers: Customer[]
  salesTransactions: SalesTransaction[]
  loading: boolean
  error: string | null
  connectionStatus: "online" | "offline" | "checking"
  syncStatus: SyncStatus
  pendingOperationsCount: number
  lastSyncTime: Date | null

  // Product operations
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProductStock: (id: string, change: number) => Promise<void>

  // Agent operations
  addAgent: (agent: Omit<Agent, "id">) => void

  // Stock movement operations
  recordStockMovement: (movement: Omit<StockMovement, "id">) => void

  // Installation operations
  recordInstallation: (installation: Omit<Installation, "id">) => void

  // Meter operations
  addMeter: (meter: Omit<MeterItem, "id">) => Promise<void>
  updateMeterStatus: (id: string, status: MeterItem["status"], details?: Partial<MeterItem>) => Promise<void>
  getMetersByStatus: (status: MeterItem["status"]) => MeterItem[]
  getMetersByProduct: (productId: string) => MeterItem[]

  // Customer operations
  addCustomer: (customer: Omit<Customer, "id">) => Promise<Customer>
  getCustomerById: (id: string) => Customer | undefined

  // Sales operations
  recordSale: (sale: Omit<SalesTransaction, "id">) => Promise<void>
  getSalesByCustomer: (customerId: string) => SalesTransaction[]

  // Refresh data
  refreshData: () => Promise<void>
  checkConnection: () => Promise<boolean>

  // Sync operations
  syncData: () => Promise<void>

  // Clear data
  clearAllData: () => Promise<void>
}

// Create the context
const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Helper function to check if we're on the login page
const isLoginPage = () => {
  if (typeof window === "undefined") return true // Default to true during SSR
  return window.location.pathname.includes("/auth/login") || window.location.pathname.includes("/auth/")
}

// Helper function to generate a temporary ID
const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Provider component
export function InventoryProvider({ children }: { children: ReactNode }) {
  // Initialize with empty arrays
  const [products, setProducts] = useState<Product[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [installations, setInstallations] = useState<Installation[]>([])
  const [meters, setMeters] = useState<MeterItem[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [salesTransactions, setSalesTransactions] = useState<SalesTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "checking">("checking")
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle")
  const [pendingOperationsCount, setPendingOperationsCount] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Ref to track if initial data has been loaded
  const initialDataLoaded = useRef(false)
  const connectionCheckAttempts = useRef(0)

  // Function to clear all data
  const handleClearAllData = async () => {
    try {
      setLoading(true)

      // Clear all data from local storage and database
      await clearAllData()

      // Reset all state to empty arrays
      setProducts([])
      setAgents([])
      setStockMovements([])
      setInstallations([])
      setMeters([])
      setCustomers([])
      setSalesTransactions([])

      setLoading(false)
      console.log("All data cleared successfully")
    } catch (error) {
      console.error("Error clearing all data:", error)
      setError("Failed to clear data. Please try again.")
      setLoading(false)
    }
  }

  // Function to check connection status with improved error handling
  const checkConnection = async (): Promise<boolean> => {
    // Skip connection check during SSR or on login page
    if (typeof window === "undefined" || isLoginPage()) {
      return false
    }

    try {
      setConnectionStatus("checking")
      console.log("Checking database connection...")

      // Try to get a working Supabase client
      const supabaseClient = await getWorkingSupabaseClient()

      if (supabaseClient) {
        console.log("Database connection successful")
        setConnectionStatus("online")
        return true
      } else {
        console.log("Database connection failed")
        setConnectionStatus("offline")
        return false
      }
    } catch (error) {
      console.error("Connection check error:", error)

      // Log more detailed information about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name)
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }

      setConnectionStatus("offline")
      return false
    }
  }

  // Function to sync data with the server
  const syncData = async (): Promise<void> => {
    // Skip sync during SSR or on login page
    if (typeof window === "undefined" || isLoginPage()) {
      return
    }

    // Check connection first
    const isConnected = await checkConnection()
    if (!isConnected) {
      return
    }

    try {
      setSyncStatus("syncing")

      // Sync pending operations
      const syncResult = await SyncService.syncPendingOperations()

      if (syncResult.status === "success") {
        // Fetch fresh data from the server
        await loadDataFromDatabase()
      }

      setSyncStatus(syncResult.status)

      // Update pending operations count
      setPendingOperationsCount(SyncService.getPendingOperationsCount())

      // Update last sync time
      setLastSyncTime(SyncService.getLastSyncTime())
    } catch (error) {
      console.error("Error syncing data:", error)
      setSyncStatus("error")
    }
  }

  // Function to load data from database
  const loadDataFromDatabase = async (): Promise<void> => {
    try {
      console.log("Loading data from database...")

      // Fetch products
      const productsData = await ProductService.fetchProducts()
      setProducts(productsData)
      console.log(`Loaded ${productsData.length} products from database`)

      // Fetch meters
      const metersData = await MeterService.fetchMeters()
      setMeters(metersData)
      console.log(`Loaded ${metersData.length} meters from database`)

      // Fetch customers
      const customersData = await CustomerService.fetchCustomers()
      setCustomers(customersData)
      console.log(`Loaded ${customersData.length} customers from database`)

      // Fetch sales
      const salesData = await SalesService.fetchSales()
      setSalesTransactions(salesData)
      console.log(`Loaded ${salesData.length} sales from database`)

      // Also update local storage for offline use
      LocalStorage.saveProducts(productsData)
      LocalStorage.saveMeters(metersData)
      LocalStorage.saveCustomers(customersData)
      LocalStorage.saveSales(salesData)

      console.log("Data loaded successfully from database")
      initialDataLoaded.current = true
    } catch (error) {
      console.error("Error loading data from database:", error)

      // Try to load from local storage as fallback
      await loadDataFromLocalStorage()
    }
  }

  // Function to load data from local storage (fallback)
  const loadDataFromLocalStorage = async (): Promise<void> => {
    try {
      console.log("Loading data from local storage...")

      // Load products
      const localProducts = LocalStorage.getProducts()
      if (localProducts.length > 0) {
        setProducts(localProducts)
        console.log(`Loaded ${localProducts.length} products from local storage`)
      }

      // Load meters
      const localMeters = LocalStorage.getMeters()
      if (localMeters.length > 0) {
        setMeters(localMeters)
        console.log(`Loaded ${localMeters.length} meters from local storage`)
      }

      // Load customers
      const localCustomers = LocalStorage.getCustomers()
      if (localCustomers.length > 0) {
        setCustomers(localCustomers)
        console.log(`Loaded ${localCustomers.length} customers from local storage`)
      }

      // Load sales
      const localSales = LocalStorage.getSales()
      if (localSales.length > 0) {
        setSalesTransactions(localSales)
        console.log(`Loaded ${localSales.length} sales from local storage`)
      }

      // Update pending operations count
      setPendingOperationsCount(SyncService.getPendingOperationsCount())

      // Update last sync time
      setLastSyncTime(SyncService.getLastSyncTime())

      console.log("Data loaded successfully from local storage")
    } catch (error) {
      console.error("Error loading data from local storage:", error)
    }
  }

  // Load initial data
  const loadData = async () => {
    // Skip data loading during SSR or on login page
    if (typeof window === "undefined" || isLoginPage()) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check connection with multiple attempts
      let isConnected = false
      for (let i = 0; i < 3; i++) {
        connectionCheckAttempts.current = i + 1
        console.log(`Connection check attempt ${i + 1}...`)
        isConnected = await checkConnection()
        if (isConnected) break
        // Wait a bit before retrying
        if (i < 2) await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      if (isConnected) {
        // If connected, load data from database
        console.log("Connected to database, loading data...")
        await loadDataFromDatabase()
      } else {
        // If not connected, try to load from local storage
        console.log("Not connected to database, trying local storage...")
        setError("Unable to connect to the database. Using local data instead.")
        await loadDataFromLocalStorage()
      }
    } catch (error) {
      console.error("Error loading initial data:", error)
      setError("Failed to load data. Please try again later.")
      setConnectionStatus("offline")

      // Try to load from local storage as last resort
      await loadDataFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  // Set up periodic connection checking
  useEffect(() => {
    // Skip connection checks during SSR or on login page
    if (typeof window === "undefined" || isLoginPage()) {
      return
    }

    // Clear local storage on initial load to remove any old dummy data
    LocalStorage.clearAllLocalData()

    // Check connection initially after a short delay to ensure client-side rendering is complete
    const initialCheckTimeout = setTimeout(() => {
      loadData()
    }, 1000)

    // Set up interval to check connection every 30 seconds
    const intervalId = setInterval(() => {
      // Skip check if we're on the login page
      if (!isLoginPage()) {
        checkConnection().then((isConnected) => {
          // If connection is restored, try to sync
          if (isConnected && pendingOperationsCount > 0) {
            syncData()
          }
        })
      }
    }, 30000)

    return () => {
      clearTimeout(initialCheckTimeout)
      clearInterval(intervalId)
    }
  }, [pendingOperationsCount])

  // Function to refresh data
  const refreshData = async () => {
    await loadData()
  }

  // Function to add a new product
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      if (connectionStatus === "online") {
        // If online, add to server
        const newProduct = await ProductService.addProduct(product)
        setProducts([...products, newProduct])

        // Also update local storage
        LocalStorage.saveProducts([...products, newProduct])
      } else {
        // If offline, add to local storage and queue for sync
        const tempId = generateTempId()
        const newProduct = { ...product, id: tempId }

        // Add to local state
        setProducts([...products, newProduct as Product])

        // Save to local storage
        LocalStorage.saveProducts([...products, newProduct])

        // Add to pending operations
        LocalStorage.addPendingOperation({
          type: "add",
          entity: "product",
          data: {
            name: product.name,
            type: product.type,
            sku: product.sku,
            category: product.category,
            in_stock: product.inStock,
            allocated: product.allocated,
            min_stock: product.minStock,
            cost: product.cost,
            status: product.status,
            requires_serial_tracking: product.requiresSerialTracking,
          },
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())
      }
    } catch (error) {
      console.error("Error adding product:", error)
      throw error
    }
  }

  // Function to update product stock
  const updateProductStock = async (id: string, change: number) => {
    try {
      // Find the product to update
      const productToUpdate = products.find((p) => p.id === id)
      if (!productToUpdate) {
        throw new Error(`Product with ID ${id} not found`)
      }

      // Calculate new stock
      const newStock = productToUpdate.inStock + change
      const status = newStock < productToUpdate.minStock ? "Low Stock" : "Active"

      if (connectionStatus === "online") {
        // If online, update on server
        const updatedProduct = await ProductService.updateProductStock(id, change)
        setProducts(products.map((product) => (product.id === id ? updatedProduct : product)))

        // Also update local storage
        LocalStorage.saveProducts(products.map((product) => (product.id === id ? updatedProduct : product)))
      } else {
        // If offline, update locally and queue for sync
        const updatedProduct = {
          ...productToUpdate,
          inStock: newStock,
          status,
        }

        // Update local state
        setProducts(products.map((product) => (product.id === id ? updatedProduct : product)))

        // Save to local storage
        LocalStorage.saveProducts(products.map((product) => (product.id === id ? updatedProduct : product)))

        // Add to pending operations
        LocalStorage.addPendingOperation({
          type: "update",
          entity: "product",
          data: {
            id,
            in_stock: newStock,
            status,
            updated_at: new Date().toISOString(),
          },
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())
      }
    } catch (error) {
      console.error("Error updating product stock:", error)
      throw error
    }
  }

  // Function to add a new agent
  const addAgent = (agent: Omit<Agent, "id">) => {
    const newId = `A${(agents.length + 1).toString().padStart(3, "0")}`
    setAgents([...agents, { ...agent, id: newId }])
  }

  // Function to record a stock movement
  const recordStockMovement = (movement: Omit<StockMovement, "id">) => {
    const newId = `SM${(stockMovements.length + 1).toString().padStart(3, "0")}`
    const newMovement = { ...movement, id: newId }
    setStockMovements([newMovement, ...stockMovements])

    // Update product stock based on movement type
    const productId = products.find((p) => p.name === movement.product)?.id
    if (productId) {
      const stockChange = movement.type === "Stock In" ? movement.quantity : -movement.quantity
      updateProductStock(productId, stockChange)
    }
  }

  // Function to record an installation
  const recordInstallation = (installation: Omit<Installation, "id">) => {
    const newId = `INS${(installations.length + 1).toString().padStart(3, "0")}`
    setInstallations([{ ...installation, id: newId }, ...installations])
  }

  // Function to add a new meter
  const addMeter = async (meter: Omit<MeterItem, "id">) => {
    try {
      if (connectionStatus === "online") {
        // If online, add to server
        const newMeter = await MeterService.addMeter(meter)
        setMeters([...meters, newMeter])

        // Also update local storage
        LocalStorage.saveMeters([...meters, newMeter])

        // Update product stock count
        await updateProductStock(meter.productId, 1)
      } else {
        // If offline, add to local storage and queue for sync
        const tempId = generateTempId()
        const newMeter = { ...meter, id: tempId }

        // Add to local state
        setMeters([...meters, newMeter as MeterItem])

        // Save to local storage
        LocalStorage.saveMeters([...meters, newMeter])

        // Add to pending operations
        LocalStorage.addPendingOperation({
          type: "add",
          entity: "meter",
          data: {
            product_id: meter.productId,
            meter_number: meter.meterNumber,
            status: meter.status,
            location: meter.location,
            notes: meter.notes,
          },
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())

        // Update product stock count locally
        await updateProductStock(meter.productId, 1)
      }
    } catch (error) {
      console.error("Error adding meter:", error)
      throw error
    }
  }

  // Function to update meter status
  const updateMeterStatus = async (id: string, status: MeterItem["status"], details?: Partial<MeterItem>) => {
    try {
      // Find the meter to update
      const meterToUpdate = meters.find((m) => m.id === id)
      if (!meterToUpdate) {
        throw new Error(`Meter with ID ${id} not found`)
      }

      if (connectionStatus === "online") {
        // If online, update on server
        const updatedMeter = await MeterService.updateMeterStatus(id, status, details)
        setMeters(meters.map((meter) => (meter.id === id ? updatedMeter : meter)))

        // Also update local storage
        LocalStorage.saveMeters(meters.map((meter) => (meter.id === id ? updatedMeter : meter)))
      } else {
        // If offline, update locally and queue for sync
        const updatedMeter = {
          ...meterToUpdate,
          status,
          ...details,
        }

        // Update local state
        setMeters(meters.map((meter) => (meter.id === id ? updatedMeter : meter)))

        // Save to local storage
        LocalStorage.saveMeters(meters.map((meter) => (meter.id === id ? updatedMeter : meter)))

        // Add to pending operations
        const updateData: any = {
          id,
          status,
          updated_at: new Date().toISOString(),
        }

        if (details?.location) updateData.location = details.location
        if (details?.allocatedTo) updateData.allocated_to = details.allocatedTo
        if (details?.soldTo) updateData.sold_to = details.soldTo
        if (details?.soldDate) updateData.sold_date = details.soldDate
        if (details?.soldBy) updateData.sold_by = details.soldBy
        if (details?.price) updateData.price = details.price
        if (details?.notes) updateData.notes = details.notes

        LocalStorage.addPendingOperation({
          type: "update",
          entity: "meter",
          data: updateData,
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())
      }
    } catch (error) {
      console.error("Error updating meter status:", error)
      throw error
    }
  }

  // Function to get meters by status
  const getMetersByStatus = (status: MeterItem["status"]) => {
    return meters.filter((meter) => meter.status === status)
  }

  // Function to get meters by product
  const getMetersByProduct = (productId: string) => {
    return meters.filter((meter) => meter.productId === productId)
  }

  // Function to add a new customer
  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      if (connectionStatus === "online") {
        // If online, add to server
        const newCustomer = await CustomerService.addCustomer(customer)
        setCustomers([...customers, newCustomer])

        // Also update local storage
        LocalStorage.saveCustomers([...customers, newCustomer])

        return newCustomer
      } else {
        // If offline, add to local storage and queue for sync
        const tempId = generateTempId()
        const newCustomer = { ...customer, id: tempId }

        // Add to local state
        setCustomers([...customers, newCustomer as Customer])

        // Save to local storage
        LocalStorage.saveCustomers([...customers, newCustomer])

        // Add to pending operations
        LocalStorage.addPendingOperation({
          type: "add",
          entity: "customer",
          data: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            account_number: customer.accountNumber,
            contact_person: customer.contactPerson,
            customer_type: customer.type || "Individual",
            status: customer.status || "Active",
          },
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())

        return newCustomer as Customer
      }
    } catch (error) {
      console.error("Error adding customer:", error)
      throw error
    }
  }

  // Function to get customer by ID
  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id)
  }

  // Function to record a sale
  const recordSale = async (sale: Omit<SalesTransaction, "id">) => {
    try {
      if (connectionStatus === "online") {
        // If online, add to server
        const newSale = await SalesService.recordSale(sale)
        setSalesTransactions([newSale, ...salesTransactions])

        // Also update local storage
        LocalStorage.saveSales([newSale, ...salesTransactions])

        // Update meter status for each sold meter
        for (const meterId of sale.meterIds) {
          await updateMeterStatus(meterId, "sold", {
            soldTo: sale.customerId,
            soldDate: sale.date,
            soldBy: sale.createdBy,
            price: sale.totalAmount / sale.meterIds.length, // Simple price distribution
          })
        }
      } else {
        // If offline, add to local storage and queue for sync
        const tempId = generateTempId()
        const newSale = { ...sale, id: tempId }

        // Add to local state
        setSalesTransactions([newSale as SalesTransaction, ...salesTransactions])

        // Save to local storage
        LocalStorage.saveSales([newSale, ...salesTransactions])

        // Add to pending operations
        LocalStorage.addPendingOperation({
          type: "add",
          entity: "sale",
          data: {
            date: sale.date,
            customerId: sale.customerId,
            totalAmount: sale.totalAmount,
            paymentMethod: sale.paymentMethod,
            paymentStatus: sale.paymentStatus,
            notes: sale.notes,
            createdBy: sale.createdBy,
            meterIds: sale.meterIds,
          },
        })

        // Update pending operations count
        setPendingOperationsCount(SyncService.getPendingOperationsCount())

        // Update meter status for each sold meter
        for (const meterId of sale.meterIds) {
          await updateMeterStatus(meterId, "sold", {
            soldTo: sale.customerId,
            soldDate: sale.date,
            soldBy: sale.createdBy,
            price: sale.totalAmount / sale.meterIds.length, // Simple price distribution
          })
        }
      }
    } catch (error) {
      console.error("Error recording sale:", error)
      throw error
    }
  }

  // Function to get sales by customer
  const getSalesByCustomer = (customerId: string) => {
    return salesTransactions.filter((sale) => sale.customerId === customerId)
  }

  const value = {
    products,
    agents,
    stockMovements,
    installations,
    meters,
    customers,
    salesTransactions,
    loading,
    error,
    connectionStatus,
    syncStatus,
    pendingOperationsCount,
    lastSyncTime,
    addProduct,
    updateProductStock,
    addAgent,
    recordStockMovement,
    recordInstallation,
    addMeter,
    updateMeterStatus,
    getMetersByStatus,
    getMetersByProduct,
    addCustomer,
    getCustomerById,
    recordSale,
    getSalesByCustomer,
    refreshData,
    checkConnection,
    syncData,
    clearAllData: handleClearAllData,
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

// Custom hook to use the inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
