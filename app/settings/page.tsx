import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  UserIcon,
  BuildingIcon,
  SettingsIcon,
  BellIcon,
  KeyIcon,
  DatabaseIcon,
  CloudIcon,
  ShieldIcon,
  UsersIcon,
  PlusIcon,
  SaveIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import type { Metadata } from "next"
import { ClearDataButton } from "./clear-data-button"

export const metadata: Metadata = {
  title: "Settings",
  description: "System settings and configuration",
}

// Sample users data
const users = [
  {
    id: "U001",
    name: "Admin User",
    email: "admin@umskenya.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2023-04-20 14:32",
  },
  {
    id: "U002",
    name: "John Mwangi",
    email: "john@umskenya.com",
    role: "Field Agent",
    status: "Active",
    lastLogin: "2023-04-20 11:45",
  },
  {
    id: "U003",
    name: "Sarah Kimani",
    email: "sarah@umskenya.com",
    role: "Field Agent",
    status: "Active",
    lastLogin: "2023-04-20 10:15",
  },
  {
    id: "U004",
    name: "Michael Ochieng",
    email: "michael@umskenya.com",
    role: "Field Agent",
    status: "Active",
    lastLogin: "2023-04-19 16:22",
  },
  {
    id: "U005",
    name: "Emily Wanjiku",
    email: "emily@umskenya.com",
    role: "Field Agent",
    status: "Active",
    lastLogin: "2023-04-19 15:10",
  },
  {
    id: "U006",
    name: "David Kamau",
    email: "david@umskenya.com",
    role: "Field Agent",
    status: "Inactive",
    lastLogin: "2023-04-10 09:45",
  },
  {
    id: "U007",
    name: "James Omondi",
    email: "james@umskenya.com",
    role: "Technician",
    status: "Active",
    lastLogin: "2023-04-20 08:30",
  },
  {
    id: "U008",
    name: "Peter Kamau",
    email: "peter@umskenya.com",
    role: "Technician",
    status: "Active",
    lastLogin: "2023-04-19 14:15",
  },
]

