"use client"

import { useState } from "react"
import DashboardShell from "@/components/dashboard-shell"
import { useInventory } from "@/context/inventory-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, ShoppingCart, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SalesPage() {
  const { meters, products, customers, salesTransactions, addCustomer, recordSale } = useInventory()
  const { toast } = useToast()

  // State for new sale
  const [selectedMeters, setSelectedMeters] = useState<string[]>([])
  const [customerId, setCustomerId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "partial" | "cancelled">("paid")
  const [totalAmount, setTotalAmount] = useState(0)
  const [notes, setNotes] = useState("")

  // State for new customer
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    accountNumber: "",
  })

  // Get available meters (in stock)
  const availableMeters = meters.filter((meter) => meter.status === "in-stock")

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  // Get product price by ID
  const getProductPrice = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.cost : 0
  }

  // Handle meter selection
  const toggleMeterSelection = (meterId: string) => {
    if (selectedMeters.includes(meterId)) {
      setSelectedMeters(selectedMeters.filter((id) => id !== meterId))
    } else {
      setSelectedMeters([...selectedMeters, meterId])
    }

    // Update total amount based on selected meters
    const updatedSelectedMeters = selectedMeters.includes(meterId)
      ? selectedMeters.filter((id) => id !== meterId)
      : [...selectedMeters, meterId]

    const newTotal = updatedSelectedMeters.reduce((sum, id) => {
      const meter = meters.find((m) => m.id === id)
      return sum + (meter ? getProductPrice(meter.productId) : 0)
    }, 0)

    setTotalAmount(newTotal)
  }

  // Handle new customer submission
  const handleAddCustomer = () => {
    // Validate form
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Add customer
    const customer = addCustomer({
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      accountNumber: newCustomer.accountNumber || `CUST-${Math.floor(Math.random() * 10000)}`,
    })

    // Select the new customer
    setCustomerId(customer.id)
    setShowNewCustomer(false)

    toast({
      title: "Customer Added",
      description: `${customer.name} has been added successfully`,
    })
  }

  // Handle sale submission
  const handleSale = () => {
    // Validate form
    if (selectedMeters.length === 0) {
      toast({
        title: "No Meters Selected",
        description: "Please select at least one meter to sell",
        variant: "destructive",
      })
      return
    }

    if (!customerId) {
      toast({
        title: "No Customer Selected",
        description: "Please select a customer or create a new one",
        variant: "destructive",
      })
      return
    }

    // Record sale
    recordSale({
      date: new Date().toISOString().split("T")[0],
      meterIds: selectedMeters,
      customerId,
      totalAmount,
      paymentMethod,
      paymentStatus,
      notes,
      createdBy: "Admin User", // In a real app, this would be the logged-in user
    })

    // Reset form
    setSelectedMeters([])
    setCustomerId("")
    setPaymentMethod("cash")
    setPaymentStatus("paid")
    setTotalAmount(0)
    setNotes("")

    toast({
      title: "Sale Recorded",
      description: `${selectedMeters.length} meter(s) have been sold successfully`,
    })
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
      </div>

      <Tabs defaultValue="new-sale" className="mb-6">
        <TabsList>
          <TabsTrigger value="new-sale">New Sale</TabsTrigger>
          <TabsTrigger value="sales-history">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-sale" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meter Selection */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Select Meters</CardTitle>
                <CardDescription>Choose meters to sell to the customer</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search meters by number..." className="pl-8" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Meter Number</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Price (KES)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableMeters.length > 0 ? (
                        availableMeters.map((meter) => (
                          <TableRow key={meter.id} className={selectedMeters.includes(meter.id) ? "bg-muted/50" : ""}>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleMeterSelection(meter.id)}
                              >
                                {selectedMeters.includes(meter.id) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{meter.meterNumber}</TableCell>
                            <TableCell>{getProductName(meter.productId)}</TableCell>
                            <TableCell>{getProductPrice(meter.productId).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No meters available in stock
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedMeters.length} meter(s) selected</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</p>
                </div>
              </CardFooter>
            </Card>

            {/* Customer and Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Customer & Payment</CardTitle>
                <CardDescription>Enter customer and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <div className="flex gap-2">
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={showNewCustomer} onOpenChange={setShowNewCustomer}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Customer</DialogTitle>
                          <DialogDescription>Enter customer details to add them to your system</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newCustomer.email}
                              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={newCustomer.address}
                              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                            <Input
                              id="accountNumber"
                              value={newCustomer.accountNumber}
                              onChange={(e) => setNewCustomer({ ...newCustomer, accountNumber: e.target.value })}
                              placeholder="Auto-generated if left blank"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowNewCustomer(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCustomer}>Add Customer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-status">Payment Status</Label>
                  <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes about this sale"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSale} disabled={selectedMeters.length === 0 || !customerId}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Complete Sale
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales-history">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>View all past sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesTransactions.length > 0 ? (
                      salesTransactions.map((sale) => {
                        const customer = customers.find((c) => c.id === sale.customerId)
                        return (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{customer?.name || "Unknown"}</TableCell>
                            <TableCell>{sale.meterIds.length} meter(s)</TableCell>
                            <TableCell>KES {sale.totalAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  sale.paymentStatus === "paid"
                                    ? "success"
                                    : sale.paymentStatus === "partial"
                                      ? "warning"
                                      : "destructive"
                                }
                              >
                                {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No sales transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
