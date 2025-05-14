"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useInventory } from "@/context/inventory-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AddMeter() {
  const { products, meters, addMeter } = useInventory()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    meterNumber: "",
    location: "Main Warehouse",
    notes: "",
  })
  const [validationState, setValidationState] = useState({
    meterNumber: {
      valid: true,
      message: "",
      checking: false,
    },
  })

  // Validate meter number format
  const validateMeterNumberFormat = (meterNumber: string) => {
    // Check if empty
    if (!meterNumber.trim()) {
      return {
        valid: false,
        message: "Meter serial number is required",
      }
    }

    // Check format - assuming meter numbers should be numeric and a certain length
    // Adjust this regex based on your specific meter number format requirements
    const meterNumberRegex = /^\d{8,15}$/
    if (!meterNumberRegex.test(meterNumber)) {
      return {
        valid: false,
        message: "Meter serial number must be 8-15 digits",
      }
    }

    return {
      valid: true,
      message: "",
    }
  }

  // Check if meter number already exists
  const checkMeterNumberExists = (meterNumber: string) => {
    return meters.some((meter) => meter.meterNumber === meterNumber)
  }

  // Handle meter number change with validation
  const handleMeterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, meterNumber: value })

    // Format validation
    const formatValidation = validateMeterNumberFormat(value)
    if (!formatValidation.valid) {
      setValidationState({
        ...validationState,
        meterNumber: {
          ...formatValidation,
          checking: false,
        },
      })
      return
    }

    // Check for duplicates
    setValidationState({
      ...validationState,
      meterNumber: {
        valid: !checkMeterNumberExists(value),
        message: checkMeterNumberExists(value) ? "This meter serial number already exists" : "",
        checking: false,
      },
    })
  }

  // Debounced validation for meter number
  useEffect(() => {
    if (!formData.meterNumber) return

    setValidationState({
      ...validationState,
      meterNumber: {
        ...validationState.meterNumber,
        checking: true,
      },
    })

    const timer = setTimeout(() => {
      // Format validation
      const formatValidation = validateMeterNumberFormat(formData.meterNumber)
      if (!formatValidation.valid) {
        setValidationState({
          ...validationState,
          meterNumber: {
            ...formatValidation,
            checking: false,
          },
        })
        return
      }

      // Check for duplicates
      setValidationState({
        ...validationState,
        meterNumber: {
          valid: !checkMeterNumberExists(formData.meterNumber),
          message: checkMeterNumberExists(formData.meterNumber) ? "This meter serial number already exists" : "",
          checking: false,
        },
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.meterNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.productId) {
      toast({
        title: "Validation Error",
        description: "Please select a meter type",
        variant: "destructive",
      })
      return
    }

    // Validate meter number
    const meterNumberValidation = validateMeterNumberFormat(formData.meterNumber)
    if (!meterNumberValidation.valid) {
      setValidationState({
        ...validationState,
        meterNumber: {
          ...meterNumberValidation,
          checking: false,
        },
      })
      toast({
        title: "Validation Error",
        description: meterNumberValidation.message,
        variant: "destructive",
      })
      return
    }

    // Check for duplicates
    if (checkMeterNumberExists(formData.meterNumber)) {
      setValidationState({
        ...validationState,
        meterNumber: {
          valid: false,
          message: "This meter serial number already exists",
          checking: false,
        },
      })
      toast({
        title: "Validation Error",
        description: "This meter serial number already exists",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Add current date for tracking
      const now = new Date().toISOString()

      await addMeter({
        productId: formData.productId,
        meterNumber: formData.meterNumber,
        status: "in-stock",
        location: formData.location,
        notes: formData.notes,
        addedDate: now,
        lastUpdated: now,
        trackingHistory: [
          {
            id: `event_${Date.now()}`,
            timestamp: now,
            eventType: "added",
            description: `Meter added to inventory at ${formData.location}`,
            details: {
              productId: formData.productId,
              location: formData.location,
            },
          },
        ],
      })

      toast({
        title: "Meter Added",
        description: `Meter ${formData.meterNumber} has been added to inventory`,
      })

      // Reset form
      setFormData({
        productId: "",
        meterNumber: "",
        location: "Main Warehouse",
        notes: "",
      })

      setOpen(false)
    } catch (error) {
      console.error("Error adding meter:", error)
      toast({
        title: "Error",
        description: "Failed to add meter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Meter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Meter</DialogTitle>
          <DialogDescription>Add a new meter to your inventory with a unique serial number</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Meter Type</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meter type" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((product) => product.type === "Meter")
                  .map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meter-number">Meter Serial Number</Label>
            <div className="relative">
              <Input
                id="meter-number"
                placeholder="e.g. 58102527205"
                value={formData.meterNumber}
                onChange={handleMeterNumberChange}
                className={
                  validationState.meterNumber.checking
                    ? "pr-10"
                    : !validationState.meterNumber.valid && formData.meterNumber
                      ? "border-red-500 pr-10"
                      : validationState.meterNumber.valid && formData.meterNumber
                        ? "border-green-500 pr-10"
                        : ""
                }
              />
              {validationState.meterNumber.checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {!validationState.meterNumber.valid && formData.meterNumber && !validationState.meterNumber.checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
              {validationState.meterNumber.valid && formData.meterNumber && !validationState.meterNumber.checking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {!validationState.meterNumber.valid && formData.meterNumber && (
              <p className="text-sm text-red-500">{validationState.meterNumber.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter the unique serial number printed on the meter (e.g., 58102527205)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                <SelectItem value="Nakuru Branch">Nakuru Branch</SelectItem>
                <SelectItem value="Mombasa Branch">Mombasa Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this meter"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <Alert className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Each meter must have a unique serial number. This number will be used to track the meter throughout its
              lifecycle.
            </AlertDescription>
          </Alert>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.productId ||
                !formData.meterNumber ||
                !validationState.meterNumber.valid ||
                validationState.meterNumber.checking
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Meter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Also keep the default export for backward compatibility
export default AddMeter
