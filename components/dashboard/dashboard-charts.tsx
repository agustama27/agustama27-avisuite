"use client"

import { useState, useEffect } from "react"
import { motion as m } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const weightData = [
  { week: 1, actual: 70, expected: 72 },
  { week: 2, actual: 120, expected: 125 },
  { week: 3, actual: 185, expected: 190 },
  { week: 4, actual: 270, expected: 275 },
  { week: 5, actual: 360, expected: 365 },
  { week: 6, actual: 460, expected: 470 },
  { week: 7, actual: 570, expected: 580 },
  { week: 8, actual: 680, expected: 690 },
  { week: 9, actual: 790, expected: 800 },
  { week: 10, actual: 900, expected: 910 },
]

const eggProductionData = [
  { week: 18, actual: 5, expected: 8 },
  { week: 19, actual: 25, expected: 30 },
  { week: 20, actual: 50, expected: 55 },
  { week: 21, actual: 70, expected: 75 },
  { week: 22, actual: 82, expected: 85 },
  { week: 23, actual: 88, expected: 90 },
  { week: 24, actual: 92, expected: 92 },
  { week: 25, actual: 93, expected: 93 },
  { week: 26, actual: 94, expected: 94 },
  { week: 27, actual: 94, expected: 94 },
]

const mortalityData = [
  { week: 1, actual: 0.8, expected: 0.7 },
  { week: 2, actual: 1.2, expected: 1.0 },
  { week: 3, actual: 1.5, expected: 1.3 },
  { week: 4, actual: 1.8, expected: 1.6 },
  { week: 5, actual: 2.0, expected: 1.9 },
  { week: 6, actual: 2.2, expected: 2.1 },
  { week: 7, actual: 2.4, expected: 2.3 },
  { week: 8, actual: 2.6, expected: 2.5 },
  { week: 9, actual: 2.8, expected: 2.7 },
  { week: 10, actual: 3.0, expected: 2.9 },
]

function ChartSkeleton() {
  return (
    <div className="h-[350px] w-full flex items-center justify-center">
      <div className="space-y-4 w-full">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardCharts() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráficas de Tendencias</CardTitle>
        <CardDescription>Visualización de métricas clave de producción</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weight">Peso Promedio</TabsTrigger>
            <TabsTrigger value="production">Producción de Huevos</TabsTrigger>
            <TabsTrigger value="mortality">Mortalidad Acumulada</TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="pt-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Peso (g)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Peso Actual" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#9ca3af"
                      name="Peso Esperado"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </m.div>
          </TabsContent>

          <TabsContent value="production" className="pt-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={eggProductionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Producción (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Producción Actual" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#9ca3af"
                      name="Producción Esperada"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </m.div>
          </TabsContent>

          <TabsContent value="mortality" className="pt-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={mortalityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Mortalidad (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Mortalidad Actual" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#9ca3af"
                      name="Mortalidad Esperada"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </m.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
