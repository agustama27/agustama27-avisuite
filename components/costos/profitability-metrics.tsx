"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Target } from "lucide-react"

export function ProfitabilityMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Métricas de Rentabilidad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">ROI</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">28.5%</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Margen</span>
              </div>
              <p className="text-2xl font-bold text-green-600">29.1%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
