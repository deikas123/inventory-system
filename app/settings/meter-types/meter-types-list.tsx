"use client"

import { useState, useEffect } from "react"
import { useInventory } from "@/context/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditMeterTypeDialog } from "./edit-meter-type-dialog"
import { DeleteMeterTypeDialog } from "./delete-meter-type-dialog"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Tag, AlertCircle } from "lucide-react"
import type { MeterType } from "@/types/inventory"
import { EmptyState } from "@/components/empty-state"

export function MeterTypesList() {
  const { meterTypes, fetchMeterTypes } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTypes, setFilteredTypes] = useState<MeterType[]>([])
  const [selectedType, setSelectedType] = useState<MeterType | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMeterTypes()
      } catch (error) {
        console.error("Error fetching meter types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fetchMeterTypes])

  useEffect(() => {
    if (meterTypes) {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        setFilteredTypes(
          meterTypes.filter(
            (type) =>
              type.name.toLowerCase().includes(query) ||
              type.manufacturer.toLowerCase().includes(query) ||
              type.model.toLowerCase().includes(query) ||
              type.category.toLowerCase().includes(query),
          ),
        )
      } else {
        setFilteredTypes(meterTypes)
      }
    }
  }, [searchQuery, meterTypes])

  const handleEdit = (type: MeterType) => {
    setSelectedType(type)
    setIsEditOpen(true)
  }

  const handleDelete = (type: MeterType) => {
    setSelectedType(type)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meter Types</CardTitle>
          <CardDescription>Loading meter types...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!meterTypes || meterTypes.length === 0) {
    return (
      <EmptyState
        icon={<Tag className="h-10 w-10" />}
        title="No Meter Types"
        description="You haven't added any meter types yet. Add your first meter type to get started."
        action={<AddMeterTypeButton variant="default" />}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meter Types</CardTitle>
          <CardDescription>Manage the types of meters in your inventory</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meter types..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No meter types found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.manufacturer}</TableCell>
                      <TableCell>{type.model}</TableCell>
                      <TableCell>{type.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            type.status === "active"
                              ? "outline"
                              : type.status === "discontinued"
                                ? "secondary"
                                : "default"
                          }
                          className={
                            type.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : type.status === "discontinued"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {type.status.charAt(0).toUpperCase() + type.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(type)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedType && (
        <>
          <EditMeterTypeDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            meterType={selectedType}
            onClose={() => setSelectedType(null)}
          />
          <DeleteMeterTypeDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            meterType={selectedType}
            onClose={() => setSelectedType(null)}
          />
        </>
      )}
    </>
  )
}

// Import this component to avoid circular dependency
function AddMeterTypeButton({ variant = "outline" }: { variant?: "default" | "outline" }) {
  return (
    <Button variant={variant}>
      <Tag className="h-4 w-4 mr-2" />
      Add Meter Type
    </Button>
  )
}
