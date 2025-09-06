"use client"

import { useState, useEffect } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { saveBreederMetrics, getBreederMetrics } from "@/app/utils"
import { toast } from "@/hooks/use-toast"
import type { BreederMetrics } from "@/types/domain"

const formSchema = z.object({
  week: z.number().min(1).max(65),
  avgWeight: z.number().min(0),
  uniformityPct: z.number().min(0).max(100),
  dailyMortality: z.number().min(0),
  weeklyMortality: z.number().min(0),
  feedKg: z.number().min(0),
  waterL: z.number().min(0),
  eggsPerDay: z.number().min(0).optional(),
  fertilePct: z.number().min(0).max(100).optional(),
  hatchablePct: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface BreederMetricsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  batchId: string | null
}

export function BreederMetrics({ open, onOpenChange, batchId }: BreederMetricsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [existingMetrics, setExistingMetrics] = useState<BreederMetrics[]>([])
  const [selectedWeek, setSelectedWeek] = useState(1)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      week: 1,
      avgWeight: 0,
      uniformityPct: 85,
      dailyMortality: 0,
      weeklyMortality: 0,
      feedKg: 0,
      waterL: 0,
      eggsPerDay: undefined,
      fertilePct: undefined,
      hatchablePct: undefined,
      notes: "",
    },
  })

  useEffect(() => {
    if (open && batchId) {
      const fetchMetrics = async () => {
        try {
          const metrics = await getBreederMetrics(batchId)
          setExistingMetrics(metrics)
        } catch (error) {
          console.error("Error fetching metrics:", error)
        }
      }
      fetchMetrics()
    }
  }, [open, batchId])

  useEffect(() => {
    const weekMetrics = existingMetrics.find((m) => m.week === selectedWeek)
    if (weekMetrics) {
      form.reset({
        week: weekMetrics.week,
        avgWeight: weekMetrics.avgWeight,
        uniformityPct: weekMetrics.uniformityPct,
        dailyMortality: weekMetrics.dailyMortality,
        weeklyMortality: weekMetrics.weeklyMortality,
        feedKg: weekMetrics.feedKg,
        waterL: weekMetrics.waterL,
        eggsPerDay: weekMetrics.eggsPerDay,
        fertilePct: weekMetrics.fertilePct,
        hatchablePct: weekMetrics.hatchablePct,
        notes: weekMetrics.notes || "",
      })
    } else {
      form.reset({
        week: selectedWeek,
        avgWeight: 0,
        uniformityPct: 85,
        dailyMortality: 0,
        weeklyMortality: 0,
        feedKg: 0,
        waterL: 0,
        eggsPerDay: undefined,
        fertilePct: undefined,
        hatchablePct: undefined,
        notes: "",
      })
    }
  }, [selectedWeek, existingMetrics, form])

  const onSubmit = async (data: FormData) => {
    if (!batchId) return

    setIsLoading(true)
    try {
      await saveBreederMetrics({
        batchId,
        ...data,
      })
      toast({
        title: "Métricas guardadas",
        description: `Métricas de la semana ${data.week} guardadas exitosamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las métricas. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const weekOptions = Array.from({ length: 65 }, (_, i) => i + 1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-yellow-800">Métricas Semanales</DialogTitle>
          <DialogDescription>Registra las métricas semanales del lote reproductor</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="input" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-yellow-50">
            <TabsTrigger value="input" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Captura de Datos
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semana</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border border-yellow-300 rounded-md"
                            value={field.value}
                            onChange={(e) => {
                              const week = Number(e.target.value)
                              field.onChange(week)
                              setSelectedWeek(week)
                            }}
                          >
                            {weekOptions.map((week) => (
                              <option key={week} value={week}>
                                Semana {week}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avgWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso Promedio (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="uniformityPct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uniformidad (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dailyMortality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mortalidad Diaria (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="feedKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consumo Alimento (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="waterL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consumo Agua (L)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campos específicos para postura */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="eggsPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Huevos/Día (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fertilePct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>% Fértiles (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hatchablePct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>% Incubables (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            className="border-yellow-300 focus:border-yellow-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Vacunaciones, tratamientos, observaciones..."
                          className="resize-none border-yellow-300 focus:border-yellow-500"
                          {...field}
                        />
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
                    {isLoading ? "Guardando..." : "Guardar Métricas"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">Historial de Métricas</CardTitle>
                <CardDescription>Métricas registradas para este lote</CardDescription>
              </CardHeader>
              <CardContent>
                {existingMetrics.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay métricas registradas aún</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {existingMetrics.map((metric) => (
                      <div
                        key={metric.week}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div>
                          <span className="font-medium">Semana {metric.week}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            Peso: {metric.avgWeight.toFixed(2)}kg, Uniformidad: {metric.uniformityPct.toFixed(1)}%
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedWeek(metric.week)}
                          className="border-yellow-300 hover:bg-yellow-100"
                        >
                          Editar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
