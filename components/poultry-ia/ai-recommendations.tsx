"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, AlertTriangle, TrendingUp, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

type Recommendation = {
  id: number
  type: "optimization" | "alert" | "maintenance" | "nutrition"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  implemented?: boolean
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    type: "nutrition",
    priority: "high",
    title: "Ajustar ración alimenticia",
    description:
      "Aumentar la ración en un 5% para mejorar el FCR. Los datos muestran que las aves están por debajo del peso objetivo.",
    impact: "Mejora estimada del FCR: 0.08 puntos",
  },
  {
    id: 2,
    type: "alert",
    priority: "high",
    title: "Revisar temperatura Galpón 2",
    description: "La temperatura nocturna ha estado 2°C por debajo del rango óptimo durante los últimos 3 días.",
    impact: "Prevención de estrés térmico y mejora en conversión",
  },
  {
    id: 3,
    type: "optimization",
    priority: "medium",
    title: "Optimizar horario de alimentación",
    description: "Cambiar el horario de alimentación a las 6:00 AM y 4:00 PM para maximizar la ingesta.",
    impact: "Incremento estimado en producción: 2-3%",
  },
  {
    id: 4,
    type: "maintenance",
    priority: "medium",
    title: "Mantenimiento preventivo bebederos",
    description: "Programar limpieza profunda de bebederos en Galpón 1 y 3 basado en patrones de consumo.",
    impact: "Reducción de riesgo de enfermedades: 15%",
  },
  {
    id: 5,
    type: "optimization",
    priority: "low",
    title: "Ajustar iluminación",
    description: "Reducir gradualmente las horas de luz a 14h para optimizar la fase de producción.",
    impact: "Mejora en uniformidad de postura",
  },
]

const getTypeIcon = (type: Recommendation["type"]) => {
  switch (type) {
    case "optimization":
      return <TrendingUp className="h-4 w-4" />
    case "alert":
      return <AlertTriangle className="h-4 w-4" />
    case "maintenance":
      return <Settings className="h-4 w-4" />
    case "nutrition":
      return <Lightbulb className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: Recommendation["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
  }
}

const getTypeColor = (type: Recommendation["type"]) => {
  switch (type) {
    case "optimization":
      return "text-blue-600"
    case "alert":
      return "text-red-600"
    case "maintenance":
      return "text-purple-600"
    case "nutrition":
      return "text-yellow-600"
  }
}

export function AIRecommendations() {
  const [implementedIds, setImplementedIds] = useState<number[]>([])

  const handleImplement = (id: number) => {
    setImplementedIds((prev) => [...prev, id])
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Lightbulb className="h-5 w-5" />
          Recomendaciones de IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="font-medium text-yellow-800 mb-1">Análisis actualizado hace 15 minutos</p>
          <p>Basado en datos de las últimas 72 horas y modelos predictivos avanzados.</p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recommendations.map((rec) => {
            const isImplemented = implementedIds.includes(rec.id)

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border transition-all ${
                  isImplemented
                    ? "bg-green-50 border-green-200 opacity-75"
                    : "bg-white border-gray-200 hover:border-yellow-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={getTypeColor(rec.type)}>{getTypeIcon(rec.type)}</div>
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  </div>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority === "high" ? "Alta" : rec.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 italic">{rec.impact}</p>
                  {isImplemented ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Implementado
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                      onClick={() => handleImplement(rec.id)}
                    >
                      Implementar
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
