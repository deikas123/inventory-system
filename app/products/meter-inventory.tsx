"use client"

import { useState } from "react"
import { useInventory } from "@/context/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Search, MoreVertical, Filter, Download, QrCode, History, Clipboard, CheckCircle2 } from "lucide-react"
import { AddMeter } from "./add-meter"

export type MeterInventoryProps = {
  filterCategory?: string
}

export function MeterInventory({ filterCategory }: MeterInventoryProps) {
  const { products, meters, updateMeterStatus } = useInventory()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedMeter, setSelectedMeter] = useState<any | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "",
    location: "",
    notes: "",
  })

  // Group meters by product
  const metersByProduct = products
    .filter((product) => product.type === "Meter" && (!filterCategory || product.category === filterCategory))
    .map((product) => {
      const productMeters = meters.filter((meter) => meter.productId === product.id)
      return {
        product,
        meters: productMeters,
        totalCount: productMeters.length,
        inStockCount: productMeters.filter((m) => m.status === "in-stock").length,
        allocatedCount: productMeters.filter((m) => m.status === "allocated").length,
        soldCount: productMeters.filter((m) => m.status === "sold").length,
        installedCount: productMeters.filter((m) => m.status === "installed").length,
        returnedCount: productMeters.filter((m) => m.status === "returned").length,
        faultyCount: productMeters.filter((m) => m.status === "faulty").length,
      }
    })

  // Filter meters based on search query and status filter
  const filterMeters = (meters: any[]) => {
    return meters.filter((meter) => {
      const matchesSearch = searchQuery ? meter.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) : true
      const matchesStatus = statusFilter ? meter.status === statusFilter : true
      return matchesSearch && matchesStatus
    })
  }

  // Handle meter status update
  const handleUpdateMeterStatus = async () => {
    if (!selectedMeter || !updateData.status) return

    try {
      const now = new Date().toISOString()

      // Create tracking event
      const trackingEvent = {
        id: `event_${Date.now()}`,
        timestamp: now,
        eventType: updateData.status === selectedMeter.status ? "location-change" : "status-change",
        description:
          updateData.status === selectedMeter.status
            ? `Meter location changed to ${updateData.location}`
            : `Meter status changed from ${selectedMeter.status} to ${updateData.status}`,
        details: {
          previousStatus: selectedMeter.status,
          newStatus: updateData.status,
          previousLocation: selectedMeter.location,
          newLocation: updateData.location,
          notes: updateData.notes,
        },
      }

      // Update meter with tracking history
      await updateMeterStatus(selectedMeter.id, updateData.status as any, {
        location: updateData.location || selectedMeter.location,
        notes: updateData.notes,
        lastUpdated: now,
        trackingHistory: [...(selectedMeter.trackingHistory || []), trackingEvent],
      })

      toast({
        title: "Meter Updated",
        description: `Meter ${selectedMeter.meterNumber} has been updated`,
      })

      setIsUpdateOpen(false)
      setSelectedMeter(null)
      setUpdateData({
        status: "",
        location: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error updating meter:", error)
      toast({
        title: "Error",
        description: "Failed to update meter. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Copy meter number to clipboard
  const copyMeterNumber = (meterNumber: string) => {
    navigator.clipboard.writeText(meterNumber)
    toast({
      title: "Copied",
      description: `Meter number ${meterNumber} copied to clipboard`,
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by meter serial number..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-stock")}>In Stock</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("allocated")}>Allocated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("sold")}>Sold</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("installed")}>Installed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("returned")}>Returned</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("faulty")}>Faulty</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddMeter />
        </div>
      </div>

      {statusFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            Status: {statusFilter}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter(null)}>
            Clear
          </Button>
        </div>
      )}

      {metersByProduct.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No meter products found</p>
            <AddMeter />
          </CardContent>
        </Card>
      ) : (
        metersByProduct.map(({ product, meters, totalCount, inStockCount, allocatedCount, soldCount }) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {totalCount} total meters | {inStockCount} in stock | {allocatedCount} allocated | {soldCount} sold
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
                  <TabsTrigger value="in-stock">In Stock ({inStockCount})</TabsTrigger>
                  <TabsTrigger value="allocated">Allocated ({allocatedCount})</TabsTrigger>
                  <TabsTrigger value="sold">Sold ({soldCount})</TabsTrigger>
                </TabsList>

                {["all", "in-stock", "allocated", "sold"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Serial Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="hidden md:table-cell">Added Date</TableHead>
                            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filterMeters(tab === "all" ? meters : meters.filter((meter) => meter.status === tab))
                            .length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No meters found
                                {searchQuery && " matching your search"}
                                {statusFilter && ` with status "${statusFilter}"`}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filterMeters(tab === "all" ? meters : meters.filter((meter) => meter.status === tab)).map(
                              (meter) => (
                                <TableRow key={meter.id}>
                                  <TableCell className="font-mono font-medium">
                                    <div className="flex items-center gap-2">
                                      {meter.meterNumber}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyMeterNumber(meter.meterNumber)}
                                      >
                                        <Clipboard className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        meter.status === "in-stock"
                                          ? "outline"
                                          : meter.status === "allocated"
                                            ? "secondary"
                                            : meter.status === "sold"
                                              ? "default"
                                              : meter.status === "installed"
                                                ? "success"
                                                : meter.status === "returned"
                                                  ? "warning"
                                                  : "destructive"
                                      }
                                      className="capitalize"
                                    >
                                      {meter.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{meter.location}</TableCell>
                                  <TableCell className="hidden md:table-cell">{formatDate(meter.addedDate)}</TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {formatDate(meter.lastUpdated)}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreVertical className="h-4 w-4" />
                                          <span className="sr-only">Open menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedMeter(meter)
                                            setIsUpdateOpen(true)
                                            setUpdateData({
                                              status: meter.status,
                                              location: meter.location,
                                              notes: meter.notes || "",
                                            })
                                          }}
                                        >
                                          Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedMeter(meter)
                                            setIsHistoryOpen(true)
                                          }}
                                        >
                                          <History className="h-4 w-4 mr-2" />
                                          View History
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => copyMeterNumber(meter.meterNumber)}>
                                          <Clipboard className="h-4 w-4 mr-2" />
                                          Copy Serial Number
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <QrCode className="h-4 w-4 mr-2" />
                                          Generate QR Code
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ),
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))
      )}

      {/* Meter History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Meter Tracking History</DialogTitle>
            <DialogDescription>
              {selectedMeter && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-medium">{selectedMeter.meterNumber}</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedMeter.status}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {selectedMeter?.trackingHistory?.length ? (
              <div className="space-y-4">
                {selectedMeter.trackingHistory
                  .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((event: any) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="capitalize">
                          {event.eventType.replace("-", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</span>
                      </div>
                      <p className="text-sm">{event.description}</p>
                      {event.details && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Object.entries(event.details)
                            .filter(([key, value]) => value && key !== "notes")
                            .map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          {event.details.notes && (
                            <div className="mt-1 p-2 bg-muted rounded-md">
                              <span className="block font-medium mb-1">Notes:</span>
                              <span>{event.details.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">No tracking history available for this meter</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Meter Status Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Meter Status</DialogTitle>
            <DialogDescription>
              {selectedMeter && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-medium">{selectedMeter.meterNumber}</span>
                  <Badge variant="outline" className="capitalize">
                    Current: {selectedMeter.status}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="allocated">Allocated</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="installed">Installed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="faulty">Faulty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={updateData.location}
                onValueChange={(value) => setUpdateData({ ...updateData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedMeter?.location || "Select location"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                  <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
                  <SelectItem value="Field">Field</SelectItem>
                  <SelectItem value="Customer Site">Customer Site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this status change"
                value={updateData.notes}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMeterStatus}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Update Meter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Also keep the default export for backward compatibility
export default MeterInventory
