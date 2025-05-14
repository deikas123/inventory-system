import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
  FilterIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  TruckIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Sample stock movement data
const stockMovements = [
  {
    id: "SM001",
    date: "2023-04-20",
    type: "Stock In",
    reference: "PO-12345",
    product: "Single Phase Meter",
    quantity: 300,
    location: "Main Warehouse",
    notes: "Received from Supplier ABC",
  },
  {
    id: "SM002",
    date: "2023-04-20",
    type: "Stock Out",
    reference: "REQ-789",
    product: "Single Phase Meter",
    quantity: 50,
    location: "Main Warehouse",
    notes: "Allocated to Agent Sarah",
  },
  {
    id: "SM003",
    date: "2023-04-19",
    type: "Stock Out",
    reference: "REQ-790",
    product: "Connector Clamp",
    quantity: 100,
    location: "Main Warehouse",
    notes: "Allocated to Technician Team",
  },
  {
    id: "SM004",
    date: "2023-04-19",
    type: "Transfer",
    reference: "TRF-456",
    product: "16mm² Service Cable",
    quantity: 200,
    location: "Main Warehouse → Nakuru Branch",
    notes: "Branch stock replenishment",
  },
  {
    id: "SM005",
    date: "2023-04-18",
    type: "Return",
    reference: "RET-123",
    product: "Single Phase Meter",
    quantity: 3,
    location: "Main Warehouse",
    notes: "Faulty meters returned by Agent John",
  },
]

// Sample warehouses data
const warehouses = [
  { id: 1, name: "Main Warehouse", location: "Nairobi HQ", items: 1240, value: "KES 12,450,000" },
  { id: 2, name: "Nakuru Branch", location: "Nakuru Town", items: 450, value: "KES 4,350,000" },
  { id: 3, name: "Mombasa Branch", location: "Mombasa Road", items: 380, value: "KES 3,780,000" },
  { id: 4, name: "Mobile Van 1", location: "Kiambu County", items: 120, value: "KES 980,000" },
]

export default function StockPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Movement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>Add a new stock movement entry (in, out, transfer, or return)</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="stock-in" className="mt-4">
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
                      <Input id="reference" placeholder="e.g. PO-12345" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p001">Single Phase Meter</SelectItem>
                        <SelectItem value="p002">Three Phase Meter</SelectItem>
                        <SelectItem value="p003">Connector Clamp</SelectItem>
                        <SelectItem value="p004">16mm² Service Cable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input type="number" id="quantity" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Warehouse/Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Warehouse</SelectItem>
                          <SelectItem value="nakuru">Nakuru Branch</SelectItem>
                          <SelectItem value="mombasa">Mombasa Branch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" placeholder="Additional details about this stock movement" />
                  </div>
                </TabsContent>
                <TabsContent value="stock-out" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference #</Label>
                      <Input id="reference" placeholder="e.g. REQ-789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p001">Single Phase Meter</SelectItem>
                        <SelectItem value="p002">Three Phase Meter</SelectItem>
                        <SelectItem value="p003">Connector Clamp</SelectItem>
                        <SelectItem value="p004">16mm² Service Cable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input type="number" id="quantity" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">From Warehouse</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Warehouse</SelectItem>
                          <SelectItem value="nakuru">Nakuru Branch</SelectItem>
                          <SelectItem value="mombasa">Mombasa Branch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issued-to">Issued To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent-sarah">Agent: Sarah Kimani</SelectItem>
                        <SelectItem value="agent-john">Agent: John Mwangi</SelectItem>
                        <SelectItem value="technician-team">Technician Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" placeholder="Additional details about this stock movement" />
                  </div>
                </TabsContent>
                <div className="flex justify-end mt-4">
                  <Button>Submit</Button>
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active locations storing inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 21.5M</div>
            <p className="text-xs text-muted-foreground">Overall inventory valuation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Last 30 days transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Items below minimum thresholds</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 mb-6">
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Stock Movements</CardTitle>
            <CardDescription>Recent inventory transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  All
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />
                  Stock In
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
                  Stock Out
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <TruckIcon className="h-3.5 w-3.5 mr-1" />
                  Transfers
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 h-8 text-sm" />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <FilterIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden md:table-cell">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{movement.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "Stock In"
                              ? "outline"
                              : movement.type === "Stock Out"
                                ? "secondary"
                                : movement.type === "Transfer"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movement.product}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell className="hidden md:table-cell">{movement.location}</TableCell>
                      <TableCell className="hidden md:table-cell">{movement.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" className="h-8">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Warehouses</CardTitle>
            <CardDescription>Inventory locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <PackageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{warehouse.name}</p>
                      <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{warehouse.items} items</p>
                    <p className="text-xs text-muted-foreground">{warehouse.value}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
