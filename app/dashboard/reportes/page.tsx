"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { ReportPreview } from "@/components/dashboard/report-preview"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"

export default function ReportesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: new Date(2023, 1, 25),
  })
  const [reportType, setReportType] = useState("produccion")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
    }, 1500)
  }

  const handleDownload = (format: string) => {
    // Simulate download
    alert(`Descargando reporte en formato ${format}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Métricas y Reportes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rango de fechas</Label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          <div className="space-y-2">
            <Label>Tipo de reporte</Label>
            <Tabs defaultValue="produccion" value={reportType} onValueChange={setReportType}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="produccion">Producción</TabsTrigger>
                <TabsTrigger value="mortalidad">Mortalidad</TabsTrigger>
                <TabsTrigger value="costos">Costos</TabsTrigger>
                <TabsTrigger value="completo">Completo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button onClick={handleGenerateReport} disabled={isGenerating || !date?.from || !date?.to} className="w-full">
            {isGenerating ? "Generando..." : "Generar Reporte"}
          </Button>
        </CardContent>
      </Card>

      {reportGenerated && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Vista Previa del Reporte</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload("excel")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")}>
                    <FilePdf className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportPreview reportType={reportType} dateRange={date} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
