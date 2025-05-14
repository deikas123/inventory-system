"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ConnectionStatusIndicator } from "./connection-status"
import { SyncStatusIndicator } from "./sync-status"

// Export as a named export
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-x-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-xs">
                <div className="flex items-center mb-8">
                  <div className="relative h-8 w-24 mr-2">
                    <Image src="/images/ums_logo.png" alt="UMS Kenya Logo" fill className="object-contain" />
                  </div>
                </div>
                <MainNav />
              </SheetContent>
            </Sheet>
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative h-8 w-24">
                <Image src="/images/ums_logo.png" alt="UMS Kenya Logo" fill className="object-contain" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <SyncStatusIndicator />
            <ConnectionStatusIndicator />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 pt-4 lg:block">
          <div className="px-4">
            <MainNav />
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

// Also export as default export
export default DashboardShell
