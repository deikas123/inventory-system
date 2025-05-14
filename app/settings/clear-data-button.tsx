"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { clearAllLocalStorage } from "@/lib/clear-all-data"
import { useToast } from "@/hooks/use-toast"

export function ClearDataButton() {
  const [isClearing, setIsClearing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { toast } = useToast()

  const handleClearData = () => {
    setIsClearing(true)

    // Clear all local storage data
    clearAllLocalStorage()

    // Show success toast
    toast({
      title: "Data cleared",
      description: "All local data has been cleared successfully.",
    })

    // Reset state
    setIsClearing(false)
    setShowConfirm(false)

    // Reload the page to reflect changes
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Clear All Data</CardTitle>
        <CardDescription>Remove all data from the system</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This will permanently delete all local data including products, meters, customers, and sales. This action
          cannot be undone.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!showConfirm ? (
          <Button variant="destructive" onClick={() => setShowConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isClearing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearData} disabled={isClearing}>
              {isClearing ? "Clearing..." : "Confirm Clear All Data"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
