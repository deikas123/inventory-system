import DashboardShell from "@/components/dashboard-shell"
import { MeterTypesList } from "./meter-types-list"
import { AddMeterTypeButton } from "./add-meter-type-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meter Types",
  description: "Manage meter types in the inventory system",
}

export default function MeterTypesPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meter Types</h1>
        <AddMeterTypeButton />
      </div>
      <MeterTypesList />
    </DashboardShell>
  )
}
