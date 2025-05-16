"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useInventory } from "@/context/inventory-context"
import { Loader2 } from "lucide-react"
import type { MeterType } from "@/types/inventory"

interface EditMeterTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meterType: MeterType
  onClose: () => void
}

export function EditMeterTypeDialog({ open, onOpenChange, meterType, onClose }: EditMeterTypeDialogProps) {
  const { updateMeterType } = useInventory()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    manufacturer: "",
    model: "",
    description: "",
    category: "",
    phase: "single",
    connectionType: "",
    maxCurrent: "",
    voltage: "",
    communicationType: "",
    features: "",
    status: "active",
  })

  useEffect(() => {
    if (meterType) {
      setFormData({
        id: meterType.id,
        name: meterType.name,
        manufacturer: meterType.manufacturer,
        model: meterType.model,
        description: meterType.description || "",
        category: meterType.category,
        phase: meterType.phase,
        connectionType: meterType.connectionType,
        maxCurrent: meterType.maxCurrent?.toString() || "",
        voltage: meterType.voltage || "",
        communicationType: meterType.communicationType || "",
        features: meterType.features?.join(", ") || "",
        status: meterType.status,
      })
    }
  }, [meterType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ["name", "manufacturer", "model", "category", "connectionType"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Parse features from comma-separated string to array
      const featuresArray = formData.features ? formData.features.split(",").map((feature) => feature.trim()) : []

      // Parse maxCurrent to number
      const maxCurrent = formData.maxCurrent ? Number.parseFloat(formData.maxCurrent) : 0

      await updateMeterType({
        id: formData.id,
        name: formData.name,
        manufacturer: formData.manufacturer,
        model: formData.model,
        description: formData.description,
        category: formData.category,
        phase: formData.phase as "single" | "three",
        connectionType: formData.connectionType,
        maxCurrent,
        voltage: formData.voltage,
        communicationType: formData.communicationType,
        features: featuresArray,
        status: formData.status as "active" | "discontinued" | "upcoming",
        createdAt: meterType.createdAt,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Meter Type Updated",
        description: `${formData.name} has been updated successfully.`,
      })

      onOpenChange(false)
      onClose()
    } catch (error) {
      console.error("Error updating meter type:", error)
      toast({
        title: "Error",
        description: "Failed to update meter type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Meter Type</DialogTitle>
          <DialogDescription>Update the details of this meter type.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Prepaid Single Phase"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">
                Manufacturer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                placeholder="e.g. Conlog"
                value={formData.manufacturer}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">
                Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g. BEC23"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g. Prepaid"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Select value={formData.phase} onValueChange={(value) => handleSelectChange("phase", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Phase</SelectItem>
                  <SelectItem value="three">Three Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectionType">
                Connection Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="connectionType"
                name="connectionType"
                placeholder="e.g. Direct"
                value={formData.connectionType}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxCurrent">Max Current (A)</Label>
              <Input
                id="maxCurrent"
                name="maxCurrent"
                type="number"
                placeholder="e.g. 60"
                value={formData.maxCurrent}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voltage">Voltage</Label>
              <Input
                id="voltage"
                name="voltage"
                placeholder="e.g. 240V"
                value={formData.voltage}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="communicationType">Communication Type</Label>
            <Input
              id="communicationType"
              name="communicationType"
              placeholder="e.g. PLC, RF, GSM"
              value={formData.communicationType}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              name="features"
              placeholder="e.g. Tamper detection, Load control, Remote disconnect"
              value={formData.features}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">Separate features with commas</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detailed description of the meter type"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Meter Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
