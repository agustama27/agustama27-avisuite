"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, FileSpreadsheet, Receipt, Truck } from "lucide-react"

const documentHistory = [
  {
    id: 1,
    name: "Informe Mortalidad SENASA - Enero 2024",
    type: "mortalidad-senasa",
    format: "PDF",
    lote: "PAR-001",
    fecha: "2024-01-31",
    size: "2.3 MB",
    status: "completed",
  },
  {
    id: 2,
    name: "Orden de Faena - Lote PAR-003",
    type: "orden-faena",
    format: "PDF",
    lote: "PAR-003",
    fecha: "2024-01-28",
    size: "1.8 MB",
    status: "completed",
  },
  {
    id: 3,
    name: "Consumos y Costos - Semana 4",
    type: "consumos-costos",
    format: "Excel",
    lote: "Todos",
    fecha: "2024-01-25",
    size: "4.1 MB",
    status: "completed",
  },
  {
    id: 4,
    name: "Facturación DTE - Enero",
    type: "facturacion-dte",
    format: "PDF",
    lote: "PAR-002",
    fecha: "2024-01-20",
    size: "1.2 MB",
    status: "processing",
  },
]

const getDocumentIcon = (type: string) => {
  switch (type) {
    case "mortalidad-senasa":
      return <FileText className="h-4 w-4" />
    case "orden-faena":
      return <Truck className="h-4 w-4" />
    case "facturacion-dte":
      return <Receipt className="h-4 w-4" />
    case "consumos-costos":
      return <FileSpreadsheet className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completado</Badge>
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-800">Error</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function DocumentHistory() {
  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">Historial de Documentos</CardTitle>
        <CardDescription>Documentos generados recientemente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documentHistory.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-yellow-600">{getDocumentIcon(doc.type)}</div>
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {doc.lote} • {new Date(doc.fecha).toLocaleDateString("es-ES")} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                {doc.status === "completed" && (
                  <>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
