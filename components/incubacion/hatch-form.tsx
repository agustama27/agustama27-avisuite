"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { HatchLoad, BreederBatch } from "@/types/domain"
import { createHatchLoad, listBreederBatches } from "@/app/utils"

interface HatchFormProps {
  hatchLoad?: HatchLoad
  onClose: () => void
  onSave: () => void
}

export function HatchForm({ hatchLoad, onClose, onSave }: HatchFormProps) {
  const [loading, setLoading] = useState(false)
  const [breederBatches, setBreederBatches] = useState<BreederBatch[]>([])
  const [formData, setFormData] = useState({
    breederBatchId: hatchLoad?.breederBatchId || "",
    eggsFertile: hatchLoad?.eggsFertile?.toString() || "",
    dateIn: hatchLoad?.dateIn ? new Date(hatchLoad.dateIn) : (undefined as Date | undefined),
    dateOut: hatchLoad?.dateOut ? new Date(hatchLoad.dateOut) : (undefined as Date | undefined),
    hatchRatePct: hatchLoad?.hatchRatePct?.toString() || "",
    chicksOut: hatchLoad?.chicksOut?.toString() || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadBreederBatches()
  }, [])

  const loadBreederBatches = async () => {
    try {
      const batches = await listBreederBatches()
      // Only show batches in postura phase
      setBreederBatches(batches.filter((batch) => batch.phase === "postura"))
    } catch (error) {
      console.error("Error loading breeder batches:", error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.breederBatchId) {
      newErrors.breederBatchId = "El lote reproductora es requerido"
    }
    if (!formData.eggsFertile || isNaN(Number(formData.eggsFertile))) {
      newErrors.eggsFertile = "La cantidad de huevos debe ser un número válido"
    }
    if (!formData.dateIn) {
      newErrors.dateIn = "La fecha de entrada es requerida"
    }
    if (
      formData.hatchRatePct &&
      (isNaN(Number(formData.hatchRatePct)) || Number(formData.hatchRatePct) < 0 || Number(formData.hatchRatePct) > 100)
    ) {
      newErrors.hatchRatePct = "La tasa de eclosión debe estar entre 0 y 100%"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const selectedBatch = breederBatches.find((batch) => batch.id === formData.breederBatchId)

      await createHatchLoad({
        breederBatchId: formData.breederBatchId,
        breederBatchCode: selectedBatch?.codigo || "",
        eggsFertile: Number(formData.eggsFertile),
        dateIn: formData.dateIn!.toISOString().split("T")[0],
        dateOut: formData.dateOut?.toISOString().split("T")[0] || "",
        hatchRatePct: Number(formData.hatchRatePct) || 0,
        chicksOut: Number(formData.chicksOut) || 0,
        genetic: selectedBatch?.genetic || "Ross",
      })
      onSave()
    } catch (error) {
      console.error("Error saving hatch load:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-calculate chicks out when hatch rate changes
  const handleHatchRateChange = (value: string) => {
    setFormData({ ...formData, hatchRatePct: value })
    if (value && formData.eggsFertile) {
      const chicksOut = Math.round(Number(formData.eggsFertile) * (Number(value) / 100))
      setFormData((prev) => ({ ...prev, hatchRatePct: value, chicksOut: chicksOut.toString() }))
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">
            {hatchLoad ? "Editar Carga de Incubación" : "Nueva Carga de Incubación"}
          </DialogTitle>
          <DialogDescription>
            {hatchLoad ? "Modifica los datos de la carga" : "Registra una nueva carga de incubación"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="breederBatch">Lote Reproductora *</Label>
            <Select
              value={formData.breederBatchId}
              onValueChange={(value) => setFormData({ ...formData, breederBatchId: value })}
            >
              <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Seleccionar lote reproductora" />
              </SelectTrigger>
              <SelectContent>
                {breederBatches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.codigo} - {batch.genetic} (Semana {batch.currentWeek})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.breederBatchId && <p className="text-sm text-red-600">{errors.breederBatchId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eggsFertile">Huevos Fértiles *</Label>
              <Input
                id="eggsFertile"
                type="number"
                value={formData.eggsFertile}
                onChange={(e) => setFormData({ ...formData, eggsFertile: e.target.value })}
                className="border-yellow-300 focus:border-yellow-500"
                placeholder="15000"
              />
              {errors.eggsFertile && <p className="text-sm text-red-600">{errors.eggsFertile}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hatchRate">Tasa de Eclosión (%)</Label>
              <Input
                id="hatchRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.hatchRatePct}
                onChange={(e) => handleHatchRateChange(e.target.value)}
                className="border-yellow-300 focus:border-yellow-500"
                placeholder="87.5"
              />
              {errors.hatchRatePct && <p className="text-sm text-red-600">{errors.hatchRatePct}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateIn">Fecha de Entrada *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-yellow-300 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateIn ? format(formData.dateIn, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateIn}
                    onSelect={(date) => setFormData({ ...formData, dateIn: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateIn && <p className="text-sm text-red-600">{errors.dateIn}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOut">Fecha de Salida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-yellow-300 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOut ? (
                      format(formData.dateOut, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOut}
                    onSelect={(date) => setFormData({ ...formData, dateOut: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chicksOut">Pollitos BB Entregados</Label>
            <Input
              id="chicksOut"
              type="number"
              value={formData.chicksOut}
              onChange={(e) => setFormData({ ...formData, chicksOut: e.target.value })}
              className="border-yellow-300 focus:border-yellow-500"
              placeholder="13125"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600">
              {loading ? "Guardando..." : hatchLoad ? "Actualizar" : "Crear"} Carga
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
