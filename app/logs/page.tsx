import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardCheckIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  AlertCircleIcon,
  UserIcon,
  BoxIcon,
  ShieldIcon,
  KeyIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  RefreshCwIcon,
  ServerIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample audit logs data
const auditLogs = [
  {
    id: "LOG001",
    timestamp: "2023-04-20 14:32:15",
    user: "Admin User",
    action: "Stock In",
    details: "Added 300 Single Phase Meters to Main Warehouse",
    ip: "192.168.1.45",
    module: "Inventory",
  },
  {
    id: "LOG002",
    timestamp: "2023-04-20 13:15:22",
    user: "Admin User",
    action: "User Update",
    details: "Updated permissions for user Sarah Kimani",
    ip: "192.168.1.45",
    module: "Users",
  },
  {
    id: "LOG003",
    timestamp: "2023-04-20 11:42:08",
    user: "John Mwangi",
    action: "Installation",
    details: "Recorded installation of meter M12345678",
    ip: "10.0.0.15",
    module: "Operations",
  },
  {
    id: "LOG004",
    timestamp: "2023-04-20 10:18:55",
    user: "Sarah Kimani",
    action: "Stock Out",
    details: "Allocated 20 Single Phase Meters to Sarah Kimani",
    ip: "10.0.0.22",
    module: "Inventory",
  },
  {
    id: "LOG005",
    timestamp: "2023-04-20 09:05:30",
    user: "System",
    action: "Backup",
    details: "Automated system backup completed successfully",
    ip: "127.0.0.1",
    module: "System",
  },
  {
    id: "LOG006",
    timestamp: "2023-04-19 16:48:12",
    user: "Admin User",
    action: "Purchase Order",
    details: "Created purchase order PO-12345",
    ip: "192.168.1.45",
    module: "Purchases",
  },
  {
    id: "LOG007",
    timestamp: "2023-04-19 15:22:40",
    user: "Michael Ochieng",
    action: "Return",
    details: "Processed return RET-1003 with 5 items",
    ip: "10.0.0.18",
    module: "Returns",
  },
  {
    id: "LOG008",
    timestamp: "2023-04-19 14:10:05",
    user: "System",
    action: "Alert",
    details: "Low stock alert triggered for Single Phase Meters",
    ip: "127.0.0.1",
    module: "Alerts",
  },
  {
    id: "LOG009",
    timestamp: "2023-04-19 11:35:18",
    user: "Emily Wanjiku",
    action: "Login",
    details: "User login from new device",
    ip: "10.0.0.30",
    module: "Security",
  },
  {
    id: "LOG010",
    timestamp: "2023-04-19 10:05:22",
    user: "Admin User",
    action: "Report",
    details: "Generated Monthly Inventory Summary report",
    ip: "192.168.1.45",
    module: "Reports",
  },
]

// Sample security logs data
const securityLogs = [
  {
    id: "SEC001",
    timestamp: "2023-04-20 08:30:15",
    user: "Admin User",
    action: "Login Success",
    details: "Login from recognized device",
    ip: "192.168.1.45",
    location: "Nairobi, Kenya",
  },
  {
    id: "SEC002",
    timestamp: "2023-04-20 09:15:22",
    user: "John Mwangi",
    action: "Login Success",
    details: "Login from mobile device",
    ip: "10.0.0.15",
    location: "Nairobi, Kenya",
  },
  {
    id: "SEC003",
    timestamp: "2023-04-20 07:42:08",
    user: "unknown",
    action: "Login Failed",
    details: "Invalid credentials (3 attempts)",
    ip: "45.123.45.67",
    location: "Lagos, Nigeria",
  },
  {
    id: "SEC004",
    timestamp: "2023-04-19 16:18:55",
    user: "Sarah Kimani",
    action: "Password Change",
    details: "User changed password",
    ip: "10.0.0.22",
    location: "Nairobi, Kenya",
  },
  {
    id: "SEC005",
    timestamp: "2023-04-19 14:05:30",
    user: "Admin User",
    action: "Permission Change",
    details: "Updated role permissions for 'Field Agents'",
    ip: "192.168.1.45",
    location: "Nairobi, Kenya",
  },
]

