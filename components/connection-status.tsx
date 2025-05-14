"use client"

import { useEffect, useState, useRef } from "react"
import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useInventory } from "@/context/inventory-context"

// Helper function to check if we're on the login page
const isLoginPage = () => {
  if (typeof window === "undefined") return true // Default to true during SSR
  return window.location.pathname.includes("/auth/login") || window.location.pathname.includes("/auth/")
}

export function ConnectionStatus() {
  // Always call hooks at the top level, before any conditional returns
  const { connectionStatus, error, checkConnection, refreshData } = useInventory()
  const [visible, setVisible] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isLoginPageValue = isLoginPage() // Calculate this once

  // Handle retry button click
  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Clear any existing auto-hide timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      // Try to reconnect
      const isConnected = await checkConnection()
      console.log("Connection retry result:", isConnected)

      // If connection successful, refresh data
      if (isConnected) {
        await refreshData()
        // Hide the notification after successful reconnection
        setVisible(false)
      }
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  // Effect to handle visibility changes based on connection status and errors
  useEffect(() => {
    // Don't show on login pages
    if (isLoginPageValue) {
      return
    }

    let timeoutId: NodeJS.Timeout | null = null

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Set visibility based on connection status or error
    if (connectionStatus === "offline" || error) {
      setVisible(true)

      // Auto-hide after 10 seconds
      timeoutId = setTimeout(() => {
        setVisible(false)
      }, 10000)
    } else {
      setVisible(false)
    }

    // Store the timeout ID in the ref
    timerRef.current = timeoutId

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [connectionStatus, error, isLoginPageValue]) // Include isLoginPageValue in dependencies

  // Don't render if on login page or not visible or if we're online with no errors
  if (isLoginPageValue || !visible || (connectionStatus === "online" && !error)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="border-red-500 bg-red-50">
        <div className="flex items-center gap-2">
          {connectionStatus === "offline" ? <WifiOff className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{connectionStatus === "offline" ? "Connection Lost" : "Database Error"}</AlertTitle>
        </div>
        <AlertDescription className="mt-2">
          {connectionStatus === "offline"
            ? "You're currently working offline. This could be due to network issues or Supabase configuration. Check your internet connection and Supabase settings."
            : error || "There was an error connecting to the database. Using local data instead."}
        </AlertDescription>
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Retrying..." : "Retry Connection"}
          </Button>
        </div>
      </Alert>
    </div>
  )
}

export function ConnectionStatusIndicator() {
  // Always call hooks at the top level, before any conditional returns
  const { connectionStatus, checkConnection, refreshData } = useInventory()
  const [isRetrying, setIsRetrying] = useState(false)
  const isLoginPageValue = isLoginPage() // Calculate this once

  // Handle retry button click
  const handleRetry = async () => {
    if (isRetrying) return

    setIsRetrying(true)
    try {
      const isConnected = await checkConnection()
      if (isConnected) {
        await refreshData()
      }
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  // Don't render anything on login pages
  if (isLoginPageValue) {
    return null
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      {connectionStatus === "online" ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600">Online</span>
        </>
      ) : (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 disabled:opacity-50"
          title="Click to retry connection"
        >
          {isRetrying ? (
            <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-amber-500" />
          )}
          <span>{isRetrying ? "Retrying..." : "Offline"}</span>
        </button>
      )}
    </div>
  )
}
