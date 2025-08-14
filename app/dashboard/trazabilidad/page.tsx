"use client"

import { useState } from "react"
import { motion as m } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Download } from "lucide-react"
import { ChainView } from "@/components/trazabilidad/chain-view"
import type { TraceChain } from "@/types/domain"
import { getTraceChain } from "@/app/utils"
import { fadeInUp, buttonPress } from "@/components/motion/motion-presets"

export default function TrazabilidadPage() {
  const [broilerBatchId, setBroilerBatchId] = useState("")
  const [breederBatchId, setBreederBatchId] = useState("")
  const [traceData, setTraceData] = useState<TraceChain | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!broilerBatchId && !breederBatchId) return

    setLoading(true)
    try {
      const data = await getTraceChain({ broilerBatchId, breederBatchId })
      setTraceData(data)
    } catch (error) {
      console.error("Error loading trace chain:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    // Mock download functionality
    const reportData = {
      timestamp: new Date().toISOString(),
      broilerBatch: broilerBatchId,
      breederBatch: breederBatchId,
      traceData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trazabilidad_${broilerBatchId || breederBatchId}_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <m.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900">Trazabilidad</h1>
        <p className="text-gray-600">Seguimiento completo de la cadena productiva desde reproductoras hasta faena</p>
      </m.div>

      <m.div variants={fadeInUp}>
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Búsqueda de Trazabilidad</CardTitle>
            <CardDescription>
              Busca por lote de broilers o lote de reproductoras para ver la cadena completa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="broilerBatch">Lote de Broilers</Label>
                <Input
                  id="broilerBatch"
                  placeholder="PAR-001"
                  value={broilerBatchId}
                  onChange={(e) => setBroilerBatchId(e.target.value)}
                  className="border-yellow-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breederBatch">Lote de Reproductoras</Label>
                <Input
                  id="breederBatch"
                  placeholder="REP-001"
                  value={breederBatchId}
                  onChange={(e) => setBreederBatchId(e.target.value)}
                  className="border-yellow-300"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <m.button
                onClick={handleSearch}
                disabled={loading || (!broilerBatchId && !breederBatchId)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center gap-2"
                {...buttonPress}
              >
                <Search className="h-4 w-4" />
                {loading ? "Buscando..." : "Buscar Trazabilidad"}
              </m.button>

              {traceData && (
                <m.button
                  onClick={handleDownloadReport}
                  className="border border-yellow-300 bg-transparent hover:bg-yellow-50 px-4 py-2 rounded-md flex items-center gap-2"
                  {...buttonPress}
                >
                  <Download className="h-4 w-4" />
                  Descargar Reporte
                </m.button>
              )}
            </div>
          </CardContent>
        </Card>
      </m.div>

      {traceData && (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          <ChainView traceData={traceData} />
        </m.div>
      )}
    </m.div>
  )
}
