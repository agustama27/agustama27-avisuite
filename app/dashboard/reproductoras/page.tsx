"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BreederBatchForm } from "@/components/reproductoras/breeder-batch-form"
import { BreederKPIs } from "@/components/reproductoras/breeder-kpis"
import { BreederCharts } from "@/components/reproductoras/breeder-charts"
import { BreederList } from "@/components/reproductoras/breeder-list"
import { BreederMetrics } from "@/components/reproductoras/breeder-metrics"

export default function ReproductorasPage() {
  const [showForm, setShowForm] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-800">Reproductoras</h1>
          <p className="text-gray-600">Gestión de lotes reproductores por fase productiva</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lote
        </Button>
      </div>

      <Tabs defaultValue="crianza" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-yellow-50 border-yellow-200">
          <TabsTrigger value="crianza" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Crianza (0-20 semanas)
          </TabsTrigger>
          <TabsTrigger value="postura" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Postura (21-65 semanas)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crianza" className="space-y-6">
          <BreederKPIs phase="crianza" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreederCharts phase="crianza" />
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">Lotes en Crianza</CardTitle>
                <CardDescription>Lotes activos de 0 a 20 semanas de edad</CardDescription>
              </CardHeader>
              <CardContent>
                <BreederList
                  phase="crianza"
                  onEditMetrics={(batchId) => {
                    setSelectedBatch(batchId)
                    setShowMetrics(true)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="postura" className="space-y-6">
          <BreederKPIs phase="postura" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreederCharts phase="postura" />
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">Lotes en Postura</CardTitle>
                <CardDescription>Lotes activos de 21 a 65 semanas de edad</CardDescription>
              </CardHeader>
              <CardContent>
                <BreederList
                  phase="postura"
                  onEditMetrics={(batchId) => {
                    setSelectedBatch(batchId)
                    setShowMetrics(true)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <BreederBatchForm open={showForm} onOpenChange={setShowForm} />

      <BreederMetrics open={showMetrics} onOpenChange={setShowMetrics} batchId={selectedBatch} />
    </div>
  )
}
