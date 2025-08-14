"use client"

import { motion as m } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { fadeInUp } from "@/components/motion/motion-presets"

interface MortalityAlertProps {
  onClose: () => void
}

export function MortalityAlert({ onClose }: MortalityAlertProps) {
  return (
    <m.div variants={fadeInUp} initial="hidden" animate="show" exit="hidden" className="mb-6">
      <m.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.4)",
            "0 0 0 8px rgba(239, 68, 68, 0)",
            "0 0 0 0 rgba(239, 68, 68, 0)",
          ],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          duration: 1.5,
        }}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <div className="flex items-start justify-between w-full">
            <div>
              <AlertTitle className="text-red-800">Alerta de Mortalidad Elevada</AlertTitle>
              <AlertDescription className="text-red-700">
                El Galpón 2 presenta una mortalidad del 1.2% en las últimas 24 horas, superando el umbral del 0.8%. Se
                recomienda inspección veterinaria inmediata.
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      </m.div>
    </m.div>
  )
}
