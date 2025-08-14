"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Syringe, Stethoscope, Scale, Wrench } from "lucide-react"

const events = [
  {
    id: 1,
    fecha: "2024-01-20",
    tipo: "vacunacion",
    lote: "PAR-001",
    descripcion: "Vacunación Newcastle + Bronquitis",
    medicamento: "Nobilis IB Ma5 + Clone 30",
    dosis: "1 dosis por ave",
    veterinario: "Dr. García",
    observaciones: "Aplicación sin complicaciones",
  },
  {
    id: 2,
    fecha: "2024-01-19",
    tipo: "medicacion",
    lote: "PAR-002",
    descripcion: "Tratamiento preventivo coccidiosis",
    medicamento: "Amprolium 20%",
    dosis: "1g/L agua por 5 días",
    veterinario: "Dr. Martínez",
    observaciones: "Monitorear consumo de agua",
  },
  {
    id: 3,
    fecha: "2024-01-18",
    tipo: "observacion",
    lote: "PAR-003",
    descripcion: "Control rutinario de salud",
    veterinario: "Dr. García",
    observaciones: "Lote en excelentes condiciones, sin signos de enfermedad",
  },
  {
    id: 4,
    fecha: "2024-01-17",
    tipo: "pesaje",
    lote: "PAR-001",
    descripcion: "Pesaje semanal - Semana 4",
    observaciones: "Peso promedio: 720g, dentro del rango esperado",
  },
]

const getEventIcon = (tipo: string) => {
  switch (tipo) {
    case "vacunacion":
      return <Syringe className="h-4 w-4" />
    case "medicacion":
      return <Syringe className="h-4 w-4" />
    case "observacion":
      return <Stethoscope className="h-4 w-4" />
    case "pesaje":
      return <Scale className="h-4 w-4" />
    case "mantenimiento":
      return <Wrench className="h-4 w-4" />
    default:
      return <Stethoscope className="h-4 w-4" />
  }
}

const getEventBadge = (tipo: string) => {
  switch (tipo) {
    case "vacunacion":
      return <Badge className="bg-blue-100 text-blue-800">Vacunación</Badge>
    case "medicacion":
      return <Badge className="bg-green-100 text-green-800">Medicación</Badge>
    case "observacion":
      return <Badge className="bg-purple-100 text-purple-800">Observación</Badge>
    case "pesaje":
      return <Badge className="bg-yellow-100 text-yellow-800">Pesaje</Badge>
    case "mantenimiento":
      return <Badge className="bg-gray-100 text-gray-800">Mantenimiento</Badge>
    default:
      return <Badge variant="outline">{tipo}</Badge>
  }
}

export function EventsList() {
  return (
    <div className="space-y-4">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Historial de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-600">{getEventIcon(event.tipo)}</div>
                    <div>
                      <h4 className="font-medium">{event.descripcion}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(event.fecha).toLocaleDateString("es-ES")} - {event.lote}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEventBadge(event.tipo)}
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {event.medicamento && (
                    <div>
                      <span className="font-medium text-gray-700">Medicamento:</span>
                      <p>{event.medicamento}</p>
                    </div>
                  )}
                  {event.dosis && (
                    <div>
                      <span className="font-medium text-gray-700">Dosis:</span>
                      <p>{event.dosis}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Veterinario:</span>
                    <p>{event.veterinario}</p>
                  </div>
                </div>

                {event.observaciones && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Observaciones:</span>
                    <p className="text-sm text-gray-600 mt-1">{event.observaciones}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
