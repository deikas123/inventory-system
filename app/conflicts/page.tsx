"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConflictResolutionDialog } from "@/components/conflict-resolution-dialog"
import { useToast } from "@/hooks/use-toast"
import * as ConflictResolution from "@/lib/conflict-resolution"
import type { Conflict } from "@/lib/conflict-resolution"
import { useInventory } from "@/context/inventory-context"

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [resolvedConflicts, setResolvedConflicts] = useState<Conflict[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null)
  const { toast } = useToast()
  const { refreshData } = useInventory()
  const router = useRouter()

  // Load conflicts on page load
  useEffect(() => {
    loadConflicts()
  }, [])

  // Function to load conflicts
  const loadConflicts = () => {
    // Load conflict history
    const conflictHistory = ConflictResolution.loadConflictHistory()

    // Split into resolved and unresolved
    const unresolved = conflictHistory.conflicts.filter((c) => !c.resolved)
    const resolved = conflictHistory.conflicts.filter((c) => c.resolved)

    setConflicts(unresolved)
    setResolvedConflicts(resolved)
  }

  // Handle resolving all conflicts
  const handleResolveAll = () => {
    setSelectedConflict(null)
    setIsDialogOpen(true)
  }

  // Handle resolving a specific conflict
  const handleResolveConflict = (conflict: Conflict) => {
    setSelectedConflict(conflict)
    setIsDialogOpen(true)
  }

  // Handle conflict resolution completion
  const handleConflictResolved = async () => {
    toast({
      title: "Conflicts Resolved",
      description: "All conflicts have been successfully resolved.",
    })

    // Refresh data
    await refreshData()

    // Reload conflicts
    loadConflicts()
  }

  // Format conflict type for display
  const formatConflictType = (type: string) => {
    switch (type) {
      case "update":
        return "Update Conflict"
      case "delete":
        return "Deletion Conflict"
      case "version":
        return "Version Conflict"
      case "data":
        return "Data Conflict"
      default:
        return type
    }
  }

  // Format entity name for display
  const formatEntityName = (entity: string) => {
    switch (entity) {
      case "product":
        return "Product"
      case "meter":
        return "Meter"
      case "customer":
        return "Customer"
      case "sale":
        return "Sale"
      default:
        return entity
    }
  }

  // Format resolution strategy for display
  const formatResolutionStrategy = (strategy?: string) => {
    switch (strategy) {
      case "server":
        return "Server Data"
      case "client":
        return "Local Data"
      case "merge":
        return "Merged Data"
      case "manual":
        return "Manual Resolution"
      default:
        return "Unknown"
    }
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Conflicts</h1>
          <p className="text-muted-foreground">Manage and resolve conflicts between local and server data</p>
        </div>
        {conflicts.length > 0 && <Button onClick={handleResolveAll}>Resolve All Conflicts</Button>}
      </div>

      <div className="grid gap-4">
        {conflicts.length === 0 && resolvedConflicts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Conflicts</CardTitle>
              <CardDescription>There are no data conflicts to resolve.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            {conflicts.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-2">Unresolved Conflicts</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {conflicts.map((conflict) => (
                    <Card key={conflict.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{formatEntityName(conflict.entity)} Conflict</CardTitle>
                          <Badge variant="destructive">{formatConflictType(conflict.type)}</Badge>
                        </div>
                        <CardDescription>Created {conflict.createdAt.toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <p>
                            <strong>Entity ID:</strong> {conflict.entityId}
                          </p>
                          <p className="mt-2">
                            <strong>Conflict Details:</strong>
                          </p>
                          <div className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-20">
                            {JSON.stringify(
                              {
                                serverData: conflict.serverData,
                                clientData: conflict.clientData,
                              },
                              null,
                              2,
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleResolveConflict(conflict)}>Resolve Conflict</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {resolvedConflicts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-2">Resolved Conflicts</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {resolvedConflicts.slice(0, 4).map((conflict) => (
                    <Card key={conflict.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{formatEntityName(conflict.entity)} Conflict</CardTitle>
                          <Badge variant="outline">Resolved</Badge>
                        </div>
                        <CardDescription>Resolved {conflict.resolvedAt?.toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <p>
                            <strong>Entity ID:</strong> {conflict.entityId}
                          </p>
                          <p>
                            <strong>Resolution:</strong> {formatResolutionStrategy(conflict.resolution)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {resolvedConflicts.length > 4 && (
                  <div className="mt-2 text-center">
                    <Button variant="link">View {resolvedConflicts.length - 4} more resolved conflicts</Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ConflictResolutionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onResolved={handleConflictResolved}
      />
    </DashboardShell>
  )
}
