"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  ScanBarcode,
  ShoppingCart,
  Settings,
  RotateCcw,
  BarChart3,
  FileText,
  ShoppingBag,
} from "lucide-react"
import { usePathname } from "next/navigation"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/products",
      label: "Products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      href: "/stock",
      label: "Stock",
      icon: <Warehouse className="mr-2 h-4 w-4" />,
    },
    {
      href: "/agents",
      label: "Agents",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/scanning",
      label: "Scanning",
      icon: <ScanBarcode className="mr-2 h-4 w-4" />,
    },
    {
      href: "/sales",
      label: "Sales",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
    },
    {
      href: "/purchases",
      label: "Purchases",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    },
    {
      href: "/returns",
      label: "Returns & Repairs",
      icon: <RotateCcw className="mr-2 h-4 w-4" />,
    },
    {
      href: "/reports",
      label: "Reports",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      href: "/logs",
      label: "Audit & Logs",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {routes.map((route) => {
        const isActive = pathname === route.href

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-[#0066b3]/10 hover:text-[#0066b3]",
              isActive ? "bg-[#0066b3] text-white" : "text-gray-700",
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
