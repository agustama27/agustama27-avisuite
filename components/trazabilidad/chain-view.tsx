"use client"

import { motion as m } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Egg, Bird, Factory } from "lucide-react"
import type { TraceChain } from "@/types/domain"
import { staggerContainer, fadeInUp, cardHover } from "@/components/motion/motion-presets"

interface ChainViewProps {
  traceData: TraceChain
}

export function ChainView({ traceData }: ChainViewProps) {
  const chainSteps = [
    {
      id: "breeder",
      title: "Reproductoras",
      icon: <Bird className="h-6 w-6" />,
      data: traceData.breederBatch,
      description: `Lote ${traceData.breederBatch.id} - ${traceData.breederBatch.genetics}`,
    },
    {
      id: "hatch",
      title: "Incubación",
      icon: <Egg className="h-6 w-6" />,
      data: traceData.hatchLoad,
      description: `Carga ${traceData.hatchLoad.id} - ${traceData.hatchLoad.eggCount.toLocaleString()} huevos`,
    },
    {
      id: "broiler",
      title: "Engorde",
      icon: <Factory className="h-6 w-6" />,
      data: traceData.broilerBatch,
      description: `Lote ${traceData.broilerBatch.id} - ${traceData.broilerBatch.birds.toLocaleString()} aves`,
    },
  ]

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">Cadena de Trazabilidad</CardTitle>
        <CardDescription>Seguimiento completo desde reproductoras hasta engorde</CardDescription>
      </CardHeader>
      <CardContent>
        <m.div
          className="flex flex-col lg:flex-row items-center gap-6"
          variants={staggerContainer({ staggerChildren: 0.06 })}
          initial="hidden"
          animate="show"
        >
          {chainSteps.map((step, index) => (
            <m.div key={step.id} className="flex items-center gap-4" variants={fadeInUp}>
              <m.div {...cardHover}>
                <Card className="w-64 border-yellow-200 hover:border-yellow-300 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">{step.icon}</div>
                      <div>
                        <CardTitle className="text-sm text-yellow-800">{step.title}</CardTitle>
                        <CardDescription className="text-xs">{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Estado:</span>
                        <Badge variant="outline" className="text-xs">
                          {step.data.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Fecha:</span>
                        <span>
                          {step.data.startDate?.toLocaleDateString() || step.data.loadDate?.toLocaleDateString()}
                        </span>
                      </div>
                      {step.data.genetics && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Genética:</span>
                          <span>{step.data.genetics}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </m.div>

              {index < chainSteps.length - 1 && (
                <m.div
                  className="hidden lg:block text-yellow-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ArrowRight className="h-6 w-6" />
                </m.div>
              )}
            </m.div>
          ))}
        </m.div>

        {/* Events Timeline */}
        <m.div
          className="mt-8 pt-6 border-t border-yellow-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-yellow-800 mb-4">Eventos Registrados</h4>
          <m.div
            className="space-y-3"
            variants={staggerContainer({ staggerChildren: 0.05 })}
            initial="hidden"
            animate="show"
          >
            {traceData.events.map((event) => (
              <m.div
                key={event.id}
                className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                variants={fadeInUp}
                whileHover={{ x: 2, backgroundColor: "rgba(254, 240, 138, 0.3)" }}
              >
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-gray-500">{event.date.toLocaleDateString()}</p>
                </div>
              </m.div>
            ))}
          </m.div>
        </m.div>
      </CardContent>
    </Card>
  )
}
