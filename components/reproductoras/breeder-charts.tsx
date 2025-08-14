"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import type { BreederPhase } from "@/types/domain"

interface BreederChartsProps {
  phase: BreederPhase
}

export function BreederCharts({ phase }: BreederChartsProps) {
  const crianzaData = [
    { week: 1, peso: 0.18, pesoEstandar: 0.18, mortalidad: 0.5 },
    { week: 2, peso: 0.37, pesoEstandar: 0.36, mortalidad: 1.2 },
    { week: 3, peso: 0.64, pesoEstandar: 0.62, mortalidad: 1.8 },
    { week: 4, peso: 0.98, pesoEstandar: 0.95, mortalidad: 2.3 },
    { week: 5, peso: 1.38, pesoEstandar: 1.35, mortalidad: 2.8 },
    { week: 6, peso: 1.82, pesoEstandar: 1.8, mortalidad: 3.2 },
    { week: 7, peso: 2.31, pesoEstandar: 2.28, mortalidad: 3.6 },
    { week: 8, peso: 2.85, pesoEstandar: 2.8, mortalidad: 4.0 },
  ]

  const posturaData = [
    { week: 21, huevos: 2850, huevosEstandar: 2800, fertilidad: 88.5 },
    { week: 22, huevos: 4200, huevosEstandar: 4100, fertilidad: 89.2 },
    { week: 23, huevos: 5800, huevosEstandar: 5700, fertilidad: 89.8 },
    { week: 24, huevos: 7200, huevosEstandar: 7000, fertilidad: 90.1 },
    { week: 25, huevos: 8100, huevosEstandar: 8000, fertilidad: 89.9 },
    { week: 26, huevos: 8450, huevosEstandar: 8300, fertilidad: 89.5 },
    { week: 27, huevos: 8600, huevosEstandar: 8500, fertilidad: 89.2 },
    { week: 28, huevos: 8550, huevosEstandar: 8400, fertilidad: 88.8 },
  ]

  if (phase === "crianza") {
    return (
      <div className="space-y-6">
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Peso Semanal vs Estándar</CardTitle>
            <CardDescription>Comparación del peso corporal real vs estándar genético</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={crianzaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                <XAxis
                  dataKey="week"
                  stroke="#92400e"
                  label={{ value: "Semana", position: "insideBottom", offset: -5 }}
                />
                <YAxis stroke="#92400e" label={{ value: "Peso (kg)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fbbf24",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#eab308"
                  strokeWidth={2}
                  name="Peso Real"
                  dot={{ fill: "#eab308", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="pesoEstandar"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Peso Estándar"
                  dot={{ fill: "#94a3b8", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Mortalidad Acumulada</CardTitle>
            <CardDescription>Evolución de la mortalidad acumulada por semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={crianzaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                <XAxis
                  dataKey="week"
                  stroke="#92400e"
                  label={{ value: "Semana", position: "insideBottom", offset: -5 }}
                />
                <YAxis stroke="#92400e" label={{ value: "Mortalidad (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fbbf24",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mortalidad"
                  stroke="#ef4444"
                  fill="#fecaca"
                  fillOpacity={0.6}
                  name="Mortalidad %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Producción de Huevos vs Estándar</CardTitle>
          <CardDescription>Producción diaria de huevos comparada con el estándar</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={posturaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
              <XAxis
                dataKey="week"
                stroke="#92400e"
                label={{ value: "Semana", position: "insideBottom", offset: -5 }}
              />
              <YAxis stroke="#92400e" label={{ value: "Huevos/día", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fbbf24",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="huevos"
                stroke="#eab308"
                strokeWidth={2}
                name="Producción Real"
                dot={{ fill: "#eab308", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="huevosEstandar"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Producción Estándar"
                dot={{ fill: "#94a3b8", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Fertilidad</CardTitle>
          <CardDescription>Porcentaje de fertilidad de los huevos producidos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={posturaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
              <XAxis
                dataKey="week"
                stroke="#92400e"
                label={{ value: "Semana", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                stroke="#92400e"
                domain={[85, 92]}
                label={{ value: "Fertilidad (%)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fbbf24",
                  borderRadius: "6px",
                }}
              />
              <Area
                type="monotone"
                dataKey="fertilidad"
                stroke="#10b981"
                fill="#a7f3d0"
                fillOpacity={0.6}
                name="Fertilidad %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
