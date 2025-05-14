"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useInventory } from "@/context/inventory-context"
import { PlusIcon, XIcon, ScanIcon, SearchIcon, CheckIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function MeterMovement() {
  const { products, meters, updateMeterStatus, recordStockMovement } = useInventory()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [movementType, setMovementType] = useState<"stock-in" | "stock-out" | "transfer" | "return">("stock-in")
  const [reference, setReference] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMeters, setSelectedMeters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [fromLocation, setFromLocation] = useState("Main Warehouse")
  const [toLocation, setToLocation] = useState("Nakuru Branch")
  const [issuedTo, setIssuedTo] = useState("")
  const [notes, setNotes] = useState("")

  // Filter only products that require serial tracking (meters)
  const meterProducts = products.filter((product) => product.requiresSerialTracking)

  // Get available meters based on movement type
  const getAvailableMeters = () => {
    switch (movementType) {
      case "stock-in":
        // For stock-in, we don't need to filter existing meters
        return []
      case "stock-out":
      case "transfer":
        // For stock-out and transfer, we need in-stock meters
        return meters.filter((meter) => meter.status === "in-stock")
      case "return":
        // For return, we need allocated meters
        return meters.filter((meter) => meter.status === "allocated")
      default:
        return []
    }
  }

  const availableMeters = getAvailableMeters()

  // Filter meters based on search term
  const filteredMeters = availableMeters.filter((meter) =>
    meter.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle meter selection
  const toggleMeterSelection = (meterId: string) => {
    if (selectedMeters.includes(meterId)) {
      setSelectedMeters(selectedMeters.filter((id) => id !== meterId))
    } else {
      setSelectedMeters([...selectedMeters, meterId])
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!reference) {
      toast({
        title: "Missing Reference",
        description: "Please enter a reference number",
        variant: "destructive",
      })
      return
    }

    if (selectedMeters.length === 0 && movementType !== "stock-in") {
      toast({
        title: "No Meters Selected",
        description: "Please select at least one meter",
        variant: "destructive",
      })
      return
    }

    // For stock-in, we need to validate new meter numbers
    if (movementType === "stock-in" && newMeterNumbers.length === 0) {
      toast({
        title: "No Meter Numbers",
        description: "Please enter at least one meter number",
        variant: "destructive",
      })
      return
    }

    // Process based on movement type
    switch (movementType) {
      case "stock-in":
        // Add new meters
        newMeterNumbers.forEach((meterNumber) => {
          if (!meterNumber.trim()) return

          // Add meter
          const newMeter = {
            productId: selectedProductId,
            meterNumber: meterNumber.trim(),
            status: "in-stock",
            location: toLocation,
          }

          // In a real app, we would call addMeter here
          console.log("Adding new meter:", newMeter)
        })

        // Record stock movement
        recordStockMovement({
          date,
          type: "Stock In",
          reference,
          product: products.find((p) => p.id === selectedProductId)?.name || "Unknown Product",
          quantity: newMeterNumbers.filter((m) => m.trim() !== "").length,
          location: toLocation,
          notes,
          meterNumbers: newMeterNumbers.filter((m) => m.trim() !== ""),
        })
        break

      case "stock-out":
        // Update meter status
        selectedMeters.forEach((meterId) => {
          const meter = meters.find((m) => m.id === meterId)
          if (meter) {
            updateMeterStatus(meterId, "allocated", {
              allocatedTo: issuedTo,
              location: "Field",
            })
          }
        })

        // Record stock movement
        recordStockMovement({
          date,
          type: "Stock Out",
          reference,
          product: "Multiple Products", // In a real app, we would list the products
          quantity: selectedMeters.length,
          location: fromLocation,
          notes: `Issued to: ${issuedTo}. ${notes}`,
          meterNumbers: selectedMeters
            .map((id) => {
              const meter = meters.find((m) => m.id === id)
              return meter ? meter.meterNumber : ""
            })
            .filter(Boolean),
        })
        break

      case "transfer":
        // Update meter location
        selectedMeters.forEach((meterId) => {
          const meter = meters.find((m) => m.id === meterId)
          if (meter) {
            updateMeterStatus(meterId, "in-stock", {
              location: toLocation,
            })
          }
        })

        // Record stock movement
        recordStockMovement({
          date,
          type: "Transfer",
          reference,
          product: "Multiple Products", // In a real app, we would list the products
          quantity: selectedMeters.length,
          location: `${fromLocation} → ${toLocation}`,
          notes,
          meterNumbers: selectedMeters
            .map((id) => {
              const meter = meters.find((m) => m.id === id)
              return meter ? meter.meterNumber : ""
            })
            .filter(Boolean),
        })
        break

      case "return":
        // Update meter status
        selectedMeters.forEach((meterId) => {
          const meter = meters.find((m) => m.id === meterId)
          if (meter) {
            updateMeterStatus(meterId, "in-stock", {
              location: toLocation,
            })
          }
        })

        // Record stock movement
        recordStockMovement({
          date,
          type: "Return",
          reference,
          product: "Multiple Products", // In a real app, we would list the products
          quantity: selectedMeters.length,
          location: toLocation,
          notes,
          meterNumbers: selectedMeters
            .map((id) => {
              const meter = meters.find((m) => m.id === id)
              return meter ? meter.meterNumber : ""
            })
            .filter(Boolean),
        })
        break
    }

    // Reset form and close dialog
    setReference("")
    setSelectedMeters([])
    setNewMeterNumbers([""])
    setSelectedProductId("")
    setNotes("")
    setOpen(false)

    toast({
      title: "Movement Recorded",
      description: `${movementType.replace("-", " ")} operation completed successfully`,
    })
  }

  // For stock-in: new meter numbers and product
  const [newMeterNumbers, setNewMeterNumbers] = useState<string[]>([""])
  const [selectedProductId, setSelectedProductId] = useState("")

  // Add another meter number field
  const addMeterNumberField = () => {
    setNewMeterNumbers([...newMeterNumbers, ""])
  }

  // Remove a meter number field
  const removeMeterNumberField = (index: number) => {
    const updatedMeterNumbers = [...newMeterNumbers]
    updatedMeterNumbers.splice(index, 1)
    setNewMeterNumbers(updatedMeterNumbers)
  }

  // Update a meter number
  const updateMeterNumber = (index: number, value: string) => {
    const updatedMeterNumbers = [...newMeterNumbers]
    updatedMeterNumbers[index] = value
    setNewMeterNumbers(updatedMeterNumbers)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Record Movement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Record Stock Movement</DialogTitle>
          <DialogDescription>Add a new stock movement entry (in, out, transfer, or return)</DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="stock-in"
          value={movementType}
          onValueChange={(value) => setMovementType(value as any)}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="stock-in">Stock In</TabsTrigger>
            <TabsTrigger value="stock-out">Stock Out</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="return">Return</TabsTrigger>
          </TabsList>

          <TabsContent value="stock-in" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference #</Label>
                <Input
                  id="reference"
                  placeholder="e.g. PO-12345"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {meterProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meter Numbers</Label>
              <div className="space-y-2">
                {newMeterNumbers.map((meterNumber, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Meter serial number ${index + 1}`}
                      value={meterNumber}
                      onChange={(e) => updateMeterNumber(index, e.target.value)}
                    />
                    {newMeterNumbers.length > 1 && (
                      <Button variant="outline" size="icon" onClick={() => removeMeterNumberField(index)}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" type="button" onClick={addMeterNumberField} className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Another Meter Number
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Warehouse/Location</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                  <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this stock movement"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="stock-out" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference #</Label>
                <Input
                  id="reference"
                  placeholder="e.g. REQ-789"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Meters</Label>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by meter number..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <ScanIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {filteredMeters.length > 0 ? (
                  filteredMeters.map((meter) => {
                    const product = products.find((p) => p.id === meter.productId)
                    const isSelected = selectedMeters.includes(meter.id)

                    return (
                      <div
                        key={meter.id}
                        className={`flex items-center justify-between p-2 cursor-pointer hover:bg-muted ${isSelected ? "bg-primary/5" : ""}`}
                        onClick={() => toggleMeterSelection(meter.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-sm border ${isSelected ? "bg-primary border-primary" : "border-input"} flex items-center justify-center`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span className="font-mono text-sm">{meter.meterNumber}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{product?.name}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No meters found matching your search</div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">Selected: {selectedMeters.length} meter(s)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-location">From Warehouse</Label>
                <Select value={fromLocation} onValueChange={setFromLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                    <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issued-to">Issued To</Label>
                <Input
                  id="issued-to"
                  placeholder="Agent or department name"
                  value={issuedTo}
                  onChange={(e) => setIssuedTo(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this stock movement"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference #</Label>
                <Input
                  id="reference"
                  placeholder="e.g. TRF-456"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Meters</Label>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by meter number..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <ScanIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {filteredMeters.length > 0 ? (
                  filteredMeters.map((meter) => {
                    const product = products.find((p) => p.id === meter.productId)
                    const isSelected = selectedMeters.includes(meter.id)

                    return (
                      <div
                        key={meter.id}
                        className={`flex items-center justify-between p-2 cursor-pointer hover:bg-muted ${isSelected ? "bg-primary/5" : ""}`}
                        onClick={() => toggleMeterSelection(meter.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-sm border ${isSelected ? "bg-primary border-primary" : "border-input"} flex items-center justify-center`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span className="font-mono text-sm">{meter.meterNumber}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{product?.name}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No meters found matching your search</div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">Selected: {selectedMeters.length} meter(s)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-location">From Location</Label>
                <Select value={fromLocation} onValueChange={setFromLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                    <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-location">To Location</Label>
                <Select value={toLocation} onValueChange={setToLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                    <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this transfer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="return" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference #</Label>
                <Input
                  id="reference"
                  placeholder="e.g. RET-123"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Meters</Label>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by meter number..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <ScanIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {filteredMeters.length > 0 ? (
                  filteredMeters.map((meter) => {
                    const product = products.find((p) => p.id === meter.productId)
                    const isSelected = selectedMeters.includes(meter.id)

                    return (
                      <div
                        key={meter.id}
                        className={`flex items-center justify-between p-2 cursor-pointer hover:bg-muted ${isSelected ? "bg-primary/5" : ""}`}
                        onClick={() => toggleMeterSelection(meter.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-sm border ${isSelected ? "bg-primary border-primary" : "border-input"} flex items-center justify-center`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span className="font-mono text-sm">{meter.meterNumber}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Allocated
                        </Badge>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No allocated meters found matching your search
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">Selected: {selectedMeters.length} meter(s)</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-location">Return To</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                  <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Reason for return and condition of meters"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
