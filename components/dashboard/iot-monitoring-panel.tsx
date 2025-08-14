"use client"

import { motion as m } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Zap, Scale } from "lucide-react"
import { staggerContainer, fadeInUp } from "@/components/motion/motion-presets"

interface IoTSensor {
  id: string
  galponId: number
  type: "temperature" | "humidity" | "water" | "feed"
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  lastUpdate: Date
}

interface IoTMonitoringPanelProps {
  galponId: number
  data: IoTSensor[]
}

function SensorCard({ sensor }: { sensor: IoTSensor }) {
  const getIcon = () => {
    switch (sensor.type) {
      case "temperature":
        return <Thermometer className="h-5 w-5" />
      case "humidity":
        return <Droplets className="h-5 w-5" />
      case "water":
        return <Zap className="h-5 w-5" />
      case "feed":
        return <Scale className="h-5 w-5" />
    }
  }

  const getStatusColor = () => {
    switch (sensor.status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getPulseAnimation = () => {
    if (sensor.status === "critical") {
      return {
        boxShadow: [
          "0 0 0 0 rgba(239, 68, 68, 0.4)",
          "0 0 0 10px rgba(239, 68, 68, 0)",
          "0 0 0 0 rgba(239, 68, 68, 0)",
        ],
      }
    }
    if (sensor.status === "warning") {
      return {
        boxShadow: [
          "0 0 0 0 rgba(245, 158, 11, 0.4)",
          "0 0 0 8px rgba(245, 158, 11, 0)",
          "0 0 0 0 rgba(245, 158, 11, 0)",
        ],
      }
    }
    return {}
  }

  return (
    <m.div whileHover={{ y: -2, scale: 1.02 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
      <Card className={`${getStatusColor()} border`}>
        <m.div
          animate={getPulseAnimation()}
          transition={{
            repeat: sensor.status !== "normal" ? Number.POSITIVE_INFINITY : 0,
            repeatType: "mirror",
            duration: 1.2,
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getIcon()}
                <span className="capitalize">{sensor.type}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {sensor.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensor.value.toFixed(1)} {sensor.unit}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Actualizado: {sensor.lastUpdate.toLocaleTimeString()}</p>
          </CardContent>
        </m.div>
      </Card>
    </m.div>
  )
}

export function IoTMonitoringPanel({ galponId, data }: IoTMonitoringPanelProps) {
  return (
    <m.div className="space-y-4" variants={staggerContainer({ staggerChildren: 0.1 })} initial="hidden" animate="show">
      <m.h3 className="text-lg font-semibold" variants={fadeInUp}>
        Sensores Galpón {galponId}
      </m.h3>

      <m.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer({ staggerChildren: 0.05 })}
      >
        {data.map((sensor) => (
          <m.div key={sensor.id} variants={fadeInUp}>
            <SensorCard sensor={sensor} />
          </m.div>
        ))}
      </m.div>
    </m.div>
  )
}
