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
  WrenchIcon,
  ArrowLeftIcon,
  ClipboardCheckIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  DownloadIcon,
  UploadIcon,
  ClockIcon,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { StatCard } from "@/components/stat-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample returns data
const returns = [
  {
    id: "RET-1001",
    agent: "John Mwangi",
    date: "2023-04-18",
    items: 3,
    type: "Faulty",
    status: "Pending Inspection",
  },
  {
    id: "RET-1002",
    agent: "Sarah Kimani",
    date: "2023-04-17",
    items: 2,
    type: "Unused",
    status: "Inspected",
  },
  {
    id: "RET-1003",
    agent: "Michael Ochieng",
    date: "2023-04-15",
    items: 5,
    type: "Damaged",
    status: "Sent for Repair",
  },
  {
    id: "RET-1004",
    agent: "Emily Wanjiku",
    date: "2023-04-12",
    items: 1,
    type: "Faulty",
    status: "Repaired",
  },
  {
    id: "RET-1005",
    agent: "John Mwangi",
    date: "2023-04-10",
    items: 4,
    type: "Unused",
    status: "Returned to Stock",
  },
]

// Sample repairs data
const repairs = [
  {
    id: "REP-2001",
    item: "Single Phase Meter",
    serialNumber: "M12345678",
    issueDate: "2023-04-15",
    issue: "Display not working",
    status: "In Progress",
    technician: "James Omondi",
    priority: "High",
  },
  {
    id: "REP-2002",
    item: "Three Phase Meter",
    serialNumber: "M23456789",
    issueDate: "2023-04-14",
    issue: "Communication failure",
    status: "Completed",
    technician: "Peter Kamau",
    priority: "Medium",
  },
  {
    id: "REP-2003",
    item: "Single Phase Meter",
    serialNumber: "M34567890",
    issueDate: "2023-04-13",
    issue: "Tamper detection error",
    status: "Waiting for Parts",
    technician: "James Omondi",
    priority: "Medium",
  },
  {
    id: "REP-2004",
    item: "Smart Prepaid Meter",
    serialNumber: "M45678901",
    issueDate: "2023-04-10",
    issue: "Keypad not responding",
    status: "Completed",
    technician: "Peter Kamau",
    priority: "Low",
  },
]

// Sample return items for a detailed view
const returnItems = [
  {
    id: 1,
    product: "Single Phase Meter",
    serialNumber: "M12345678",
    condition: "Faulty",
    reason: "Display not working",
    action: "Repair",
  },
  {
    id: 2,
    product: "Connector Clamp",
    serialNumber: "C87654321",
    condition: "Damaged",
    reason: "Broken during installation",
    action: "Dispose",
  },
  {
    id: 3,
    product: "Sealing Kit",
    serialNumber: "S12345678",
    condition: "Unused",
    reason: "Not required",
    action: "Return to Stock",
  },
]

