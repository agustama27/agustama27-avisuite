"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Calendar } from "lucide-react"

const activeBatches = [
  {
    id: "PAR-001",
    fechaIngreso: "2024-01-15",
    cantidadInicial: 5000,
    cantidadActual: 4850,
    genetica: "Ross 308",
    galpon: "Galpón 1",
    semanaActual: 4,
    pesoPromedio: 720,
    mortalidad: 3.0,
    status: "activo",
  },
  {
    id: "PAR-002",
    fechaIngreso: "2024-01-08",
    cantidadInicial: 4800,
    cantidadActual: 4680,
    genetica: "Cobb 500",
    galpon: "Galpón 2",
    semanaActual: 5,
    pesoPromedio: 980,
    mortalidad: 2.5,
    status: "activo",
  },
  {
    id: "PAR-003",
    fechaIngreso: "2023-10-20",
    cantidadInicial: 5200,
    cantidadActual: 4950,
    genetica: "Ross 308",
    galpon: "Galpón 3",
    semanaActual: 24,
    pesoPromedio: 1850,
    mortalidad: 4.8,
    status: "produccion",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "activo":
      return <Badge className="bg-blue-100 text-blue-800">Crecimiento</Badge>
    case "produccion":
      return <Badge className="bg-green-100 text-green-800">Producción</Badge>
    case "finalizado":
      return <Badge className="bg-gray-100 text-gray-800">Finalizado</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function BatchList() {
  return (
    <div className="space-y-4">
      {activeBatches.map((batch) => (
        <Card key={batch.id} className="border-yellow-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-yellow-800">{batch.id}</CardTitle>
                {getStatusBadge(batch.status)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-yellow-300 bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline" className="border-yellow-300 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="border-yellow-300 bg-transparent">
                  <Calendar className="h-4 w-4 mr-1" />
                  Eventos
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha Ingreso</p>
                <p className="font-medium">{new Date(batch.fechaIngreso).toLocaleDateString("es-ES")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Genética</p>
                <p className="font-medium">{batch.genetica}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Galpón</p>
                <p className="font-medium">{batch.galpon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Semana Actual</p>
                <p className="font-medium text-yellow-600">{batch.semanaActual}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aves Actuales</p>
                <p className="font-medium">
                  {batch.cantidadActual.toLocaleString()} / {batch.cantidadInicial.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Peso Promedio</p>
                <p className="font-medium">{batch.pesoPromedio}g</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Mortalidad: </span>
                    <span className={`font-medium ${batch.mortalidad > 3 ? "text-red-600" : "text-green-600"}`}>
                      {batch.mortalidad}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Supervivencia: </span>
                    <span className="font-medium text-green-600">
                      {((batch.cantidadActual / batch.cantidadInicial) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Última actualización: hace 2 horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
