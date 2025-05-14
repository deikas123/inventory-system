"use client"

import { useState } from "react"
import DashboardShell from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  ScanIcon,
  CameraIcon,
  CheckCircleIcon,
  CheckIcon,
  XIcon,
  LoaderIcon,
  ClockIcon,
  SearchIcon,
  Clock4Icon,
  FilterIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  UploadIcon,
  ShieldIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

// Sample installation records
const installationRecords = [
  {
    id: "INS001",
    meterNumber: "M12345678",
    customer: "James Kamau",
    location: "Nairobi South",
    agent: "Sarah Kimani",
    installDate: "2023-04-20",
    status: "Verified",
  },
  {
    id: "INS002",
    meterNumber: "M23456789",
    customer: "Lucy Waithera",
    location: "Kiambu Road",
    agent: "John Mwangi",
    installDate: "2023-04-20",
    status: "Pending Verification",
  },
  {
    id: "INS003",
    meterNumber: "M34567890",
    customer: "Michael Otieno",
    location: "Ngong Road",
    agent: "Michael Ochieng",
    installDate: "2023-04-19",
    status: "Verified",
  },
  {
    id: "INS004",
    meterNumber: "M45678901",
    customer: "Anne Njeri",
    location: "Westlands",
    agent: "Sarah Kimani",
    installDate: "2023-04-19",
    status: "Verified",
  },
  {
    id: "INS005",
    meterNumber: "M56789012",
    customer: "Peter Waweru",
    location: "Thika Road",
    agent: "Emily Wanjiku",
    installDate: "2023-04-18",
    status: "Failed Verification",
  },
]

export default function ScanningPage() {
  const [scanMode, setScanMode] = useState<"manual" | "camera">("manual")
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [meterNumber, setMeterNumber] = useState("")
  const { toast } = useToast()

  const handleScan = () => {
    if (!meterNumber && scanMode === "manual") {
      toast({
        title: "Error",
        description: "Please enter a meter number",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setScanSuccess(true)

      if (scanMode === "camera") {
        setMeterNumber("M99887766")
      }

      toast({
        title: "Meter Scanned Successfully",
        description: `Meter ${meterNumber} has been scanned`,
      })
    }, 2000)
  }

  const resetScan = () => {
    setScanSuccess(false)
    setMeterNumber("")
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meter Scanning & Installation</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            Sync Offline Data
          </Button>
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scan" className="mb-6">
        <TabsList>
          <TabsTrigger value="scan">Scan & Install</TabsTrigger>
          <TabsTrigger value="history">Installation History</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Meter Scanning</CardTitle>
                <CardDescription>Scan a meter to proceed with installation</CardDescription>
              </CardHeader>
              <CardContent>
                {!scanSuccess ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={scanMode === "manual" ? "default" : "outline"}
                        onClick={() => setScanMode("manual")}
                        className="flex-1"
                      >
                        Manual Entry
                      </Button>
                      <Button
                        variant={scanMode === "camera" ? "default" : "outline"}
                        onClick={() => setScanMode("camera")}
                        className="flex-1"
                      >
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Camera Scan
                      </Button>
                    </div>

                    {scanMode === "manual" ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="meter-number">Meter Number</Label>
                          <Input
                            id="meter-number"
                            placeholder="Enter meter serial number"
                            value={meterNumber}
                            onChange={(e) => setMeterNumber(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleScan} className="w-full" disabled={isScanning}>
                          {isScanning ? (
                            <>
                              <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <ScanIcon className="h-4 w-4 mr-2" />
                              Scan Meter
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-md p-4 aspect-video flex flex-col items-center justify-center bg-muted/50">
                          <CameraIcon className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-4">Camera scan would activate here</p>
                          <Button onClick={handleScan} disabled={isScanning}>
                            {isScanning ? (
                              <>
                                <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                                Scanning...
                              </>
                            ) : (
                              <>
                                <ScanIcon className="h-4 w-4 mr-2" />
                                Start Scanning
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Position the meter barcode or QR code in the center of the camera
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4 flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-2">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Meter Scanned Successfully</h3>
                      <p className="text-sm text-muted-foreground mb-3">Ready to proceed with installation</p>
                      <div className="bg-muted p-3 rounded-md w-full text-center mb-2">
                        <span className="font-mono font-medium text-lg">{meterNumber}</span>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" onClick={resetScan} className="flex-1">
                          <XIcon className="h-4 w-4 mr-2" />
                          Rescan
                        </Button>
                        <Button className="flex-1">
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Installation Details</CardTitle>
                <CardDescription>Record meter installation information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name</Label>
                    <Input id="customer-name" placeholder="Full name of customer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-id">Customer ID/Account Number</Label>
                    <Input id="customer-id" placeholder="Customer identification" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meter-type">Meter Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-phase">Single Phase</SelectItem>
                          <SelectItem value="three-phase">Three Phase</SelectItem>
                          <SelectItem value="prepaid">Prepaid</SelectItem>
                          <SelectItem value="smart">Smart Meter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="installation-date">Date</Label>
                      <Input type="date" id="installation-date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Installation Location</Label>
                    <div className="flex gap-2">
                      <Input id="location" placeholder="Physical address" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <ScanIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">GPS coordinates will be captured automatically</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Installation Notes</Label>
                    <Textarea id="notes" placeholder="Any additional notes or observations" />
                  </div>
                  <div className="space-y-2">
                    <Label>Installation Photo</Label>
                    <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center bg-muted/50 h-32">
                      <CameraIcon className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground">Take or upload installation photo</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="offline-mode" />
                    <Label htmlFor="offline-mode">Save for offline submission</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Submit Installation</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Installation Records</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search records..." className="pl-8 w-[200px] md:w-[250px]" />
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
                    <TableHead>Meter #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden md:table-cell">Agent</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installationRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.meterNumber}</TableCell>
                      <TableCell>{record.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.location}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.agent}</TableCell>
                      <TableCell>{record.installDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Verified"
                              ? "outline"
                              : record.status === "Pending Verification"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {record.status}
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
                            <DropdownMenuItem>Edit Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Verify Installation</DropdownMenuItem>
                            <DropdownMenuItem>Download Certificate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Flag as Problem</DropdownMenuItem>
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
                Showing <strong>5</strong> of <strong>25</strong> records
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
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Installation verification metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Verified</span>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Failed</span>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Goal: 95% verification rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest installation actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <Clock4Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Sarah Kimani</span> installed meter{" "}
                    <span className="font-mono text-xs">M12345678</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Today, 14:32</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Admin User</span> verified meter{" "}
                    <span className="font-mono text-xs">M34567890</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Today, 13:15</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <ClockIcon className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">John Mwangi</span> installed meter{" "}
                    <span className="font-mono text-xs">M23456789</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Today, 11:47</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <XIcon className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Verification Team</span> failed meter{" "}
                    <span className="font-mono text-xs">M56789012</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday, 16:20</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Mobile app synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Online Mode Active</p>
                  <p className="text-xs text-muted-foreground">Real-time synchronization</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Sync</p>
                  <p className="text-sm font-medium">5 minutes ago</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Pending Uploads</p>
                  <p className="text-sm font-medium">0</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Connection Quality</p>
                  <p className="text-sm font-medium">Excellent</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Offline Cache</p>
                  <p className="text-sm font-medium">Enabled</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ScanIcon className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