export default function ReturnsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Returns & Repairs</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Process Return
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Process Return</DialogTitle>
                <DialogDescription>Record returned items from agents or customers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="return-id">Return ID</Label>
                    <Input id="return-id" placeholder="Auto-generated" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return-date">Date</Label>
                    <Input id="return-date" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent">Returned By</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="return-type">Return Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faulty">Faulty</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="unused">Unused</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Return Items</Label>
                  <Card>
                    <CardContent className="p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Reason</TableHead>
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
                              <Input placeholder="Serial #" className="w-28" />
                            </TableCell>
                            <TableCell>
                              <Select>
                                <SelectTrigger className="w-28">
                                  <SelectValue placeholder="Condition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="faulty">Faulty</SelectItem>
                                  <SelectItem value="damaged">Damaged</SelectItem>
                                  <SelectItem value="unused">Unused</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input placeholder="Reason" className="w-full" />
                            </TableCell>
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
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes about this return" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit Return</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <WrenchIcon className="h-4 w-4 mr-2" />
                Create Repair Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Repair Job</DialogTitle>
                <DialogDescription>Log a new repair request for faulty equipment</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repair-id">Repair ID</Label>
                    <Input id="repair-id" placeholder="Auto-generated" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input id="issue-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p001">Single Phase Meter (M12345678)</SelectItem>
                      <SelectItem value="p002">Three Phase Meter (M23456789)</SelectItem>
                      <SelectItem value="p003">Smart Prepaid Meter (M45678901)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="technician">Assign Technician</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t001">James Omondi</SelectItem>
                        <SelectItem value="t002">Peter Kamau</SelectItem>
                        <SelectItem value="t003">Lucy Njeri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Description</Label>
                  <Textarea id="issue" placeholder="Describe the issue in detail" />
                </div>
                <div className="space-y-2">
                  <Label>Required Parts</Label>
                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="part1" />
                          <Label htmlFor="part1" className="text-sm">
                            LCD Display
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="part2" />
                          <Label htmlFor="part2" className="text-sm">
                            Circuit Board
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="part3" />
                          <Label htmlFor="part3" className="text-sm">
                            Battery
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="part4" />
                          <Label htmlFor="part4" className="text-sm">
                            Casing
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Repair Job</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Pending Returns"
          value="12"
          description="Awaiting inspection"
          icon={<ArrowLeftIcon className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="3 more than last week"
        />
        <StatCard
          title="Active Repairs"
          value="8"
          description="Currently being fixed"
          icon={<WrenchIcon className="h-4 w-4 text-muted-foreground" />}
          trend="down"
          trendValue="2 less than last week"
        />
        <StatCard
          title="Completed This Month"
          value="24"
          description="Successfully processed"
          icon={<CheckCircleIcon className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          trendValue="15% from last month"
        />
        <StatCard
          title="Warranty Claims"
          value="5"
          description="Pending with suppliers"
          icon={<ClipboardCheckIcon className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          trendValue="Same as last month"
        />
      </div>

      <Tabs defaultValue="returns" className="mb-6">
        <TabsList>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="repairs">Repairs</TabsTrigger>
          <TabsTrigger value="warranty">Warranty Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Returns Management</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search returns..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Return ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.agent}</TableCell>
                      <TableCell className="hidden md:table-cell">{returnItem.date}</TableCell>
                      <TableCell>{returnItem.items}</TableCell>
                      <TableCell className="hidden md:table-cell">{returnItem.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            returnItem.status === "Returned to Stock"
                              ? "outline"
                              : returnItem.status === "Sent for Repair"
                                ? "secondary"
                                : returnItem.status === "Repaired"
                                  ? "default"
                                  : "destructive"
                          }
                        >
                          {returnItem.status}
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
                            <DropdownMenuItem>Edit Return</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Process Inspection</DropdownMenuItem>
                            <DropdownMenuItem>Create Repair Job</DropdownMenuItem>
                            <DropdownMenuItem>Return to Stock</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Print Return Form</DropdownMenuItem>
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
              <div className="hidden">Trigger for Return Details Dialog</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Return Details</DialogTitle>
                <DialogDescription>RET-1001 | John Mwangi</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">2023-04-18</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="destructive">Pending Inspection</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">Faulty</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processed By</p>
                    <p className="font-medium">Admin User</p>
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.condition}</TableCell>
                          <TableCell>{item.reason}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.action}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <Label>Inspection Results</Label>
                  <RadioGroup defaultValue="pending" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="return" id="return" />
                      <Label htmlFor="return">Return to Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="repair" id="repair" />
                      <Label htmlFor="repair">Send for Repair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dispose" id="dispose" />
                      <Label htmlFor="dispose">Dispose</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warranty" id="warranty" />
                      <Label htmlFor="warranty">Warranty Claim</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspection-notes">Inspection Notes</Label>
                  <Textarea id="inspection-notes" placeholder="Add notes about the inspection results" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Print Form
                </Button>
                <Button>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Complete Inspection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="repairs" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Repair Jobs</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search repairs..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Repair ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="hidden md:table-cell">Serial Number</TableHead>
                    <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">{repair.id}</TableCell>
                      <TableCell>{repair.item}</TableCell>
                      <TableCell className="hidden md:table-cell">{repair.serialNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">{repair.issueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            repair.status === "Completed"
                              ? "outline"
                              : repair.status === "In Progress"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {repair.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            repair.priority === "High"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : repair.priority === "Medium"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {repair.priority}
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
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Add Parts</DropdownMenuItem>
                            <DropdownMenuItem>Log Work</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
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
              <div className="hidden">Trigger for Repair Details Dialog</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Repair Job Details</DialogTitle>
                <DialogDescription>REP-2001 | Single Phase Meter</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Serial Number</p>
                    <p className="font-medium">M12345678</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                      High
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technician</p>
                    <p className="font-medium">James Omondi</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issue Description</p>
                  <p className="text-sm">
                    Display not working. Unit powers on but LCD screen remains blank. Buttons appear to be functional
                    based on beep response.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Repair Progress</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Diagnostic Complete</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2023-04-16</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Parts Ordered</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2023-04-17</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Repair In Progress</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2023-04-18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Testing</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Parts Used</Label>
                  <Card>
                    <CardContent className="p-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Part</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>LCD Display</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>KES 1,200</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Ribbon Cable</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>KES 350</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-status">Update Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="waiting">Waiting for Parts</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work-notes">Work Notes</Label>
                  <Textarea id="work-notes" placeholder="Add notes about the repair work" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Print Job Card
                </Button>
                <Button>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Update Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Warranty Claims</CardTitle>
              <CardDescription>Track and manage warranty claims with suppliers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    All
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Pending
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Approved
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    Rejected
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search claims..." className="pl-8 h-8 text-sm" />
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
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden md:table-cell">Serial Number</TableHead>
                      <TableHead className="hidden md:table-cell">Supplier</TableHead>
                      <TableHead>Date Filed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">WC-1001</TableCell>
                      <TableCell>Single Phase Meter</TableCell>
                      <TableCell className="hidden md:table-cell">M12345678</TableCell>
                      <TableCell className="hidden md:table-cell">ABC Electronics Ltd</TableCell>
                      <TableCell>2023-04-15</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">WC-1002</TableCell>
                      <TableCell>Three Phase Meter</TableCell>
                      <TableCell className="hidden md:table-cell">M23456789</TableCell>
                      <TableCell className="hidden md:table-cell">XYZ Meters Inc</TableCell>
                      <TableCell>2023-04-12</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">WC-1003</TableCell>
                      <TableCell>Smart Prepaid Meter</TableCell>
                      <TableCell className="hidden md:table-cell">M45678901</TableCell>
                      <TableCell className="hidden md:table-cell">Global Meter Solutions</TableCell>
                      <TableCell>2023-04-10</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Rejected</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Warranty Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Return Reasons</CardTitle>
            <CardDescription>Top reasons for returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Faulty Display</span>
                </div>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Communication Error</span>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Physical Damage</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Battery Issues</span>
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Other</span>
                </div>
                <span className="text-sm font-medium">11%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "32%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repair Turnaround</CardTitle>
            <CardDescription>Average time to complete repairs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Average Repair Time</span>
                </div>
                <span className="text-sm font-medium">3.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Fastest Repair</span>
                </div>
                <span className="text-sm font-medium">Same day</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Longest Repair</span>
                </div>
                <span className="text-sm font-medium">12 days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Top Technician</span>
                </div>
                <span className="text-sm font-medium">James Omondi</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Control</CardTitle>
            <CardDescription>Post-repair verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Meter M23456789</span> passed final testing
                  </p>
                  <p className="text-xs text-muted-foreground">Today, 10:45</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Meter M34567890</span> failed communication test
                  </p>
                  <p className="text-xs text-muted-foreground">Today, 09:30</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Meter M45678901</span> passed final testing
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday, 16:15</p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Test Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
