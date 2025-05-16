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
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Category = {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface ManageCategoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoriesChange: () => void
}

export function ManageCategoriesDialog({ open, onOpenChange, onCategoriesChange }: ManageCategoriesDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const supabase = createClientComponentClient()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Load categories
  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open])

  // Set form values when editing
  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
      })
    } else {
      form.reset({
        name: "",
        description: "",
      })
    }
  }, [editingCategory, form])

  async function loadCategories() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("product_categories").select("*").order("name")

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
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
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("product_categories")
          .update({
            name: values.name,
            description: values.description || null,
          })
          .eq("id", editingCategory.id)

        if (error) throw error

        toast({
          title: "Category updated",
          description: `${values.name} has been updated.`,
        })
      } else {
        // Add new category
        const { error } = await supabase.from("product_categories").insert({
          name: values.name,
          description: values.description || null,
        })

        if (error) throw error

        toast({
          title: "Category added",
          description: `${values.name} has been added.`,
        })
      }

      // Reset form and reload categories
      form.reset()
      setEditingCategory(null)
      await loadCategories()
      onCategoriesChange()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return

    try {
      const { error } = await supabase.from("product_categories").delete().eq("id", categoryToDelete.id)

      if (error) throw error

      toast({
        title: "Category deleted",
        description: `${categoryToDelete.name} has been deleted.`,
      })

      // Reload categories
      await loadCategories()
      onCategoriesChange()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. It may be in use.",
        variant: "destructive",
      })
    } finally {
      setCategoryToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Manage Product Categories"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details below." : "Add, edit, or remove product categories."}
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
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
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
                        <Input placeholder="Enter category description" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  {editingCategory && (
                    <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                      Cancel Edit
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No categories found. Add your first category above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || "No description"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCategoryToDelete(category)
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
              This will permanently delete the category "{categoryToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
