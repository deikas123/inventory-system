"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useInventory } from "@/context/inventory-context"
import { useToast } from "@/hooks/use-toast"

export function ClearDataSection() {
  const { clearAllData } = useInventory()
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearData = async () => {
    try {
      setIsClearing(true)
      await clearAllData()
      toast({
        title: "Data cleared",
        description: "All data has been successfully cleared from the system.",
        variant: "default",
      })
      setShowConfirm(false)
    } catch (error) {
      console.error("Error clearing data:", error)
      toast({
        title: "Error",
        description: "Failed to clear data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-red-600">Clear All Data</CardTitle>
        <CardDescription>Remove all data from the system. This action cannot be undone.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This will permanently delete all products, meters, customers, sales, and other data from both the database and
          local storage. Use this option only if you want to start with a completely clean system.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!showConfirm ? (
          <Button variant="destructive" onClick={() => setShowConfirm(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
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
