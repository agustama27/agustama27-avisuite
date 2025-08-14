"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewBatchForm } from "@/components/ciclo-productivo/new-batch-form"
import { WeeklyTimeline } from "@/components/ciclo-productivo/weekly-timeline"
import { BatchList } from "@/components/ciclo-productivo/batch-list"

export default function CicloProductivoPage() {
  const [showNewBatchForm, setShowNewBatchForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ciclo Productivo</h1>
          <p className="text-gray-600">Gestión completa del ciclo de vida de las parvadas</p>
        </div>
        <Button onClick={() => setShowNewBatchForm(true)} className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lote
        </Button>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Vista Semanal
          </TabsTrigger>
          <TabsTrigger value="batches" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Lotes Activos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <WeeklyTimeline />
        </TabsContent>

        <TabsContent value="batches">
          <BatchList />
        </TabsContent>
      </Tabs>

      {showNewBatchForm && (
        <NewBatchForm onClose={() => setShowNewBatchForm(false)} onSave={() => setShowNewBatchForm(false)} />
      )}
    </div>
  )
}
