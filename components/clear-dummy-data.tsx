"use client"

import { useEffect } from "react"
import { clearAllLocalStorage } from "@/lib/clear-all-data"

export function ClearDummyData() {
  useEffect(() => {
    // Clear all local storage data on component mount
    clearAllLocalStorage()
    console.log("Cleared all dummy data on page load")
  }, [])

  return null
}
