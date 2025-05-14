import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  UserIcon,
  ClipboardIcon,
  UserPlusIcon,
  ArrowRightIcon,
  PhoneIcon,
  MapPinIcon,
  MailIcon,
  TruckIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Sample agents data
const agents = [
  {
    id: "A001",
    name: "John Mwangi",
    phone: "+254 712 345 678",
    region: "Nairobi Central",
    status: "Active",
    totalAllocated: 48,
    pendingReturns: 5,
    installationsThisMonth: 43,
    lastActivity: "2023-04-20",
  },
  {
    id: "A002",
    name: "Sarah Kimani",
    phone: "+254 723 456 789",
    region: "Nairobi East",
    status: "Active",
    totalAllocated: 52,
    pendingReturns: 2,
    installationsThisMonth: 50,
    lastActivity: "2023-04-20",
  },
  {
    id: "A003",
    name: "Michael Ochieng",
    phone: "+254 734 567 890",
    region: "Kiambu",
    status: "Active",
    totalAllocated: 35,
    pendingReturns: 8,
    installationsThisMonth: 27,
    lastActivity: "2023-04-18",
  },
  {
    id: "A004",
    name: "Emily Wanjiku",
    phone: "+254 745 678 901",
    region: "Nakuru",
    status: "Active",
    totalAllocated: 42,
    pendingReturns: 0,
    installationsThisMonth: 38,
    lastActivity: "2023-04-19",
  },
  {
    id: "A005",
    name: "David Kamau",
    phone: "+254 756 789 012",
    region: "Nairobi West",
    status: "Inactive",
    totalAllocated: 0,
    pendingReturns: 5,
    installationsThisMonth: 12,
    lastActivity: "2023-04-10",
  },
]

// Sample inventory allocation data
const allocations = [
  {
    id: "AL001",
    agent: "Sarah Kimani",
    product: "Single Phase Meter",
    quantity: 20,
    dateAllocated: "2023-04-15",
    status: "Active",
    allocatedBy: "Admin User",
  },
  {
    id: "AL002",
    agent: "John Mwangi",
    product: "Single Phase Meter",
    quantity: 15,
    dateAllocated: "2023-04-15",
    status: "Active",
    allocatedBy: "Admin User",
  },
  {
    id: "AL003",
    agent: "Michael Ochieng",
    product: "Single Phase Meter",
    quantity: 10,
    dateAllocated: "2023-04-16",
    status: "Active",
    allocatedBy: "Admin User",
  },
  {
    id: "AL004",
    agent: "Sarah Kimani",
    product: "Connector Clamp",
    quantity: 30,
    dateAllocated: "2023-04-16",
    status: "Active",
    allocatedBy: "Admin User",
  },
  {
    id: "AL005",
    agent: "John Mwangi",
    product: "Sealing Kit",
    quantity: 15,
    dateAllocated: "2023-04-17",
    status: "Active",
    allocatedBy: "Admin User",
  },
]

export default function AgentsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
                <DialogDescription>Add a new field agent to the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="e.g. John Mwangi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="e.g. +254 712 345 678" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="e.g. john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input id="id-number" placeholder="National ID" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Area</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi-central">Nairobi Central</SelectItem>
                        <SelectItem value="nairobi-east">Nairobi East</SelectItem>
                        <SelectItem value="nairobi-west">Nairobi West</SelectItem>
                        <SelectItem value="kiambu">Kiambu</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Agent Role</Label>
                    <Select defaultValue="installer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="installer">Installer</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="verification">Verification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Textarea id="address" placeholder="Agent's physical address" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Agent</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClipboardIcon className="h-4 w-4 mr-2" />
                Allocate Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Allocate Stock to Agent</DialogTitle>
                <DialogDescription>Assign inventory items to an agent for field installation</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="agent">Select Agent</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a001">John Mwangi</SelectItem>
                      <SelectItem value="a002">Sarah Kimani</SelectItem>
                      <SelectItem value="a003">Michael Ochieng</SelectItem>
                      <SelectItem value="a004">Emily Wanjiku</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label>Inventory Items</Label>
                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-6">
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
                          <div className="col-span-4">
                            <Input type="number" placeholder="Quantity" min="1" />
                          </div>
                          <div className="col-span-2">
                            <Button variant="ghost" size="icon">
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Allocation Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes about this allocation" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Allocate Stock</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="agents" className="mb-6">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="installations">Installations</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Agent Directory</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search agents..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead className="hidden md:table-cell">Region</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Pending Returns</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{agent.region}</TableCell>
                      <TableCell className="hidden md:table-cell">{agent.phone}</TableCell>
                      <TableCell>{agent.totalAllocated}</TableCell>
                      <TableCell>
                        {agent.pendingReturns}
                        {agent.pendingReturns > 0 && (
                          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                            {agent.pendingReturns} due
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={agent.status === "Active" ? "outline" : "secondary"}>{agent.status}</Badge>
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
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Allocate Stock</DropdownMenuItem>
                            <DropdownMenuItem>View Allocations</DropdownMenuItem>
                            <DropdownMenuItem>Installation History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Deactivate Agent</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>5</strong> of <strong>12</strong> agents
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ClipboardIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Stock Allocations</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search allocations..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell>{allocation.id}</TableCell>
                      <TableCell className="font-medium">{allocation.agent}</TableCell>
                      <TableCell>{allocation.product}</TableCell>
                      <TableCell>{allocation.quantity}</TableCell>
                      <TableCell className="hidden md:table-cell">{allocation.dateAllocated}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{allocation.status}</Badge>
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
                            <DropdownMenuItem>Edit Allocation</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Process Returns</DropdownMenuItem>
                            <DropdownMenuItem>Track Installations</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancel Allocation</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>5</strong> of <strong>24</strong> allocations
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="installations" className="mt-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <UserPlusIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Installations Tab</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                This section would display installations performed by agents, including customer details, meter
                information, and installation status.
              </p>
              <Button asChild>
                <Link href="/scanning">
                  Go to Meter Scanning
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="returns" className="mt-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <TruckIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Returns Tab</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                This section would display meters and equipment returned by agents, including return status, condition
                reporting, and verification status.
              </p>
              <Button asChild>
                <Link href="/returns">
                  Go to Returns & Repairs
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Top performing agents this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents
                .filter((agent) => agent.status === "Active")
                .sort((a, b) => b.installationsThisMonth - a.installationsThisMonth)
                .slice(0, 3)
                .map((agent, index) => (
                  <div key={agent.id} className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{agent.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPinIcon className="mr-1 h-3 w-3" />
                        {agent.region}
                      </div>
                      <div className="flex">
                        <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                          {agent.installationsThisMonth} installations
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Contact</CardTitle>
            <CardDescription>Reach out to your field agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents
                .filter((agent) => agent.status === "Active")
                .slice(0, 4)
                .map((agent) => (
                  <div key={agent.id} className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.region}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PhoneIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MailIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Agent stock utilization</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center text-muted-foreground">
              <ClipboardIcon className="h-10 w-10 mx-auto mb-2" />
              <p>Utilization chart would appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
