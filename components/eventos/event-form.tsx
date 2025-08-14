"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface EventFormProps {
  onClose: () => void
  onSave: () => void
}

export function EventForm({ onClose, onSave }: EventFormProps) {
  const [formData, setFormData] = useState({
    fecha: undefined as Date | undefined,
    tipoEvento: "",
    lote: "",
    descripcion: "",
    medicamento: "",
    dosis: "",
    veterinario: "",
    observaciones: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving event:", formData)
    onSave()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">Nuevo Evento</DialogTitle>
          <DialogDescription>Registra un nuevo evento o tratamiento</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del Evento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-yellow-300 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fecha ? format(formData.fecha, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fecha}
                    onSelect={(date) => setFormData({ ...formData, fecha: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-evento">Tipo de Evento</Label>
              <Select
                value={formData.tipoEvento}
                onValueChange={(value) => setFormData({ ...formData, tipoEvento: value })}
              >
                <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacunacion">Vacunación</SelectItem>
                  <SelectItem value="medicacion">Medicación</SelectItem>
                  <SelectItem value="observacion">Observación Veterinaria</SelectItem>
                  <SelectItem value="pesaje">Pesaje</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lote">Lote Afectado</Label>
            <Select value={formData.lote} onValueChange={(value) => setFormData({ ...formData, lote: value })}>
              <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAR-001">PAR-001 - Galpón 1</SelectItem>
                <SelectItem value="PAR-002">PAR-002 - Galpón 2</SelectItem>
                <SelectItem value="PAR-003">PAR-003 - Galpón 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Evento</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el evento o tratamiento realizado"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="border-yellow-300 focus:border-yellow-500"
            />
          </div>

          {(formData.tipoEvento === "vacunacion" || formData.tipoEvento === "medicacion") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicamento">Medicamento/Vacuna</Label>
                <Input
                  id="medicamento"
                  placeholder="Nombre del producto"
                  value={formData.medicamento}
                  onChange={(e) => setFormData({ ...formData, medicamento: e.target.value })}
                  className="border-yellow-300 focus:border-yellow-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosis">Dosis</Label>
                <Input
                  id="dosis"
                  placeholder="Cantidad aplicada"
                  value={formData.dosis}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                  className="border-yellow-300 focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="veterinario">Veterinario Responsable</Label>
            <Input
              id="veterinario"
              placeholder="Nombre del veterinario"
              value={formData.veterinario}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              className="border-yellow-300 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones"
              placeholder="Observaciones, efectos secundarios, etc."
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="border-yellow-300 focus:border-yellow-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
              Guardar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
