"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const timelineData = [
  {
    week: 1,
    days: "1-7",
    pesoPromedio: 120,
    mortalidadAcumulada: 0.5,
    produccionHuevos: 0,
    status: "completed",
    eventos: ["Vacunación Newcastle", "Pesaje inicial"],
  },
  {
    week: 2,
    days: "8-14",
    pesoPromedio: 280,
    mortalidadAcumulada: 1.2,
    produccionHuevos: 0,
    status: "completed",
    eventos: ["Vacunación Gumboro", "Cambio de alimento"],
  },
  {
    week: 3,
    days: "15-21",
    pesoPromedio: 480,
    mortalidadAcumulada: 1.8,
    produccionHuevos: 0,
    status: "completed",
    eventos: ["Control veterinario"],
  },
  {
    week: 4,
    days: "22-28",
    pesoPromedio: 720,
    mortalidadAcumulada: 2.3,
    produccionHuevos: 0,
    status: "current",
    eventos: ["Pesaje semanal"],
  },
  {
    week: 5,
    days: "29-35",
    pesoPromedio: 980,
    mortalidadAcumulada: 2.8,
    produccionHuevos: 0,
    status: "pending",
    eventos: ["Vacunación refuerzo"],
  },
  {
    week: 18,
    days: "120-126",
    pesoPromedio: 1650,
    mortalidadAcumulada: 4.2,
    produccionHuevos: 5,
    status: "pending",
    eventos: ["Inicio de postura"],
  },
  {
    week: 24,
    days: "162-168",
    pesoPromedio: 1850,
    mortalidadAcumulada: 5.1,
    produccionHuevos: 85,
    status: "pending",
    eventos: ["Pico de producción"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "current":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "pending":
      return "bg-gray-100 text-gray-600 border-gray-200"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

export function WeeklyTimeline() {
  const currentWeek = 4
  const totalWeeks = 72 // Typical laying cycle

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Progreso del Ciclo - Lote PAR-001</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Semana {currentWeek} de {totalWeeks}
              </span>
              <span>{Math.round((currentWeek / totalWeeks) * 100)}% completado</span>
            </div>
            <Progress value={(currentWeek / totalWeeks) * 100} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {timelineData.map((week) => (
          <Card
            key={week.week}
            className={`border-l-4 ${
              week.status === "current"
                ? "border-l-yellow-500 bg-yellow-50"
                : week.status === "completed"
                  ? "border-l-green-500"
                  : "border-l-gray-300"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">Semana {week.week}</h3>
                  <Badge className={getStatusColor(week.status)}>
                    {week.status === "completed" ? "Completada" : week.status === "current" ? "Actual" : "Pendiente"}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">Días {week.days}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Peso Promedio</p>
                  <p className="text-xl font-bold text-yellow-600">{week.pesoPromedio}g</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Mortalidad Acum.</p>
                  <p className="text-xl font-bold text-red-600">{week.mortalidadAcumulada}%</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Producción Huevos</p>
                  <p className="text-xl font-bold text-blue-600">{week.produccionHuevos}%</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">FCR Estimado</p>
                  <p className="text-xl font-bold text-purple-600">
                    {week.week < 18 ? (1.2 + week.week * 0.02).toFixed(2) : "N/A"}
                  </p>
                </div>
              </div>

              {week.eventos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Eventos programados:</p>
                  <div className="flex flex-wrap gap-2">
                    {week.eventos.map((evento, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {evento}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
