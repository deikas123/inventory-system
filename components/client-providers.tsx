"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "@/components/ui/toaster"
import { ClearDummyData } from "@/components/clear-dummy-data"

// Dynamically import ConnectionStatus with no SSR
const ConnectionStatus = dynamic(() => import("@/components/connection-status").then((mod) => mod.ConnectionStatus), {
  ssr: false,
})

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <ClearDummyData />
      {children}
      <ConnectionStatus />
      <Toaster />
    </>
  )
}
