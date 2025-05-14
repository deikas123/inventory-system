import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  ShoppingCartIcon,
  PackageIcon,
  TruckIcon,
  BuildingIcon,
  FileTextIcon,
  CheckIcon,
  ClockIcon,
  AlertCircleIcon,
  DownloadIcon,
  CalendarIcon,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { StatCard } from "@/components/stat-card"

// Sample purchase orders data
const purchaseOrders = [
  {
    id: "PO-12345",
    supplier: "ABC Electronics Ltd",
    date: "2023-04-15",
    total: "KES 1,250,000",
    items: 3,
    status: "Delivered",
    paymentStatus: "Paid",
  },
  {
    id: "PO-12346",
    supplier: "XYZ Meters Inc",
    date: "2023-04-18",
    total: "KES 850,000",
    items: 2,
    status: "In Transit",
    paymentStatus: "Paid",
  },
  {
    id: "PO-12347",
    supplier: "Kenya Tools & Equipment",
    date: "2023-04-20",
    total: "KES 125,000",
    items: 5,
    status: "Processing",
    paymentStatus: "Pending",
  },
  {
    id: "PO-12348",
    supplier: "ABC Electronics Ltd",
    date: "2023-04-22",
    total: "KES 2,450,000",
    items: 4,
    status: "Ordered",
    paymentStatus: "Pending",
  },
  {
    id: "PO-12349",
    supplier: "Global Meter Solutions",
    date: "2023-04-25",
    total: "KES 1,780,000",
    items: 2,
    status: "Ordered",
    paymentStatus: "Pending",
  },
]

// Sample suppliers data
const suppliers = [
  {
    id: "SUP001",
    name: "ABC Electronics Ltd",
    contact: "John Smith",
    email: "john@abcelectronics.com",
    phone: "+254 712 345 678",
    address: "Industrial Area, Nairobi",
    status: "Active",
  },
  {
    id: "SUP002",
    name: "XYZ Meters Inc",
    contact: "Mary Johnson",
    email: "mary@xyzmeters.com",
    phone: "+1 555 123 4567",
    address: "Chicago, USA",
    status: "Active",
  },
  {
    id: "SUP003",
    name: "Kenya Tools & Equipment",
    contact: "James Mwangi",
    email: "james@kenyatools.co.ke",
    phone: "+254 723 456 789",
    address: "Mombasa Road, Nairobi",
    status: "Active",
  },
  {
    id: "SUP004",
    name: "Global Meter Solutions",
    contact: "Sarah Wong",
    email: "sarah@globalmeters.com",
    phone: "+65 9876 5432",
    address: "Singapore",
    status: "Active",
  },
]

// Sample purchase order items for a detailed view
const poItems = [
  {
    id: 1,
    product: "Single Phase Meter",
    sku: "M-SP-001",
    quantity: 200,
    unitPrice: "KES 2,500",
    total: "KES 500,000",
  },
  {
    id: 2,
    product: "Three Phase Meter",
    sku: "M-TP-001",
    quantity: 100,
    unitPrice: "KES 4,800",
    total: "KES 480,000",
  },
  {
    id: 3,
    product: "Sealing Kit",
    sku: "T-SK-001",
    quantity: 300,
    unitPrice: "KES 750",
    total: "KES 225,000",
  },
]

