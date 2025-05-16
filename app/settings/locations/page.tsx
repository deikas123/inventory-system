import DashboardShell from "@/components/dashboard-shell"
import { LocationsList } from "./locations-list"
import { AddLocationButton } from "./add-location-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Locations",
  description: "Manage warehouse locations in the inventory system",
}

export default function LocationsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Warehouse Locations</h1>
        <AddLocationButton />
      </div>
      <LocationsList />
    </DashboardShell>
  )
}
