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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3Icon,
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  LineChartIcon,
  MailIcon,
  PieChartIcon,
  PlusIcon,
  SearchIcon,
  Share2Icon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BoxIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample reports data
const reports = [
  {
    id: "REP001",
    name: "Monthly Inventory Summary",
    category: "Inventory",
    lastRun: "2023-04-20",
    frequency: "Monthly",
    format: "PDF",
  },
  {
    id: "REP002",
    name: "Agent Performance Report",
    category: "Agents",
    lastRun: "2023-04-19",
    frequency: "Weekly",
    format: "Excel",
  },
  {
    id: "REP003",
    name: "Stock Movement Analysis",
    category: "Inventory",
    lastRun: "2023-04-18",
    frequency: "Weekly",
    format: "PDF",
  },
  {
    id: "REP004",
    name: "Installation Metrics",
    category: "Operations",
    lastRun: "2023-04-15",
    frequency: "Daily",
    format: "Excel",
  },
  {
    id: "REP005",
    name: "Repair Turnaround Time",
    category: "Repairs",
    lastRun: "2023-04-14",
    frequency: "Monthly",
    format: "PDF",
  },
]

// Sample scheduled reports
const scheduledReports = [
  {
    id: "SCH001",
    report: "Monthly Inventory Summary",
    recipients: "management@umskenya.com",
    schedule: "1st of every month",
    nextRun: "2023-05-01",
    status: "Active",
  },
  {
    id: "SCH002",
    report: "Agent Performance Report",
    recipients: "field-managers@umskenya.com",
    schedule: "Every Monday",
    nextRun: "2023-04-24",
    status: "Active",
  },
  {
    id: "SCH003",
    report: "Stock Movement Analysis",
    recipients: "inventory@umskenya.com",
    schedule: "Every Friday",
    nextRun: "2023-04-21",
    status: "Paused",
  },
]

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate Report</DialogTitle>
                <DialogDescription>Create a new report from available templates</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="agent">Agent Performance</SelectItem>
                      <SelectItem value="stock">Stock Movement</SelectItem>
                      <SelectItem value="installation">Installation Metrics</SelectItem>
                      <SelectItem value="repair">Repair Analysis</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">Date From</Label>
                    <Input id="date-from" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">Date To</Label>
                    <Input id="date-to" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Report Parameters</Label>
                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="param1" />
                          <Label htmlFor="param1" className="text-sm">
                            Include charts and graphs
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="param2" />
                          <Label htmlFor="param2" className="text-sm">
                            Include detailed data tables
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="param3" />
                          <Label htmlFor="param3" className="text-sm">
                            Include trend analysis
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="param4" />
                          <Label htmlFor="param4" className="text-sm">
                            Include executive summary
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery">Delivery Method</Label>
                    <RadioGroup defaultValue="download">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="download" id="download" />
                        <Label htmlFor="download" className="text-sm">
                          Download
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="text-sm">
                          Email
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Generate Report</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClockIcon className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule Report</DialogTitle>
                <DialogDescription>Set up automated report generation and delivery</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="report-template">Report Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report" />
                    </SelectTrigger>
                    <SelectContent>
                      {reports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input id="recipients" placeholder="Email addresses (comma separated)" />
                  <p className="text-xs text-muted-foreground">Enter email addresses separated by commas</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-charts" defaultChecked />
                    <Label htmlFor="include-charts" className="text-sm">
                      Include charts and graphs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="attach-raw-data" />
                    <Label htmlFor="attach-raw-data" className="text-sm">
                      Attach raw data files
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Schedule Report</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 21.5M</div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">4.3%</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Installations This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">12.8%</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agent Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">2.1%</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="mt-2 flex items-center text-xs">
              <ArrowDownIcon className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">0.5%</span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="mb-6">
        <TabsList>
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Available Reports</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search reports..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">Last Run</TableHead>
                    <TableHead className="hidden md:table-cell">Frequency</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{report.lastRun}</TableCell>
                      <TableCell className="hidden md:table-cell">{report.frequency}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search schedules..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Report</TableHead>
                    <TableHead className="hidden md:table-cell">Recipients</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="hidden md:table-cell">Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.report}</TableCell>
                      <TableCell className="hidden md:table-cell">{schedule.recipients}</TableCell>
                      <TableCell>{schedule.schedule}</TableCell>
                      <TableCell className="hidden md:table-cell">{schedule.nextRun}</TableCell>
                      <TableCell>
                        <Badge
                          variant={schedule.status === "Active" ? "outline" : "secondary"}
                          className={
                            schedule.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : undefined
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <MailIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ClockIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Metrics</CardTitle>
                <CardDescription>Stock levels and movement trends</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3Icon className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Inventory metrics dashboard would appear here</p>
                  <Button variant="outline">View Full Dashboard</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Installation and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <LineChartIcon className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Agent performance dashboard would appear here</p>
                  <Button variant="outline">View Full Dashboard</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Operations Overview</CardTitle>
                <CardDescription>Key operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <PieChartIcon className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Operations dashboard would appear here</p>
                  <Button variant="outline">View Full Dashboard</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
                <CardDescription>Cost and value analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
                  <TrendingUpIcon className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Financial metrics dashboard would appear here</p>
                  <Button variant="outline">View Full Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Trends</CardTitle>
            <CardDescription>Stock level changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Single Phase Meters</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Three Phase Meters</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">-8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Connector Clamps</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">+24%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Service Cables</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">-5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sealing Kits</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agent Metrics</CardTitle>
            <CardDescription>Performance by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sarah Kimani</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">52 installations</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">John Mwangi</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">48 installations</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Emily Wanjiku</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">42 installations</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Michael Ochieng</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">35 installations</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">David Kamau</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">12 installations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Repair Statistics</CardTitle>
            <CardDescription>Repair metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Average Repair Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">3.2 days</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Repair Success Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Most Common Issue</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Display Failure</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Repairs This Month</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">24</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Pending Repairs</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
