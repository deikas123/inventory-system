"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Conflict, ResolutionStrategy } from "@/lib/conflict-resolution"
import * as ConflictResolution from "@/lib/conflict-resolution"
import * as SyncService from "@/lib/sync-service"

type ConflictResolutionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResolved: () => void
}

export function ConflictResolutionDialog({ open, onOpenChange, onResolved }: ConflictResolutionDialogProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0)
  const [selectedStrategy, setSelectedStrategy] = useState<ResolutionStrategy>("server")
  const [mergedData, setMergedData] = useState<any>(null)
  const [isResolving, setIsResolving] = useState(false)
  const { toast } = useToast()

  // Load conflicts when the dialog opens
  useEffect(() => {
    if (open) {
      const unresolvedConflicts = SyncService.getUnresolvedConflicts()
      setConflicts(unresolvedConflicts)
      setCurrentConflictIndex(0)

      if (unresolvedConflicts.length > 0) {
        // Default to server strategy
        setSelectedStrategy("server")

        // Initialize merged data
        const conflict = unresolvedConflicts[0]
        setMergedData(ConflictResolution.mergeObjects(conflict.clientData, conflict.serverData))
      }
    }
  }, [open])

  // Get the current conflict
  const currentConflict = conflicts[currentConflictIndex]

  // Get available resolution strategies for the current conflict
  const availableStrategies = currentConflict ? ConflictResolution.getResolutionOptions(currentConflict) : []

  // Handle strategy change
  const handleStrategyChange = (strategy: ResolutionStrategy) => {
    setSelectedStrategy(strategy)

    // If strategy is merge, initialize merged data
    if (strategy === "merge" && currentConflict) {
      setMergedData(ConflictResolution.mergeObjects(currentConflict.clientData, currentConflict.serverData))
    }
  }

  // Handle field change in merged data
  const handleFieldChange = (field: string, value: any) => {
    if (!mergedData) return

    setMergedData({
      ...mergedData,
      [field]: value,
    })
  }

  // Handle conflict resolution
  const handleResolve = async () => {
    if (!currentConflict) return

    setIsResolving(true)

    try {
      // Get the data to use for resolution
      let resolvedData

      if (selectedStrategy === "server") {
        resolvedData = currentConflict.serverData
      } else if (selectedStrategy === "client") {
        resolvedData = currentConflict.clientData
      } else {
        // For merge or manual, use the merged data
        resolvedData = mergedData
      }

      // Resolve the conflict
      const success = await SyncService.resolveConflict(currentConflict.id, selectedStrategy, resolvedData)

      if (success) {
        toast({
          title: "Conflict resolved",
          description: `Successfully resolved conflict for ${currentConflict.entity} ${currentConflict.entityId}`,
        })

        // Move to the next conflict or close the dialog
        if (currentConflictIndex < conflicts.length - 1) {
          setCurrentConflictIndex(currentConflictIndex + 1)

          // Initialize for the next conflict
          const nextConflict = conflicts[currentConflictIndex + 1]
          setSelectedStrategy("server")
          setMergedData(ConflictResolution.mergeObjects(nextConflict.clientData, nextConflict.serverData))
        } else {
          // All conflicts resolved
          onResolved()
          onOpenChange(false)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to resolve conflict. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resolving conflict:", error)
      toast({
        title: "Error",
        description: "An error occurred while resolving the conflict.",
        variant: "destructive",
      })
    } finally {
      setIsResolving(false)
    }
  }

  // If there are no conflicts, show a message
  if (conflicts.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>No Conflicts Found</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>There are no conflicts that need resolution.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            Resolve Conflict ({currentConflictIndex + 1} of {conflicts.length})
          </DialogTitle>
        </DialogHeader>

        {currentConflict && (
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Conflict Details</h3>
              <p className="text-sm text-gray-500">
                Entity: <span className="font-medium">{currentConflict.entity}</span> | Type:{" "}
                <span className="font-medium">{currentConflict.type}</span> | Created:{" "}
                <span className="font-medium">{currentConflict.createdAt.toLocaleString()}</span>
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Resolution Strategy</h3>
              <div className="flex flex-wrap gap-2">
                {availableStrategies.map((strategy) => (
                  <Button
                    key={strategy}
                    variant={selectedStrategy === strategy ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStrategyChange(strategy)}
                  >
                    {strategy === "server" && "Use Server Data"}
                    {strategy === "client" && "Use Local Data"}
                    {strategy === "merge" && "Merge Changes"}
                    {strategy === "manual" && "Manual Resolution"}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="comparison" className="w-full">
              <TabsList>
                <TabsTrigger value="comparison">Data Comparison</TabsTrigger>
                {(selectedStrategy === "merge" || selectedStrategy === "manual") && (
                  <TabsTrigger value="editor">Conflict Editor</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="comparison" className="border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Server Data</h4>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(currentConflict.serverData, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Local Data</h4>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                      {JSON.stringify(currentConflict.clientData, null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>

              {(selectedStrategy === "merge" || selectedStrategy === "manual") && mergedData && (
                <TabsContent value="editor" className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Edit Merged Data</h4>
                  <div className="space-y-2">
                    {Object.entries(mergedData).map(([key, value]) => {
                      // Skip id and timestamps for editing
                      if (key === "id" || key === "created_at") return null

                      const serverValue = currentConflict.serverData?.[key]
                      const clientValue = currentConflict.clientData?.[key]
                      const hasConflict = serverValue !== clientValue

                      return (
                        <div key={key} className="grid grid-cols-3 gap-2 items-center">
                          <label className="text-sm font-medium">
                            {key}
                            {hasConflict && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          <input
                            type="text"
                            value={(value as string) || ""}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="border rounded p-1 text-sm col-span-2"
                          />
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="text-red-500">*</span> Indicates fields with conflicts
                  </p>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleResolve} disabled={isResolving}>
            {isResolving ? "Resolving..." : "Resolve Conflict"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