export default function PurchasesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Purchase & Supplier Management</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>Create a new purchase order for inventory items</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="po-number">PO Number</Label>
                    <Input id="po-number" placeholder="Auto-generated" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="po-date">Date</Label>
                    <Input id="po-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Items</Label>
                  <Card>
                    <CardContent className="p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <Input type="number" placeholder="0" min="1" className="w-20" />
                            </TableCell>
                            <TableCell>
                              <Input placeholder="0.00" className="w-28" />
                            </TableCell>
                            <TableCell>KES 0.00</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expected-delivery">Expected Delivery</Label>
                    <Input id="expected-delivery" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes for this purchase order" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">Total: KES 0.00</div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Purchase Order</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BuildingIcon className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>Add a new supplier to your vendor database</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-name">Supplier Name</Label>
                    <Input id="supplier-name" placeholder="Company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" placeholder="Primary contact" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contact@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Physical address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-type">Supplier Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="wholesaler">Wholesaler</SelectItem>
                        <SelectItem value="retailer">Retailer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Default Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional information about this supplier" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Supplier</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Purchase Orders"
          value="8"
          description="Orders awaiting delivery"
          icon={<ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="2 more than last month"
        />
        <StatCard
          title="Orders In Transit"
          value="2"
          description="Currently being shipped"
          icon={<TruckIcon className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          trendValue="Same as last week"
        />
        <StatCard
          title="Total Suppliers"
          value="12"
          description="Active vendor relationships"
          icon={<BuildingIcon className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="1 new this month"
        />
        <StatCard
          title="Pending Receipts"
          value="3"
          description="Awaiting goods receipt"
          icon={<PackageIcon className="h-4 w-4 text-muted-foreground" />}
          trend="down"
          trendValue="2 less than last week"
        />
      </div>

      <Tabs defaultValue="orders" className="mb-6">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Purchase Orders</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-8 w-[200px] md:w-[250px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "outline"
                              : order.status === "In Transit"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Order</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark as Received</DropdownMenuItem>
                            <DropdownMenuItem>Generate GRN</DropdownMenuItem>
                            <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <div className="hidden">Trigger for PO Details Dialog</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Purchase Order Details</DialogTitle>
                <DialogDescription>PO-12345 | ABC Electronics Ltd</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">2023-04-15</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline">Delivered</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Paid
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Date</p>
                    <p className="font-medium">2023-04-20</p>
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitPrice}</TableCell>
                          <TableCell>{item.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier Details</p>
                    <p className="font-medium">ABC Electronics Ltd</p>
                    <p className="text-sm">Contact: John Smith</p>
                    <p className="text-sm">john@abcelectronics.com</p>
                    <p className="text-sm">+254 712 345 678</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="font-medium">KES 1,205,000</p>
                    <p className="text-sm text-muted-foreground mt-1">Tax (16%)</p>
                    <p className="font-medium">KES 45,000</p>
                    <p className="text-lg font-bold mt-2">Total: KES 1,250,000</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Mark as Received
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Suppliers</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search suppliers..." className="pl-8 w-[200px] md:w-[250px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.contact}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{supplier.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Create Purchase Order</DropdownMenuItem>
                            <DropdownMenuItem>View Order History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate Supplier</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receiving" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Goods Receiving</CardTitle>
              <CardDescription>Process incoming deliveries and update inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="po-number">Purchase Order</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purchase order" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseOrders
                      .filter((po) => po.status !== "Delivered")
                      .map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.id} - {po.supplier}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiving-date">Receiving Date</Label>
                <Input id="receiving-date" type="date" />
              </div>

              <div className="space-y-2">
                <Label>Items Received</Label>
                <Card>
                  <CardContent className="p-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Received?</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.product}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <Input type="number" placeholder="0" className="w-20" />
                            </TableCell>
                            <TableCell>
                              <Select>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="damaged">Damaged</SelectItem>
                                  <SelectItem value="partial">Partial</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-note">Delivery Note Number</Label>
                <Input id="delivery-note" placeholder="Enter delivery note number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Receiving Notes</Label>
                <Textarea id="notes" placeholder="Any additional notes about this delivery" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Process Receipt</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deliveries</CardTitle>
            <CardDescription>Expected in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOrders
                .filter((po) => po.status === "In Transit" || po.status === "Processing")
                .slice(0, 3)
                .map((po) => (
                  <div key={po.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <TruckIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{po.id}</p>
                        <p className="text-xs text-muted-foreground">{po.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Expected: 2023-04-28</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>Quality and delivery metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">On-Time Delivery</span>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Quality Compliance</span>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Price Competitiveness</span>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Response Time</span>
                </div>
                <span className="text-sm font-medium">90%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Overall supplier rating: 86%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Purchase Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <AlertCircleIcon className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Delayed Shipment</span> - PO-12346 is 2 days overdue
                  </p>
                  <p className="text-xs text-muted-foreground">XYZ Meters Inc</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <ClockIcon className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Pending Approval</span> - 2 purchase orders awaiting approval
                  </p>
                  <p className="text-xs text-muted-foreground">Requires manager action</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Price Change</span> - Single Phase Meter price increased by 5%
                  </p>
                  <p className="text-xs text-muted-foreground">ABC Electronics Ltd</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