// Sample roles data
const roles = [
  {
    id: "R001",
    name: "Administrator",
    users: 1,
    permissions: "Full system access",
    description: "Complete control over all system functions",
  },
  {
    id: "R002",
    name: "Manager",
    users: 2,
    permissions: "Limited administrative access",
    description: "Can manage inventory, users, and view reports",
  },
  {
    id: "R003",
    name: "Field Agent",
    users: 5,
    permissions: "Field operations access",
    description: "Can manage assigned inventory and record installations",
  },
  {
    id: "R004",
    name: "Technician",
    users: 2,
    permissions: "Repair access",
    description: "Can manage repairs and maintenance tasks",
  },
  {
    id: "R005",
    name: "Warehouse Staff",
    users: 3,
    permissions: "Inventory access",
    description: "Can manage warehouse inventory and stock movements",
  },
]

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="flex flex-col py-2 h-auto">
            <UserIcon className="h-4 w-4 mb-1" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex flex-col py-2 h-auto">
            <BuildingIcon className="h-4 w-4 mb-1" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col py-2 h-auto">
            <UsersIcon className="h-4 w-4 mb-1" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col py-2 h-auto">
            <BellIcon className="h-4 w-4 mb-1" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col py-2 h-auto">
            <ShieldIcon className="h-4 w-4 mb-1" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex flex-col py-2 h-auto">
            <SettingsIcon className="h-4 w-4 mb-1" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Your email" defaultValue="admin@umskenya.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Your phone number" defaultValue="+254 712 345 678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" placeholder="Your job title" defaultValue="System Administrator" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="africa-nairobi">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa-nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="yyyy-mm-dd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="Company name" defaultValue="UMS Kenya" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea
                    id="company-address"
                    placeholder="Company address"
                    defaultValue="123 Business Park, Nairobi, Kenya"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input id="company-phone" placeholder="Company phone" defaultValue="+254 20 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input id="company-email" placeholder="Company email" defaultValue="info@umskenya.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input id="company-website" placeholder="Company website" defaultValue="www.umskenya.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID / Registration Number</Label>
                  <Input id="tax-id" placeholder="Tax ID" defaultValue="KE123456789T" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Company Info
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure business-specific settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                  <Select defaultValue="january">
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="kes">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kes">Kenyan Shilling (KES)</SelectItem>
                      <SelectItem value="usd">US Dollar (USD)</SelectItem>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="16" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-numbering">Automatic Numbering</Label>
                    <p className="text-sm text-muted-foreground">Auto-generate reference numbers</p>
                  </div>
                  <Switch id="auto-numbering" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-approval">Require Approvals</Label>
                    <p className="text-sm text-muted-foreground">For purchases above threshold</p>
                  </div>
                  <Switch id="require-approval" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Business Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and permissions</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-name">Full Name</Label>
                          <Input id="new-name" placeholder="Full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-email">Email</Label>
                          <Input id="new-email" type="email" placeholder="Email address" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-phone">Phone</Label>
                          <Input id="new-phone" placeholder="Phone number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-role">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="agent">Field Agent</SelectItem>
                              <SelectItem value="technician">Technician</SelectItem>
                              <SelectItem value="warehouse">Warehouse Staff</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Temporary Password</Label>
                        <Input id="new-password" type="password" placeholder="Set a temporary password" />
                        <p className="text-xs text-muted-foreground">
                          User will be prompted to change password on first login
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="send-invite" defaultChecked />
                        <Label htmlFor="send-invite">Send email invitation</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Login</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "outline" : "secondary"}
                            className={
                              user.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : undefined
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <SettingsIcon className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                {user.status === "Active" ? "Deactivate User" : "Activate User"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage user roles and access levels</CardDescription>
                </div>
                <Button variant="outline">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="hidden md:table-cell">Permissions</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell className="hidden md:table-cell">{role.permissions}</TableCell>
                        <TableCell className="hidden md:table-cell">{role.description}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <SettingsIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Low stock and inventory changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Activity</Label>
                      <p className="text-sm text-muted-foreground">Login and security events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reports</Label>
                      <p className="text-sm text-muted-foreground">Scheduled and generated reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">System maintenance and updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Low stock and inventory changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">When tasks are assigned to you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Approvals</Label>
                      <p className="text-sm text-muted-foreground">Pending approvals and requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Notifications</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">Emergency and critical notifications</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Suspicious login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Password Requirements:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      Minimum 8 characters
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      At least one number
                    </li>
                    <li className="flex items-center">
                      <XIcon className="h-4 w-4 mr-2 text-red-500" />
                      At least one special character
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
                <div className="space-y-2">
                  <Label>Authentication Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="auth-app" name="auth-method" className="h-4 w-4" />
                      <Label htmlFor="auth-app" className="text-sm">
                        Authenticator App
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="auth-sms" name="auth-method" className="h-4 w-4" />
                      <Label htmlFor="auth-sms" className="text-sm">
                        SMS Authentication
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="auth-email" name="auth-method" className="h-4 w-4" />
                      <Label htmlFor="auth-email" className="text-sm">
                        Email Authentication
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Recovery Options</Label>
                  <p className="text-sm text-muted-foreground">
                    Set up recovery methods in case you lose access to your account
                  </p>
                  <Button variant="outline" className="mt-2">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Generate Recovery Codes
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>View details about the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Operating System</Label>
                  <Input id="os" type="text" readOnly defaultValue="Linux" />
                </div>
                <div className="space-y-2">
                  <Label>Database</Label>
                  <Input id="db" type="text" readOnly defaultValue="PostgreSQL" />
                </div>
                <div className="space-y-2">
                  <Label>Server Version</Label>
                  <Input id="version" type="text" readOnly defaultValue="1.0.0" />
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input id="api" type="text" readOnly defaultValue="https://api.umskenya.com" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-level">Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable maintenance mode</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable debug mode</p>
                  </div>
                  <Switch id="debug-mode" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <CloudIcon className="h-4 w-4 mr-2" />
                  Apply Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="mt-6">
            <ClearDataButton />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
