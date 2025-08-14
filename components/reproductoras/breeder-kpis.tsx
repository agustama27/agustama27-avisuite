"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Egg, Heart, Scale, Droplets } from "lucide-react"
import type { BreederPhase } from "@/types/domain"

interface KPICardProps {
  title: string
  value: string
  change: number
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

function KPICard({ title, value, change, unit, icon: Icon, description }: KPICardProps) {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-500"
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-yellow-800">
          {value}
          {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <span className={getTrendColor()}>{getTrendIcon()}</span>
          <span className={getTrendColor()}>
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          <span className="text-gray-500">vs semana anterior</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

interface BreederKPIsProps {
  phase: BreederPhase
}

export function BreederKPIs({ phase }: BreederKPIsProps) {
  const crianzaKPIs = [
    {
      title: "Peso Promedio",
      value: "1.85",
      change: 2.3,
      unit: "kg",
      icon: Scale,
      description: "Peso corporal promedio semanal",
    },
    {
      title: "Uniformidad",
      value: "87.5",
      change: 1.2,
      unit: "%",
      icon: TrendingUp,
      description: "Uniformidad del lote",
    },
    {
      title: "Mortalidad Diaria",
      value: "0.08",
      change: -0.5,
      unit: "%",
      icon: Heart,
      description: "Mortalidad promedio diaria",
    },
    {
      title: "Consumo de Agua",
      value: "285",
      change: 3.1,
      unit: "L/día",
      icon: Droplets,
      description: "Consumo diario de agua",
    },
  ]

  const posturaKPIs = [
    {
      title: "Huevos por Día",
      value: "8,450",
      change: 1.8,
      unit: "unidades",
      icon: Egg,
      description: "Producción diaria de huevos",
    },
    {
      title: "% Fértiles",
      value: "89.2",
      change: 0.5,
      unit: "%",
      icon: TrendingUp,
      description: "Porcentaje de huevos fértiles",
    },
    {
      title: "% Incubables",
      value: "85.7",
      change: -0.3,
      unit: "%",
      icon: Egg,
      description: "Porcentaje de huevos incubables",
    },
    {
      title: "Mortalidad Semanal",
      value: "0.45",
      change: -0.2,
      unit: "%",
      icon: Heart,
      description: "Mortalidad acumulada semanal",
    },
  ]

  const kpis = phase === "crianza" ? crianzaKPIs : posturaKPIs

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  )
}
