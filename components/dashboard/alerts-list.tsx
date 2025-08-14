"use client"

import { useState, useEffect } from "react"
import { motion as m, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, X } from "lucide-react"
import { fadeInUp, staggerContainer } from "@/components/motion/motion-presets"

interface Alert {
  id: string
  type: "warning" | "critical" | "info"
  title: string
  message: string
  galpon?: number
  timestamp: Date
  isRead: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Temperatura alta en Galpón 3",
    message: "La temperatura ha superado los 32°C durante más de 30 minutos",
    galpon: 3,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Mortalidad elevada",
    message: "Galpón 2 presenta mortalidad del 0.8% en las últimas 24h",
    galpon: 2,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: "3",
    type: "info",
    title: "Vacunación programada",
    message: "Recordatorio: vacunación Newcastle mañana en Galpón 1",
    galpon: 1,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true,
  },
]

function AlertItem({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
    }
  }

  const getIconColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
    }
  }

  const getBadgeVariant = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 60) {
      return `hace ${diffMins}m`
    }
    return `hace ${diffHours}h`
  }

  return (
    <m.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${!alert.isRead ? "ring-1 ring-current ring-opacity-20" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {alert.type === "info" ? (
            <Info className={`h-4 w-4 ${getIconColor(alert.type)}`} />
          ) : (
            <AlertTriangle className={`h-4 w-4 ${getIconColor(alert.type)}`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
            <Badge variant={getBadgeVariant(alert.type)} className="text-xs">
              {alert.type}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
            {alert.galpon && <span className="text-xs text-gray-500">Galpón {alert.galpon}</span>}
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200" onClick={() => onDismiss(alert.id)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </m.div>
  )
}

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas Activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Alertas Activas</span>
          {unreadCount > 0 && (
            <m.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </m.div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <m.div
          className="space-y-3"
          variants={staggerContainer({ staggerChildren: 0.1 })}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {alerts.length === 0 ? (
              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-500">
                <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No hay alertas activas</p>
              </m.div>
            ) : (
              alerts.map((alert) => (
                <m.div key={alert.id} variants={fadeInUp}>
                  <AlertItem alert={alert} onDismiss={handleDismiss} />
                </m.div>
              ))
            )}
          </AnimatePresence>
        </m.div>
      </CardContent>
    </Card>
  )
}
