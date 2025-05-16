"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useInventory } from "@/context/inventory-context"
import { Loader2, AlertTriangle } from "lucide-react"
import type { Location } from "@/types/inventory"

interface DeleteLocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: Location
  onClose: () => void
}

export function DeleteLocationDialog({ open, onOpenChange, location, onClose }: DeleteLocationDialogProps) {
  const { deleteLocation, meters } = useInventory()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if this location is in use
  const isInUse = meters.some((meter) => meter.location === location.name)

  const handleDelete = async () => {
    if (isInUse) {
      toast({
        title: "Cannot Delete",
        description: "This location is currently in use by one or more meters. Please reassign those meters first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await deleteLocation(location.id)

      toast({
        title: "Location Deleted",
        description: `${location.name} has been deleted successfully.`,
      })

      onOpenChange(false)
      onClose()
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Location</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this location? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center p-4 mb-4 text-amber-800 border border-amber-200 rounded-lg bg-amber-50">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
            <div>
              <p className="font-medium">Warning</p>
              <p className="text-sm">
                Deleting a location will permanently remove it from the system.
                {isInUse && (
                  <span className="font-bold text-red-600">
                    {" "}
                    This location is currently in use and cannot be deleted.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {location.name}
            </p>
            <p>
              <strong>Type:</strong> {location.type}
            </p>
            <p>
              <strong>Address:</strong> {location.address}
            </p>
            <p>
              <strong>City:</strong> {location.city}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              onClose()
            }}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting || isInUse}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Location"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
