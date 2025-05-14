"use client"

import Link from "next/link"
import { useState } from "react"
import DashboardShell from "@/components/dashboard-shell"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BoxIcon, UsersIcon, ScanIcon, AlertCircleIcon, ArrowRightIcon, DatabaseIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useInventory } from "@/context/inventory-context"
import { clearAllLocalStorage } from "@/lib/clear-all-data"

export default function DashboardPage() {
  const { products, meters, customers, connectionStatus } = useInventory()
  const [isClearing, setIsClearing] = useState(false)

  // Function to clear all local storage data
  const handleClearAllData = () => {
    setIsClearing(true)
    clearAllLocalStorage()
    setTimeout(() => {
      setIsClearing(false)
      window.location.reload()
    }, 1000)
  }

  // Calculate summary statistics
  const totalInventory = products.length
  const lowStockItems = products.filter((p) => p.inStock < p.minStock).length
  const availableMeters = meters.filter((m) => m.status === "available").length
  const soldMeters = meters.filter((m) => m.status === "sold").length

  // Empty state for recent activities and alerts
  const recentActivities = []
  const alerts = []

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Quick Scan</Button>
          <Button variant="destructive" onClick={handleClearAllData} disabled={isClearing}>
            {isClearing ? "Clearing..." : "Clear All Data"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Inventory Items"
          value={totalInventory.toString()}
          description="Products in the system"
          icon={<BoxIcon className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          trendValue="Real-time data"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.toString()}
          description="Items below threshold levels"
          icon={<AlertCircleIcon className="h-4 w-4 text-red-500" />}
          trend="neutral"
          trendValue="Real-time data"
        />
        <StatCard
          title="Available Meters"
          value={availableMeters.toString()}
          description="Ready for allocation"
          icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          trendValue="Real-time data"
        />
        <StatCard
          title="Sold Meters"
          value={soldMeters.toString()}
          description="Meters sold to customers"
          icon={<ScanIcon className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          trendValue="Real-time data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest inventory movements and actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Details</TableHead>
                      <TableHead className="hidden md:table-cell">User</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{activity.type}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{activity.details}</TableCell>
                        <TableCell className="hidden md:table-cell">{activity.user}</TableCell>
                        <TableCell className="text-right">{activity.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <Link href="/logs" className="text-sm text-primary flex items-center gap-1">
                    View all activity <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <DatabaseIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  There is no recent activity to display. Activities will appear here as you use the system.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/products">Add Products</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div
                      className={cn(
                        "p-1.5 rounded-full",
                        alert.severity === "high"
                          ? "bg-red-100 text-red-600"
                          : alert.severity === "medium"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-blue-100 text-blue-600",
                      )}
                    >
                      <AlertCircleIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{alert.type}</h4>
                      <p className="text-xs text-muted-foreground">{alert.details}</p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <Link href="/alerts" className="text-sm text-primary flex items-center gap-1">
                    View all alerts <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircleIcon className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Alerts</h3>
                <p className="text-muted-foreground mb-4">There are no alerts or notifications at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Current system connection status</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${
                  connectionStatus === "online"
                    ? "bg-green-100 text-green-600"
                    : connectionStatus === "checking"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-red-100 text-red-600"
                }`}
              >
                <DatabaseIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {connectionStatus === "online"
                  ? "Connected to Database"
                  : connectionStatus === "checking"
                    ? "Checking Connection..."
                    : "Offline Mode"}
              </h3>
              <p className="text-muted-foreground">
                {connectionStatus === "online"
                  ? "The system is connected to the database and operating normally."
                  : connectionStatus === "checking"
                    ? "Checking database connection..."
                    : "The system is currently in offline mode. Changes will be synced when connection is restored."}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Summary</CardTitle>
            <CardDescription>Key system statistics</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Products</h4>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Meters</h4>
                <p className="text-2xl font-bold">{meters.length}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Customers</h4>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <p className="text-2xl font-bold capitalize">{connectionStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

// Helper function to determine class names conditionally
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
