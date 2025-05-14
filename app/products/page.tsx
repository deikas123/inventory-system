"use client"

import { useState } from "react"
import { useInventory } from "@/context/inventory-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { AddMeter } from "./add-meter"
import { MeterInventory } from "./meter-inventory"
import { isDataEmpty } from "@/lib/fallback-data"

export default function ProductsPage() {
  const { products, meters, loading, connectionStatus } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingMeter, setIsAddingMeter] = useState(false)

  // Handle loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading products and meters...</p>
        </div>
      </div>
    )
  }

  // Handle empty state
  if (isDataEmpty(products) && connectionStatus === "online") {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold">No products found</h3>
        <p className="mb-8 max-w-md text-muted-foreground">
          You haven't added any products yet. Add your first product to get started.
        </p>
        <Button onClick={() => setIsAddingMeter(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Meter
        </Button>
        {isAddingMeter && <AddMeter open={isAddingMeter} onOpenChange={setIsAddingMeter} />}
      </div>
    )
  }

  // Handle connection error state
  if (connectionStatus === "offline") {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-amber-100 p-3">
          <Search className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold">Connection Error</h3>
        <p className="mb-4 max-w-md text-muted-foreground">
          Unable to connect to the database. Please check your internet connection and Supabase configuration.
        </p>
        <p className="mb-8 max-w-md text-sm text-muted-foreground">
          You can still add products and meters while offline. Your changes will be synced when you're back online.
        </p>
        <Button onClick={() => setIsAddingMeter(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Meter
        </Button>
        {isAddingMeter && <AddMeter open={isAddingMeter} onOpenChange={setIsAddingMeter} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products & Meters</h1>
        <Button onClick={() => setIsAddingMeter(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Meter
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search meters by number, product, or status..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Meters</TabsTrigger>
          <TabsTrigger value="in-stock">In Stock</TabsTrigger>
          <TabsTrigger value="allocated">Allocated</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <MeterInventory meters={meters} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="in-stock">
          <MeterInventory meters={meters.filter((meter) => meter.status === "in-stock")} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="allocated">
          <MeterInventory meters={meters.filter((meter) => meter.status === "allocated")} searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="sold">
          <MeterInventory meters={meters.filter((meter) => meter.status === "sold")} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      {isAddingMeter && <AddMeter open={isAddingMeter} onOpenChange={setIsAddingMeter} />}
    </div>
  )
}
