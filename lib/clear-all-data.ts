// Function to completely clear all data from local storage
export function clearAllLocalStorage(): void {
  console.log("Clearing all local storage data...")

  // Clear all inventory-related data
  localStorage.removeItem("products")
  localStorage.removeItem("meters")
  localStorage.removeItem("customers")
  localStorage.removeItem("sales")
  localStorage.removeItem("agents")
  localStorage.removeItem("stockMovements")
  localStorage.removeItem("installations")
  localStorage.removeItem("pendingOperations")
  localStorage.removeItem("lastSyncTime")

  // Clear any other potential data
  localStorage.removeItem("theme")
  localStorage.removeItem("settings")

  console.log("All local storage data cleared successfully")
}
