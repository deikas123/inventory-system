"use client"

import { useState, useEffect } from "react"
import { useInventory } from "@/context/inventory-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditLocationDialog } from "./edit-location-dialog"
import { DeleteLocationDialog } from "./delete-location-dialog"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, MapPin, AlertCircle } from "lucide-react"
import type { Location } from "@/types/inventory"
import { EmptyState } from "@/components/empty-state"

export function LocationsList() {
  const { locations, fetchLocations } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchLocations()
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fetchLocations])

  useEffect(() => {
    if (locations) {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        setFilteredLocations(
          locations.filter(
            (location) =>
              location.name.toLowerCase().includes(query) ||
              location.address.toLowerCase().includes(query) ||
              location.city.toLowerCase().includes(query) ||
              location.type.toLowerCase().includes(query),
          ),
        )
      } else {
        setFilteredLocations(locations)
      }
    }
  }, [searchQuery, locations])

  const handleEdit = (location: Location) => {
    setSelectedLocation(location)
    setIsEditOpen(true)
  }

  const handleDelete = (location: Location) => {
    setSelectedLocation(location)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Locations</CardTitle>
          <CardDescription>Loading locations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!locations || locations.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="h-10 w-10" />}
        title="No Locations"
        description="You haven't added any warehouse locations yet. Add your first location to get started."
        action={<AddLocationButton variant="default" />}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Locations</CardTitle>
          <CardDescription>Manage the warehouse locations in your inventory system</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No locations found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.type}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>{location.city}</TableCell>
                      <TableCell>
                        <Badge
                          variant={location.status === "active" ? "outline" : "secondary"}
                          className={
                            location.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(location)}>
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

      {selectedLocation && (
        <>
          <EditLocationDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
          <DeleteLocationDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </>
      )}
    </>
  )
}

// Import this component to avoid circular dependency
function AddLocationButton({ variant = "outline" }: { variant?: "default" | "outline" }) {
  return (
    <Button variant={variant}>
      <MapPin className="h-4 w-4 mr-2" />
      Add Location
    </Button>
  )
}
