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
import type { MeterType } from "@/types/inventory"

interface DeleteMeterTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meterType: MeterType
  onClose: () => void
}

export function DeleteMeterTypeDialog({ open, onOpenChange, meterType, onClose }: DeleteMeterTypeDialogProps) {
  const { deleteMeterType, meters } = useInventory()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if this meter type is in use
  const isInUse = meters.some((meter) => meter.meterTypeId === meterType.id)

  const handleDelete = async () => {
    if (isInUse) {
      toast({
        title: "Cannot Delete",
        description: "This meter type is currently in use by one or more meters. Please reassign those meters first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await deleteMeterType(meterType.id)

      toast({
        title: "Meter Type Deleted",
        description: `${meterType.name} has been deleted successfully.`,
      })

      onOpenChange(false)
      onClose()
    } catch (error) {
      console.error("Error deleting meter type:", error)
      toast({
        title: "Error",
        description: "Failed to delete meter type. Please try again.",
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
          <DialogTitle>Delete Meter Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this meter type? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center p-4 mb-4 text-amber-800 border border-amber-200 rounded-lg bg-amber-50">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
            <div>
              <p className="font-medium">Warning</p>
              <p className="text-sm">
                Deleting a meter type will permanently remove it from the system.
                {isInUse && (
                  <span className="font-bold text-red-600">
                    {" "}
                    This meter type is currently in use and cannot be deleted.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {meterType.name}
            </p>
            <p>
              <strong>Manufacturer:</strong> {meterType.manufacturer}
            </p>
            <p>
              <strong>Model:</strong> {meterType.model}
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
              "Delete Meter Type"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
