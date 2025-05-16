"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Trash2, Edit } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Type name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type ProductType = {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface ManageTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTypesChange: () => void
}

export function ManageTypesDialog({ open, onOpenChange, onTypesChange }: ManageTypesDialogProps) {
  const [types, setTypes] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingType, setEditingType] = useState<ProductType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null)

  const supabase = createClientComponentClient()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Load types
  useEffect(() => {
    if (open) {
      loadTypes()
    }
  }, [open])

  // Set form values when editing
  useEffect(() => {
    if (editingType) {
      form.reset({
        name: editingType.name,
        description: editingType.description || "",
      })
    } else {
      form.reset({
        name: "",
        description: "",
      })
    }
  }, [editingType, form])

  async function loadTypes() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("product_types").select("*").order("name")

      if (error) throw error
      setTypes(data || [])
    } catch (error) {
      console.error("Error loading product types:", error)
      toast({
        title: "Error",
        description: "Failed to load product types",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      if (editingType) {
        // Update existing type
        const { error } = await supabase
          .from("product_types")
          .update({
            name: values.name,
            description: values.description || null,
          })
          .eq("id", editingType.id)

        if (error) throw error

        toast({
          title: "Product type updated",
          description: `${values.name} has been updated.`,
        })
      } else {
        // Add new type
        const { error } = await supabase.from("product_types").insert({
          name: values.name,
          description: values.description || null,
        })

        if (error) throw error

        toast({
          title: "Product type added",
          description: `${values.name} has been added.`,
        })
      }

      // Reset form and reload types
      form.reset()
      setEditingType(null)
      await loadTypes()
      onTypesChange()
    } catch (error) {
      console.error("Error saving product type:", error)
      toast({
        title: "Error",
        description: "Failed to save product type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteType() {
    if (!typeToDelete) return

    try {
      const { error } = await supabase.from("product_types").delete().eq("id", typeToDelete.id)

      if (error) throw error

      toast({
        title: "Product type deleted",
        description: `${typeToDelete.name} has been deleted.`,
      })

      // Reload types
      await loadTypes()
      onTypesChange()
    } catch (error) {
      console.error("Error deleting product type:", error)
      toast({
        title: "Error",
        description: "Failed to delete product type. It may be in use.",
        variant: "destructive",
      })
    } finally {
      setTypeToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingType ? "Edit Product Type" : "Manage Product Types"}</DialogTitle>
            <DialogDescription>
              {editingType ? "Update the product type details below." : "Add, edit, or remove product types."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter type name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter type description" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  {editingType && (
                    <Button type="button" variant="outline" onClick={() => setEditingType(null)}>
                      Cancel Edit
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingType ? "Update Type" : "Add Type"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Loading product types...
                      </TableCell>
                    </TableRow>
                  ) : types.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No product types found. Add your first type above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    types.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>{type.description || "No description"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingType(type)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setTypeToDelete(type)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product type "{typeToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteType} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
