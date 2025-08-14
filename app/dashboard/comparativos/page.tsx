"use client"

import { useState } from "react"
import { motion as m } from "framer-motion"
import { StandardsUpload } from "@/components/comparativos/standards-upload"
import { RealVsStandard } from "@/components/comparativos/real-vs-standard"
import type { GeneticLine, Variable } from "@/types/domain"
import { fadeInUp, staggerContainer } from "@/components/motion/motion-presets"

export default function ComparativosPage() {
  const [selectedGenetic, setSelectedGenetic] = useState<GeneticLine>("Ross")
  const [selectedVariable, setSelectedVariable] = useState<Variable>("peso")
  const [weekRange, setWeekRange] = useState({ start: 1, end: 10 })

  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <m.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-gray-900">Comparativos Real vs Estándar</h1>
        <p className="text-gray-600">Análisis comparativo de rendimiento real contra estándares genéticos</p>
      </m.div>

      <m.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={staggerContainer({ delayChildren: 0.1, staggerChildren: 0.1 })}
        initial="hidden"
        animate="show"
      >
        <m.div className="lg:col-span-2" variants={fadeInUp}>
          <RealVsStandard
            genetic={selectedGenetic}
            variable={selectedVariable}
            weekRange={weekRange}
            onGeneticChange={setSelectedGenetic}
            onVariableChange={setSelectedVariable}
            onWeekRangeChange={setWeekRange}
          />
        </m.div>

        <m.div variants={fadeInUp}>
          <StandardsUpload />
        </m.div>
      </m.div>
    </m.div>
  )
}
