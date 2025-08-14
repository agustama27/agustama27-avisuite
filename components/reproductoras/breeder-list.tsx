"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, BarChart3, Search } from "lucide-react"
import { listBreederBatches } from "@/app/utils"
import type { BreederBatch, BreederPhase } from "@/types/domain"

interface BreederListProps {
  phase: BreederPhase
  onEditMetrics: (batchId: string) => void
}

export function BreederList({ phase, onEditMetrics }: BreederListProps) {
  const [batches, setBatches] = useState<BreederBatch[]>([])
  const [filteredBatches, setFilteredBatches] = useState<BreederBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [geneticFilter, setGeneticFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await listBreederBatches()
        const phaseBatches = data.filter((batch) => batch.phase === phase)
        setBatches(phaseBatches)
        setFilteredBatches(phaseBatches)
      } catch (error) {
        console.error("Error fetching batches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [phase])

  useEffect(() => {
    let filtered = batches

    if (searchTerm) {
      filtered = filtered.filter(
        (batch) =>
          batch.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.houseId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (geneticFilter !== "all") {
      filtered = filtered.filter((batch) => batch.genetic === geneticFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((batch) => batch.status === statusFilter)
    }

    setFilteredBatches(filtered)
  }, [batches, searchTerm, geneticFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "activo":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Activo</Badge>
      case "finalizado":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Finalizado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getHouseTypeBadge = (houseType: string) => {
    switch (houseType) {
      case "propio":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Propio</Badge>
      case "alquilado":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Alquilado</Badge>
      case "integrado":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Integrado</Badge>
      default:
        return <Badge variant="outline">{houseType}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-yellow-100 rounded animate-pulse" />
        <div className="h-4 bg-yellow-100 rounded animate-pulse" />
        <div className="h-4 bg-yellow-100 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por código o galpón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-yellow-300 focus:border-yellow-500"
          />
        </div>
        <Select value={geneticFilter} onValueChange={setGeneticFilter}>
          <SelectTrigger className="w-full sm:w-32 border-yellow-300">
            <SelectValue placeholder="Genética" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Ross">Ross</SelectItem>
            <SelectItem value="Cobb">Cobb</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32 border-yellow-300">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-yellow-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-50">
              <TableHead className="text-yellow-800">Código</TableHead>
              <TableHead className="text-yellow-800">Genética</TableHead>
              <TableHead className="text-yellow-800">Semana</TableHead>
              <TableHead className="text-yellow-800">Galpón</TableHead>
              <TableHead className="text-yellow-800">Tipo</TableHead>
              <TableHead className="text-yellow-800">Estado</TableHead>
              <TableHead className="text-yellow-800">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron lotes para esta fase
                </TableCell>
              </TableRow>
            ) : (
              filteredBatches.map((batch) => (
                <TableRow key={batch.id} className="hover:bg-yellow-50">
                  <TableCell className="font-medium">{batch.codigo}</TableCell>
                  <TableCell>{batch.genetic}</TableCell>
                  <TableCell>{batch.currentWeek}</TableCell>
                  <TableCell>{batch.houseId}</TableCell>
                  <TableCell>{getHouseTypeBadge(batch.houseType)}</TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditMetrics(batch.id)}
                        className="border-yellow-300 hover:bg-yellow-50"
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Métricas
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 hover:bg-yellow-50 bg-transparent"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
