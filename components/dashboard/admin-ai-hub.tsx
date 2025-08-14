"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion as m } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IntegratedAIChat } from "@/components/poultry-ia/integrated-ai-chat"
import { FileText, TrendingUp, AlertTriangle, Brain, Zap, Target, PieChart } from "lucide-react"
import { fadeInUp, staggerContainer, buttonPress } from "@/components/motion/motion-presets"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  action: string
}

const quickActions: QuickAction[] = [
  {
    id: "performance",
    title: "Análisis de Rendimiento",
    description: "Evalúa FCR, mortalidad y producción por galpón",
    icon: TrendingUp,
    color: "bg-green-500",
    action: "Analiza el rendimiento de todos los galpones esta semana",
  },
  {
    id: "alerts",
    title: "Resumen de Alertas",
    description: "Consolida alertas críticas y recomendaciones",
    icon: AlertTriangle,
    color: "bg-red-500",
    action: "Dame un resumen de todas las alertas críticas activas",
  },
  {
    id: "forecast",
    title: "Proyección Semanal",
    description: "Predice producción y costos para la próxima semana",
    icon: Target,
    color: "bg-blue-500",
    action: "Genera una proyección de producción para la próxima semana",
  },
  {
    id: "comparison",
    title: "Comparativo Mensual",
    description: "Compara métricas actuales vs mes anterior",
    icon: PieChart,
    color: "bg-purple-500",
    action: "Compara el rendimiento de este mes con el mes anterior",
  },
  {
    id: "report",
    title: "Reporte Ejecutivo",
    description: "Genera reporte completo para stakeholders",
    icon: FileText,
    color: "bg-yellow-500",
    action: "Genera un reporte ejecutivo completo con todas las métricas",
  },
  {
    id: "optimization",
    title: "Sugerencias de Optimización",
    description: "Identifica oportunidades de mejora",
    icon: Zap,
    color: "bg-orange-500",
    action: "¿Qué optimizaciones recomiendas para mejorar la eficiencia?",
  },
]

export function AdminAIHub() {
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const chatRef = useRef<{ sendMessage: (message: string) => Promise<void> }>(null)

  const handleQuickAction = async (action: QuickAction) => {
    setActiveAction(action.id)

    // Send message to chat
    if (chatRef.current) {
      await chatRef.current.sendMessage(action.action)
    }

    // Reset active state after animation
    setTimeout(() => setActiveAction(null), 1000)
  }

  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Brain className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de IA Ejecutivo</h1>
            <p className="text-gray-600">Análisis inteligente y toma de decisiones asistida</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Modo Administrador
        </Badge>
      </div>

      {/* Quick Actions Grid */}
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Zap className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <m.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={staggerContainer({ delayChildren: 0.05, staggerChildren: 0.04 })}
            initial="hidden"
            animate="show"
          >
            {quickActions.map((action) => (
              <m.div key={action.id} variants={fadeInUp}>
                <m.button
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors relative overflow-hidden"
                  onClick={() => handleQuickAction(action)}
                  {...buttonPress}
                >
                  {/* Ripple effect */}
                  {activeAction === action.id && (
                    <m.span
                      className="absolute inset-0 bg-yellow-200 rounded-lg"
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}

                  <div className="flex items-start gap-3 relative z-10">
                    <div className={`p-2 ${action.color} rounded-lg`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </m.button>
              </m.div>
            ))}
          </m.div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IntegratedAIChat ref={chatRef} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-yellow-800">Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Galpones Activos</span>
                <span className="font-semibold">8/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiencia Promedio</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alertas Críticas</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ROI Mensual</span>
                <span className="font-semibold text-blue-600">+12.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-yellow-800">Próximas Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-gray-600 p-2 bg-yellow-50 rounded">
                <strong>Hoy:</strong> Vacunación Galpón 3
              </div>
              <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
                <strong>Mañana:</strong> Revisión FCR semanal
              </div>
              <div className="text-xs text-gray-600 p-2 bg-green-50 rounded">
                <strong>Viernes:</strong> Reporte mensual
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </m.div>
  )
}
