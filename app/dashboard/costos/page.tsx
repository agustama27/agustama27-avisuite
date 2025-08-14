"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostAnalysis } from "@/components/costos/cost-analysis"
import { ConversionCharts } from "@/components/costos/conversion-charts"
import { ProfitabilityMetrics } from "@/components/costos/profitability-metrics"
import { KPICloseout } from "@/components/costos/kpi-closeout"

export default function CostosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Costos y Conversión</h1>
        <p className="text-gray-600">Análisis de costos, conversión alimenticia y rentabilidad por lote</p>
      </div>

      <KPICloseout />

      <Tabs defaultValue="conversion" className="space-y-4">
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="conversion" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Conversión Alimenticia
          </TabsTrigger>
          <TabsTrigger value="costs" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Análisis de Costos
          </TabsTrigger>
          <TabsTrigger
            value="profitability"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
          >
            Rentabilidad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversion">
          <ConversionCharts />
        </TabsContent>

        <TabsContent value="costs">
          <CostAnalysis />
        </TabsContent>

        <TabsContent value="profitability">
          <ProfitabilityMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
