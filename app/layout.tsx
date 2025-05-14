import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { InventoryProvider } from "@/context/inventory-context"
import { ClientProviders } from "@/components/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UMS Inventory Management System",
  description: "Inventory management system for UMS Kenya",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <InventoryProvider>
            <ClientProviders>{children}</ClientProviders>
          </InventoryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
