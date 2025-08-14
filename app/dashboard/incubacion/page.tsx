"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { HatchForm } from "@/components/incubacion/hatch-form"
import { HatchList } from "@/components/incubacion/hatch-list"
import { HatchKPIs } from "@/components/incubacion/hatch-kpis"
import type { HatchLoad } from "@/types/domain"
import { listHatchLoads } from "@/app/utils"

export default function IncubacionPage() {
  const [showHatchForm, setShowHatchForm] = useState(false)
  const [hatchLoads, setHatchLoads] = useState<HatchLoad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHatchLoads()
  }, [])

  const loadHatchLoads = async () => {
    try {
      const data = await listHatchLoads()
      setHatchLoads(data)
    } catch (error) {
      console.error("Error loading hatch loads:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incubación (Hatch)</h1>
          <p className="text-gray-600">Gestión de cargas de incubación y trazabilidad de huevos fértiles</p>
        </div>
        <Button onClick={() => setShowHatchForm(true)} className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Carga
        </Button>
      </div>

      <HatchKPIs hatchLoads={hatchLoads} />

      <HatchList hatchLoads={hatchLoads} onRefresh={loadHatchLoads} />

      {showHatchForm && (
        <HatchForm
          onClose={() => setShowHatchForm(false)}
          onSave={() => {
            setShowHatchForm(false)
            loadHatchLoads()
          }}
        />
      )}
    </div>
  )
}