// Sample system logs data
const systemLogs = [
  {
    id: "SYS001",
    timestamp: "2023-04-20 00:00:15",
    level: "INFO",
    service: "Backup Service",
    message: "Daily backup completed successfully",
    details: "All database tables backed up to cloud storage",
  },
  {
    id: "SYS002",
    timestamp: "2023-04-19 23:15:22",
    level: "WARNING",
    service: "Database Service",
    message: "High database load detected",
    details: "CPU usage at 85% for more than 5 minutes",
  },
  {
    id: "SYS003",
    timestamp: "2023-04-19 22:42:08",
    level: "ERROR",
    service: "API Service",
    message: "API endpoint timeout",
    details: "External payment gateway connection timed out",
  },
  {
    id: "SYS004",
    timestamp: "2023-04-19 12:18:55",
    level: "INFO",
    service: "Scheduler",
    message: "Scheduled reports generated",
    details: "3 scheduled reports were generated and emailed",
  },
  {
    id: "SYS005",
    timestamp: "2023-04-19 06:05:30",
    level: "INFO",
    service: "System",
    message: "System update applied",
    details: "System updated to version 2.4.5",
  },
]

export default function LogsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit Logs & Security</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="audit" className="mb-6">
        <TabsList>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ClipboardCheckIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Audit Trail</CardTitle>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex gap-2">
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search logs..." className="pl-8 w-[200px] md:w-[250px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modules</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="purchases">Purchases</SelectItem>
                        <SelectItem value="returns">Returns</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Admin User</SelectItem>
                        <SelectItem value="john">John Mwangi</SelectItem>
                        <SelectItem value="sarah">Sarah Kimani</SelectItem>
                        <SelectItem value="michael">Michael Ochieng</SelectItem>
                        <SelectItem value="emily">Emily Wanjiku</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                    <TableHead>Module</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{log.details}</TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">{log.ip}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            log.module === "Security"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : log.module === "System"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : undefined
                          }
                        >
                          {log.module}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Security Logs</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search security logs..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="hidden lg:table-cell">IP Address</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.action === "Login Failed" || log.action.includes("Suspicious")
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{log.details}</TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">{log.ip}</TableCell>
                      <TableCell>{log.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">System Logs</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search system logs..." className="pl-8 w-[200px] md:w-[250px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">INFO</SelectItem>
                      <SelectItem value="warning">WARNING</SelectItem>
                      <SelectItem value="error">ERROR</SelectItem>
                      <SelectItem value="critical">CRITICAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Message</TableHead>
                    <TableHead className="hidden lg:table-cell">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.level === "ERROR" || log.level === "CRITICAL"
                              ? "destructive"
                              : log.level === "WARNING"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.service}</TableCell>
                      <TableCell className="hidden md:table-cell">{log.message}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs truncate">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">User Logins</span>
                </div>
                <span className="text-sm font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BoxIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Inventory Changes</span>
                </div>
                <span className="text-sm font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Security Events</span>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Permission Changes</span>
                </div>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Report Views</span>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Most active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@umskenya.com</p>
                  </div>
                </div>
                <span className="text-sm font-medium">42 actions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Kimani</p>
                    <p className="text-xs text-muted-foreground">sarah@umskenya.com</p>
                  </div>
                </div>
                <span className="text-sm font-medium">28 actions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Mwangi</p>
                    <p className="text-xs text-muted-foreground">john@umskenya.com</p>
                  </div>
                </div>
                <span className="text-sm font-medium">23 actions</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">API Services</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Storage</span>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Warning
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last Backup</span>
                </div>
                <span className="text-sm font-medium">Today, 00:00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Uptime</span>
                </div>
                <span className="text-sm font-medium">15 days, 4 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
