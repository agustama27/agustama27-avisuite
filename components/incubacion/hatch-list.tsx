"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Edit, Truck } from "lucide-react"
import type { HatchLoad } from "@/types/domain"

interface HatchListProps {
  hatchLoads: HatchLoad[]
  onRefresh: () => void
}

export function HatchList({ hatchLoads, onRefresh }: HatchListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [geneticFilter, setGeneticFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLoads = hatchLoads.filter((load) => {
    const matchesSearch =
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.breederBatchCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenetic = geneticFilter === "all" || load.genetic === geneticFilter
    const matchesStatus = statusFilter === "all" || load.status === statusFilter

    return matchesSearch && matchesGenetic && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "incubando":
        return <Badge className="bg-blue-100 text-blue-800">Incubando</Badge>
      case "eclosionado":
        return <Badge className="bg-green-100 text-green-800">Eclosionado</Badge>
      case "entregado":
        return <Badge className="bg-gray-100 text-gray-800">Entregado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getHatchRateColor = (rate: number) => {
    if (rate >= 85) return "text-green-600"
    if (rate >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">Cargas de Incubación</CardTitle>
        <div className="flex gap-4 mt-4">
          <Input
            placeholder="Buscar por ID o lote reproductora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm border-yellow-300"
          />
          <Select value={geneticFilter} onValueChange={setGeneticFilter}>
            <SelectTrigger className="w-32 border-yellow-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Ross">Ross</SelectItem>
              <SelectItem value="Cobb">Cobb</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-yellow-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="incubando">Incubando</SelectItem>
              <SelectItem value="eclosionado">Eclosionado</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLoads.map((load) => (
            <div key={load.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-lg">{load.id}</h4>
                  <Badge className="bg-yellow-100 text-yellow-800">{load.genetic}</Badge>
                  {getStatusBadge(load.status)}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {load.status === "eclosionado" && (
                    <Button size="sm" variant="ghost" className="text-green-600">
                      <Truck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Lote Reproductora:</span>
                  <p>{load.breederBatchCode}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Huevos Fértiles:</span>
                  <p>{load.eggsFertile.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tasa Eclosión:</span>
                  <p className={`font-medium ${getHatchRateColor(load.hatchRatePct)}`}>
                    {load.hatchRatePct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Pollitos BB:</span>
                  <p>{load.chicksOut.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha Entrada:</span>
                  <p>{new Date(load.dateIn).toLocaleDateString("es-ES")}</p>
                </div>
              </div>

              {load.dateOut && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Fecha Salida: </span>
                    <span>{new Date(load.dateOut).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredLoads.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron cargas que coincidan con los filtros</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
