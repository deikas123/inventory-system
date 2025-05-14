"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudOff, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInventory } from "@/context/inventory-context"
import { formatDistanceToNow } from "date-fns"

export function SyncStatus() {
  const { connectionStatus, syncStatus, pendingOperationsCount, lastSyncTime, syncData } = useInventory()
  const [isSyncing, setIsSyncing] = useState(false)

  // Update isSyncing state based on syncStatus
  useEffect(() => {
    setIsSyncing(syncStatus === "syncing")
  }, [syncStatus])

  // Format last sync time
  const formattedLastSync = lastSyncTime ? formatDistanceToNow(lastSyncTime, { addSuffix: true }) : "never"

  // Handle manual sync
  const handleSync = async () => {
    if (connectionStatus !== "online" || isSyncing) return

    try {
      setIsSyncing(true)
      await syncData()
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {connectionStatus === "online" ? (
        <>
          <div className="flex items-center gap-1.5 text-xs">
            <Cloud className="h-3.5 w-3.5 text-green-500" />
            <span className="text-muted-foreground">
              {pendingOperationsCount > 0 ? (
                <span className="text-amber-600">
                  {pendingOperationsCount} pending {pendingOperationsCount === 1 ? "change" : "changes"}
                </span>
              ) : (
                <span className="text-green-600">Synced {formattedLastSync}</span>
              )}
            </span>
          </div>

          {pendingOperationsCount > 0 && (
            <Button
              size="xs"
              variant="outline"
              className="h-6 px-2 text-xs flex items-center gap-1"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  <span>Sync Now</span>
                </>
              )}
            </Button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-1.5 text-xs">
          <CloudOff className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-amber-600">
            Offline
            {pendingOperationsCount > 0 && (
              <>
                {" "}
                ({pendingOperationsCount} pending {pendingOperationsCount === 1 ? "change" : "changes"})
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

// Button variant
export function SyncButton() {
  const { connectionStatus, syncStatus, pendingOperationsCount, syncData } = useInventory()
  const [isSyncing, setIsSyncing] = useState(false)

  // Update isSyncing state based on syncStatus
  useEffect(() => {
    setIsSyncing(syncStatus === "syncing")
  }, [syncStatus])

  // Handle manual sync
  const handleSync = async () => {
    if (connectionStatus !== "online" || isSyncing) return

    try {
      setIsSyncing(true)
      await syncData()
    } finally {
      setIsSyncing(false)
    }
  }

  if (connectionStatus !== "online") {
    return (
      <Button size="sm" variant="outline" className="flex items-center gap-1.5" disabled>
        <CloudOff className="h-4 w-4" />
        <span>Offline</span>
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant={pendingOperationsCount > 0 ? "default" : "outline"}
      className="flex items-center gap-1.5"
      onClick={handleSync}
      disabled={isSyncing}
    >
      {isSyncing ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing...</span>
        </>
      ) : pendingOperationsCount > 0 ? (
        <>
          <RefreshCw className="h-4 w-4" />
          <span>Sync ({pendingOperationsCount})</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          <span>Synced</span>
        </>
      )}
    </Button>
  )
}

// Export SyncStatusIndicator as an alias for SyncStatus
export const SyncStatusIndicator = SyncStatus
