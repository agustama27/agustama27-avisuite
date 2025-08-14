"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"
import type { KPICloseout as KPICloseoutType } from "@/types/domain"
import { getKpisCloseout } from "@/app/utils"

export function KPICloseout() {
  const [selectedBatch, setSelectedBatch] = useState("PAR-001")
  const [kpis, setKpis] = useState<KPICloseoutType | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock FCR data by week
  const fcrWeeklyData = [
    { week: 1, fcr: 1.2, target: 1.15 },
    { week: 2, fcr: 1.35, target: 1.3 },
    { week: 3, fcr: 1.48, target: 1.45 },
    { week: 4, fcr: 1.62, target: 1.58 },
    { week: 5, fcr: 1.74, target: 1.7 },
    { week: 6, fcr: 1.85, target: 1.8 },
  ]

  useEffect(() => {
    loadKPIs()
  }, [selectedBatch])

  const loadKPIs = async () => {
    setLoading(true)
    try {
      const data = await getKpisCloseout(selectedBatch)
      setKpis(data)
    } catch (error) {
      console.error("Error loading KPIs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFEPBreakdown = () => {
    if (!kpis) return []

    return [
      { category: "Costo Pollito BB", value: 8500, percentage: 18.9 },
      { category: "Alimento", value: 28000, percentage: 62.2 },
      { category: "Mano de Obra", value: 3500, percentage: 7.8 },
      { category: "Servicios", value: 2800, percentage: 6.2 },
      { category: "Medicamentos", value: 1200, percentage: 2.7 },
      { category: "Otros", value: 1000, percentage: 2.2 },
    ]
  }

  const fepBreakdown = getFEPBreakdown()

  return (
    <div className="space-y-6">
      {/* Batch Selector */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            KPIs de Cierre y FCR
          </CardTitle>
          <CardDescription>Indicadores financieros y de eficiencia por lote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="space-y-2">
              <Label>Lote</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-40 border-yellow-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAR-001">PAR-001</SelectItem>
                  <SelectItem value="PAR-002">PAR-002</SelectItem>
                  <SelectItem value="PAR-003">PAR-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {kpis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">FCR Final</h4>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{kpis.fcr}</div>
                  <p className="text-xs text-gray-600">vs objetivo 1.65</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">FEP</h4>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{kpis.fep}</div>
                  <p className="text-xs text-gray-600">Índice Eficiencia Europea</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Costo Total</h4>
                    <TrendingDown className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">${kpis.totalCost.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">Costo total del lote</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Rentabilidad</h4>
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">${kpis.profit.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">{((kpis.profit / kpis.revenue) * 100).toFixed(1)}% margen</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FCR Weekly Chart */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">FCR Semanal</CardTitle>
            <CardDescription>Evolución del FCR por semana vs objetivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fcrWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "FCR", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="fcr" stroke="#eab308" name="FCR Real" strokeWidth={3} />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    name="Objetivo"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* FEP Breakdown */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Desglose de Costos (FEP)</CardTitle>
            <CardDescription>Distribución de costos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fepBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">${kpis?.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
