import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  className?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export function StatCard({ title, value, description, icon, className, trend, trendValue }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && trendValue && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn("mr-1", trend === "up" && "text-green-500", trend === "down" && "text-red-500")}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            <span className={cn(trend === "up" && "text-green-500", trend === "down" && "text-red-500")}>
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
