"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export function CostAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Análisis de Costos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ingresos</span>
              </div>
              <p className="text-2xl font-bold text-green-600">$45,230</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Costos</span>
              </div>
              <p className="text-2xl font-bold text-red-600">$32,100</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Utilidad</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">$13,130</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
