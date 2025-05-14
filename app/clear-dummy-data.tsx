"use client"

import { useEffect } from "react"
import { clearAllLocalData } from "@/lib/local-storage"

export function ClearDummyData() {
  useEffect(() => {
    // Clear all local storage data on initial load
    clearAllLocalData()
    console.log("Local storage cleared to remove dummy data")
  }, [])

  return null
}
