"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createBreederBatch } from "@/app/utils"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  codigo: z.string().min(1, "Código es requerido"),
  genetic: z.enum(["Ross", "Cobb"], {
    required_error: "Selecciona una genética",
  }),
  startDate: z.string().min(1, "Fecha de inicio es requerida"),
  malesPct: z.number().min(5).max(15, "% de machos debe estar entre 5% y 15%"),
  houseId: z.string().min(1, "Selecciona un galpón"),
  houseType: z.enum(["propio", "alquilado", "integrado"], {
    required_error: "Selecciona el tipo de galpón",
  }),
  feedingPlan: z.string().optional(),
  phase: z.enum(["crianza", "postura"], {
    required_error: "Selecciona la fase",
  }),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface BreederBatchFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BreederBatchForm({ open, onOpenChange }: BreederBatchFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: "",
      genetic: "Ross",
      startDate: "",
      malesPct: 8,
      houseId: "",
      houseType: "propio",
      feedingPlan: "",
      phase: "crianza",
      notes: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await createBreederBatch(data)
      toast({
        title: "Lote creado",
        description: "El lote reproductor ha sido creado exitosamente.",
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el lote. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">Nuevo Lote Reproductor</DialogTitle>
          <DialogDescription>Registra un nuevo lote de reproductoras con sus datos básicos</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código del Lote</FormLabel>
                    <FormControl>
                      <Input placeholder="REP-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genetic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genética</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona genética" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ross">Ross</SelectItem>
                        <SelectItem value="Cobb">Cobb</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="malesPct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% de Machos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        max="15"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Entre 5% y 15%</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="houseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Galpón</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona galpón" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="galpon-1">Galpón 1</SelectItem>
                        <SelectItem value="galpon-2">Galpón 2</SelectItem>
                        <SelectItem value="galpon-3">Galpón 3</SelectItem>
                        <SelectItem value="galpon-4">Galpón 4</SelectItem>
                        <SelectItem value="galpon-5">Galpón 5</SelectItem>
                        <SelectItem value="galpon-6">Galpón 6</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Galpón</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="propio">Propio</SelectItem>
                        <SelectItem value="alquilado">Alquilado</SelectItem>
                        <SelectItem value="integrado">Integrado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fase Inicial</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona fase" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="crianza">Crianza (0-20 semanas)</SelectItem>
                      <SelectItem value="postura">Postura (21-65 semanas)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedingPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan de Alimentación</FormLabel>
                  <FormControl>
                    <Input placeholder="Plan estándar Ross reproductoras" {...field} />
                  </FormControl>
                  <FormDescription>Opcional: describe el plan alimentario</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observaciones adicionales..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                {isLoading ? "Creando..." : "Crear Lote"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
