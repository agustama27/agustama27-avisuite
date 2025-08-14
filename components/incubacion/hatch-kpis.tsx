"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { HatchLoad } from "@/types/domain"

interface HatchKPIsProps {
  hatchLoads: HatchLoad[]
}

export function HatchKPIs({ hatchLoads }: HatchKPIsProps) {
  const completedLoads = hatchLoads.filter((load) => load.status === "entregado")

  const totalEggsFertile = completedLoads.reduce((sum, load) => sum + load.eggsFertile, 0)
  const totalChicksOut = completedLoads.reduce((sum, load) => sum + load.chicksOut, 0)
  const avgHatchRate =
    completedLoads.length > 0
      ? completedLoads.reduce((sum, load) => sum + load.hatchRatePct, 0) / completedLoads.length
      : 0

  const kpis = [
    {
      title: "Huevos Fértiles Recibidos",
      value: totalEggsFertile.toLocaleString(),
      change: 12.5,
      description: "vs mes anterior",
    },
    {
      title: "Tasa de Eclosión Promedio",
      value: `${avgHatchRate.toFixed(1)}%`,
      change: 2.3,
      description: "vs objetivo 85%",
    },
    {
      title: "Pollitos BB Entregados",
      value: totalChicksOut.toLocaleString(),
      change: 8.7,
      description: "vs mes anterior",
    },
    {
      title: "Cargas Activas",
      value: hatchLoads.filter((load) => load.status === "incubando").length.toString(),
      change: 0,
      description: "en proceso",
    },
  ]

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{kpi.title}</CardTitle>
            {getTrendIcon(kpi.change)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{kpi.value}</div>
            <p className="text-xs text-gray-600 mt-1">
              {kpi.change !== 0 && (
                <span className={`font-medium ${getTrendColor(kpi.change)}`}>
                  {kpi.change > 0 ? "+" : ""}
                  {kpi.change}%{" "}
                </span>
              )}
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
