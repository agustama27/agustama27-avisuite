"use client"

import type React from "react"

import { useState } from "react"
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

interface NewBatchFormProps {
  onClose: () => void
  onSave: () => void
}

export function NewBatchForm({ onClose, onSave }: NewBatchFormProps) {
  const [formData, setFormData] = useState({
    fechaIngreso: undefined as Date | undefined,
    cantidadPollitos: "",
    genetica: "",
    proveedor: "",
    pesoInicial: "",
    galponAsignado: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the data
    console.log("Saving batch:", formData)
    onSave()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">Nuevo Lote</DialogTitle>
          <DialogDescription>Registra un nuevo lote de pollitos en el sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fecha-ingreso">Fecha de Ingreso</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-yellow-300 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.fechaIngreso ? (
                    format(formData.fechaIngreso, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.fechaIngreso}
                  onSelect={(date) => setFormData({ ...formData, fechaIngreso: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad de Pollitos</Label>
              <Input
                id="cantidad"
                type="number"
                placeholder="5000"
                value={formData.cantidadPollitos}
                onChange={(e) => setFormData({ ...formData, cantidadPollitos: e.target.value })}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso-inicial">Peso Inicial (g)</Label>
              <Input
                id="peso-inicial"
                type="number"
                placeholder="45"
                value={formData.pesoInicial}
                onChange={(e) => setFormData({ ...formData, pesoInicial: e.target.value })}
                className="border-yellow-300 focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genetica">Genética</Label>
            <Select value={formData.genetica} onValueChange={(value) => setFormData({ ...formData, genetica: value })}>
              <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Seleccionar genética" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ross-308">Ross 308</SelectItem>
                <SelectItem value="cobb-500">Cobb 500</SelectItem>
                <SelectItem value="hubbard">Hubbard</SelectItem>
                <SelectItem value="arbor-acres">Arbor Acres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor</Label>
            <Input
              id="proveedor"
              placeholder="Nombre del proveedor"
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
              className="border-yellow-300 focus:border-yellow-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="galpon">Galpón Asignado</Label>
            <Select
              value={formData.galponAsignado}
              onValueChange={(value) => setFormData({ ...formData, galponAsignado: value })}
            >
              <SelectTrigger className="border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Seleccionar galpón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="galpon-1">Galpón 1</SelectItem>
                <SelectItem value="galpon-2">Galpón 2</SelectItem>
                <SelectItem value="galpon-3">Galpón 3</SelectItem>
                <SelectItem value="galpon-4">Galpón 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
              Guardar Lote
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
