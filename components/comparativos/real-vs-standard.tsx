"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { GeneticLine, Variable, StandardPoint } from "@/types/domain"
import { getRealVsStandard } from "@/app/utils"

interface RealVsStandardProps {
  genetic: GeneticLine
  variable: Variable
  weekRange: { start: number; end: number }
  onGeneticChange: (genetic: GeneticLine) => void
  onVariableChange: (variable: Variable) => void
  onWeekRangeChange: (range: { start: number; end: number }) => void
}

export function RealVsStandard({
  genetic,
  variable,
  weekRange,
  onGeneticChange,
  onVariableChange,
  onWeekRangeChange,
}: RealVsStandardProps) {
  const [data, setData] = useState<{ real: StandardPoint[]; standard: StandardPoint[] }>({ real: [], standard: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [genetic, variable, weekRange])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await getRealVsStandard({ genetic, variable, range: weekRange })
      setData(result)
    } catch (error) {
      console.error("Error loading comparison data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Combine real and standard data for chart
  const chartData = data.standard.map((standardPoint) => {
    const realPoint = data.real.find((r) => r.week === standardPoint.week)
    return {
      week: standardPoint.week,
      standard: standardPoint.value,
      real: realPoint?.value || 0,
      deviation: realPoint ? ((realPoint.value - standardPoint.value) / standardPoint.value) * 100 : 0,
    }
  })

  const getDeviationBadge = (deviation: number) => {
    const absDeviation = Math.abs(deviation)
    if (absDeviation <= 2) {
      return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    } else if (absDeviation <= 5) {
      return <Badge className="bg-yellow-100 text-yellow-800">Aceptable</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
    }
  }

  const avgDeviation =
    chartData.length > 0 ? chartData.reduce((sum, point) => sum + Math.abs(point.deviation), 0) / chartData.length : 0

  const getUnit = (variable: Variable) => {
    switch (variable) {
      case "peso":
        return "kg"
      case "mortalidad":
        return "%"
      case "consumo":
        return "kg"
      default:
        return ""
    }
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">Comparativo Real vs Estándar</CardTitle>
        <CardDescription>Análisis de desviación del rendimiento real contra estándares genéticos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Genética</Label>
            <Select value={genetic} onValueChange={onGeneticChange}>
              <SelectTrigger className="border-yellow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ross">Ross</SelectItem>
                <SelectItem value="Cobb">Cobb</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Variable</Label>
            <Select value={variable} onValueChange={onVariableChange}>
              <SelectTrigger className="border-yellow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peso">Peso</SelectItem>
                <SelectItem value="mortalidad">Mortalidad</SelectItem>
                <SelectItem value="consumo">Consumo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semana Inicio</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={weekRange.start}
              onChange={(e) => onWeekRangeChange({ ...weekRange, start: Number(e.target.value) })}
              className="border-yellow-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Semana Fin</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={weekRange.end}
              onChange={(e) => onWeekRangeChange({ ...weekRange, end: Number(e.target.value) })}
              className="border-yellow-300"
            />
          </div>
        </div>

        {/* Deviation Summary */}
        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-700">Desviación Promedio</p>
            <p className="text-2xl font-bold text-yellow-800">{avgDeviation.toFixed(1)}%</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Estado:</span>
            {getDeviationBadge(avgDeviation)}
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
              <YAxis
                label={{
                  value: `${variable.charAt(0).toUpperCase() + variable.slice(1)} (${getUnit(variable)})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} ${getUnit(variable)}`,
                  name === "real" ? "Real" : "Estándar",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="standard"
                stroke="#9ca3af"
                name="Estándar"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line type="monotone" dataKey="real" stroke="#eab308" name="Real" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deviation Details */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Detalles por Semana</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {chartData.slice(0, 8).map((point) => (
              <div key={point.week} className="text-center p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Semana {point.week}</p>
                <p
                  className={`text-sm font-medium ${
                    Math.abs(point.deviation) <= 2
                      ? "text-green-600"
                      : Math.abs(point.deviation) <= 5
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {point.deviation > 0 ? "+" : ""}
                  {point.deviation.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
