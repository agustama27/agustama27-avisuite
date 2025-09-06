"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportPreviewProps {
  reportType: "produccion" | "mortalidad" | "costos" | "completo"
  dateRange?: { from: Date; to: Date }
}

export function ReportPreview({ reportType, dateRange }: ReportPreviewProps) {
  const formatDateRange = () => {
    if (!dateRange) return "Sin rango de fechas"
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          Reporte de {reportType === "produccion" ? "Producción" : 
                      reportType === "mortalidad" ? "Mortalidad" : 
                      reportType === "costos" ? "Costos" : "Completo"}
        </h2>
        <p className="text-muted-foreground">{formatDateRange()}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vista Previa del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generando reporte de {reportType}...</p>
            </div>
            <div className="flex justify-center">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}