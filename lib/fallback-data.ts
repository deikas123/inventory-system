import type { Product, MeterItem, Customer, SalesTransaction } from "@/types/inventory"

// Function to generate minimal fallback data when database connection fails
export function generateFallbackData() {
  return {
    products: [] as Product[],
    meters: [] as MeterItem[],
    customers: [] as Customer[],
    sales: [] as SalesTransaction[],
  }
}

// Function to check if data is empty
export function isDataEmpty(data: any[]): boolean {
  return !data || data.length === 0
}
