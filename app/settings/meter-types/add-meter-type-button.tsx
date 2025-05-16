"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useInventory } from "@/context/inventory-context"
import { Tag, Loader2 } from "lucide-react"

export function AddMeterTypeButton({ variant = "outline" }: { variant?: "default" | "outline" }) {
  const { addMeterType } = useInventory()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
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

      await addMeterType({
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Meter Type Added",
        description: `${formData.name} has been added successfully.`,
      })

      // Reset form and close dialog
      setFormData({
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
      setOpen(false)
    } catch (error) {
      console.error("Error adding meter type:", error)
      toast({
        title: "Error",
        description: "Failed to add meter type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Tag className="h-4 w-4 mr-2" />
          Add Meter Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Meter Type</DialogTitle>
          <DialogDescription>
            Add a new meter type to your inventory system. This will be available when adding new meters.
          </DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Meter Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
