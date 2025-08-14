"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

const fcrData = [
  { week: 1, actual: 1.2, target: 1.15, lote1: 1.18, lote2: 1.22, lote3: 1.2 },
  { week: 2, actual: 1.35, target: 1.3, lote1: 1.32, lote2: 1.38, lote3: 1.35 },
  { week: 3, actual: 1.48, target: 1.45, lote1: 1.45, lote2: 1.52, lote3: 1.47 },
  { week: 4, actual: 1.62, target: 1.58, lote1: 1.58, lote2: 1.67, lote3: 1.61 },
  { week: 5, actual: 1.74, target: 1.7, lote1: 1.7, lote2: 1.79, lote3: 1.73 },
  { week: 6, actual: 1.85, target: 1.8, lote1: 1.81, lote2: 1.9, lote3: 1.84 },
]

const costPerKgData = [
  { week: 1, costo: 2.8, objetivo: 2.5 },
  { week: 2, costo: 3.2, objetivo: 2.8 },
  { week: 3, costo: 3.6, objetivo: 3.2 },
  { week: 4, costo: 4.1, objetivo: 3.8 },
  { week: 5, costo: 4.5, objetivo: 4.2 },
  { week: 6, costo: 4.8, objetivo: 4.5 },
]

export function ConversionCharts() {
  return (
    <div className="space-y-6">
      {/* FCR Comparison */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Conversión Alimenticia (FCR)</CardTitle>
          <CardDescription>Seguimiento del FCR por semana con línea objetivo (1.5-1.8)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fcrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "FCR", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />

                {/* Target range */}
                <ReferenceLine y={1.5} stroke="#22c55e" strokeDasharray="5 5" label="Objetivo Mín (1.5)" />
                <ReferenceLine y={1.8} stroke="#ef4444" strokeDasharray="5 5" label="Objetivo Máx (1.8)" />

                <Line type="monotone" dataKey="lote1" stroke="#3b82f6" name="Lote PAR-001" strokeWidth={2} />
                <Line type="monotone" dataKey="lote2" stroke="#ef4444" name="Lote PAR-002" strokeWidth={2} />
                <Line type="monotone" dataKey="lote3" stroke="#10b981" name="Lote PAR-003" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeDasharray="8 8"
                  name="Meta"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost per Kg */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Costo por Kilogramo Producido</CardTitle>
          <CardDescription>Evolución del costo de producción por kg de peso vivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costPerKgData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Costo ($/kg)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`$${value}`, ""]} />
                <Legend />

                <Line type="monotone" dataKey="costo" stroke="#eab308" name="Costo Real" strokeWidth={3} />
                <Line
                  type="monotone"
                  dataKey="objetivo"
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

      {/* FCR Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">FCR Promedio</p>
              <p className="text-2xl font-bold text-yellow-600">1.67</p>
              <p className="text-xs text-green-600">↓ 0.03 vs semana anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Mejor FCR</p>
              <p className="text-2xl font-bold text-green-600">1.58</p>
              <p className="text-xs text-gray-500">Lote PAR-001</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Costo/kg Actual</p>
              <p className="text-2xl font-bold text-blue-600">$4.12</p>
              <p className="text-xs text-red-600">↑ $0.08 vs objetivo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Eficiencia vs Meta</p>
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-xs text-yellow-600">Dentro del rango</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
