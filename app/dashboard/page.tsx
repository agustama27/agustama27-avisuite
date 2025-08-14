"use client"

import { motion as m } from "framer-motion"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { AlertsList } from "@/components/dashboard/alerts-list"
import { AdminAIHub } from "@/components/dashboard/admin-ai-hub"
import { getCurrentUserRole } from "@/app/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { fadeInUp, staggerContainer } from "@/components/motion/motion-presets"
import { useMemo } from "react"

export default function DashboardPage() {
  // Memoize the role to prevent re-renders
  const role = useMemo(() => getCurrentUserRole(), [])

  if (role === "admin" || role === "owner") {
    // Vista para Administrador/Dueño
    return (
      <m.div
        className="space-y-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AdminAIHub />

        {/* Resumen clásico debajo en acordeón colapsable */}
        <Accordion type="single" collapsible defaultValue="resumen">
          <AccordionItem value="resumen" className="border-yellow-200">
            <AccordionTrigger className="text-yellow-800 hover:text-yellow-900">
              Resumen operativo (tarjetas, gráficas y alertas)
            </AccordionTrigger>
            <AccordionContent>
              <m.div
                className="space-y-6 mt-2"
                variants={staggerContainer({ delayChildren: 0.1, staggerChildren: 0.05 })}
                initial="hidden"
                animate="show"
              >
                <m.div variants={fadeInUp}>
                  <DashboardCards />
                </m.div>
                <m.div
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  variants={staggerContainer({ staggerChildren: 0.1 })}
                >
                  <m.div className="lg:col-span-2" variants={fadeInUp}>
                    <DashboardCharts />
                  </m.div>
                  <m.div variants={fadeInUp}>
                    <AlertsList />
                  </m.div>
                </m.div>
              </m.div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </m.div>
    )
  }

  // Vista para Peón u otros roles
  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <h1 className="text-3xl font-bold">Dashboard Principal</h1>
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div>
          <AlertsList />
        </div>
      </div>
    </m.div>
  )
}
