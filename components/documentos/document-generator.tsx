"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { FileText, Download, FileSpreadsheet, Receipt, Truck } from "lucide-react"

const documentTypes = [
  {
    id: "mortalidad-senasa",
    name: "Informe de Mortalidad (SENASA)",
    description: "Reporte oficial de mortalidad para SENASA",
    icon: FileText,
    formats: ["PDF", "Excel"],
  },
  {
    id: "orden-faena",
    name: "Orden de Faena",
    description: "Documento para programación de faena",
    icon: Truck,
    formats: ["PDF"],
  },
  {
    id: "facturacion-dte",
    name: "Facturación DTE",
    description: "Documento tributario electrónico",
    icon: Receipt,
    formats: ["PDF", "XML"],
  },
  {
    id: "consumos-costos",
    name: "Consumos y Costos",
    description: "Reporte de consumos y análisis de costos",
    icon: FileSpreadsheet,
    formats: ["PDF", "Excel"],
  },
]

export function DocumentGenerator() {
  const [selectedType, setSelectedType] = useState("")
  const [selectedLote, setSelectedLote] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate document generation
    setTimeout(() => {
      setIsGenerating(false)
      // Simulate download
      const selectedDoc = documentTypes.find((doc) => doc.id === selectedType)
      alert(`Generando ${selectedDoc?.name} en formato ${selectedFormat}`)
    }, 2000)
  }

  const selectedDocument = documentTypes.find((doc) => doc.id === selectedType)

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generar Documentos
        </CardTitle>
        <CardDescription>Crea documentos oficiales y reportes personalizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Documento</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="border-yellow-300">
              <SelectValue placeholder="Seleccionar tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  <div className="flex items-center gap-2">
                    <doc.icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType && (
          <>
            <div className="space-y-2">
              <Label>Lote</Label>
              <Select value={selectedLote} onValueChange={setSelectedLote}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Seleccionar lote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAR-001">PAR-001 - Galpón 1</SelectItem>
                  <SelectItem value="PAR-002">PAR-002 - Galpón 2</SelectItem>
                  <SelectItem value="PAR-003">PAR-003 - Galpón 3</SelectItem>
                  <SelectItem value="todos">Todos los lotes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="border-yellow-300">
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDocument?.formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!selectedType || !selectedLote || !selectedFormat || isGenerating}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Generando..." : "Generar Documento"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
