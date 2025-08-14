"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FlockTable } from "@/components/dashboard/flock-table"
import { mockFlockData } from "@/lib/mock-data"

export default function ParvadasPage() {
  const [filteredData, setFilteredData] = useState(mockFlockData)
  const [ageRange, setAgeRange] = useState({ min: "", max: "" })
  const [selectedGalpon, setSelectedGalpon] = useState("todos")

  const handleFilter = () => {
    let filtered = [...mockFlockData]

    if (ageRange.min !== "") {
      filtered = filtered.filter((flock) => flock.age >= Number.parseInt(ageRange.min))
    }

    if (ageRange.max !== "") {
      filtered = filtered.filter((flock) => flock.age <= Number.parseInt(ageRange.max))
    }

    if (selectedGalpon !== "todos") {
      filtered = filtered.filter((flock) => flock.galpon === Number.parseInt(selectedGalpon))
    }

    setFilteredData(filtered)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Detalle de Parvadas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-age">Edad mínima (semanas)</Label>
              <Input
                id="min-age"
                type="number"
                placeholder="Mínimo"
                value={ageRange.min}
                onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-age">Edad máxima (semanas)</Label>
              <Input
                id="max-age"
                type="number"
                placeholder="Máximo"
                value={ageRange.max}
                onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="galpon">Galpón</Label>
              <Select value={selectedGalpon} onValueChange={setSelectedGalpon}>
                <SelectTrigger id="galpon">
                  <SelectValue placeholder="Seleccionar galpón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los galpones</SelectItem>
                  <SelectItem value="1">Galpón 1</SelectItem>
                  <SelectItem value="2">Galpón 2</SelectItem>
                  <SelectItem value="3">Galpón 3</SelectItem>
                  <SelectItem value="4">Galpón 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleFilter} className="mt-4">
            Aplicar filtros
          </Button>
        </CardContent>
      </Card>

      <FlockTable data={filteredData} />
    </div>
  )
}
