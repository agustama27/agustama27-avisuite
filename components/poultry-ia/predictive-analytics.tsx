"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

// Mock predictive data
const weightPredictionData = [
  { week: 10, actual: 900, predicted: 910, confidence: 95 },
  { week: 11, actual: null, predicted: 1020, confidence: 92 },
  { week: 12, actual: null, predicted: 1140, confidence: 89 },
  { week: 13, actual: null, predicted: 1260, confidence: 85 },
  { week: 14, actual: null, predicted: 1380, confidence: 82 },
  { week: 15, actual: null, predicted: 1500, confidence: 78 },
  { week: 16, actual: null, predicted: 1620, confidence: 75 },
]

const mortalityPredictionData = [
  { week: 10, actual: 3.0, predicted: 3.1, risk: "low" },
  { week: 11, actual: null, predicted: 3.3, risk: "low" },
  { week: 12, actual: null, predicted: 3.6, risk: "medium" },
  { week: 13, actual: null, predicted: 4.1, risk: "medium" },
  { week: 14, actual: null, predicted: 4.8, risk: "high" },
  { week: 15, actual: null, predicted: 5.2, risk: "high" },
  { week: 16, actual: null, predicted: 5.5, risk: "high" },
]

const productionPredictionData = [
  { week: 18, actual: 5, predicted: 8, efficiency: 85 },
  { week: 19, actual: 25, predicted: 30, efficiency: 87 },
  { week: 20, actual: 50, predicted: 55, efficiency: 89 },
  { week: 21, actual: null, predicted: 75, efficiency: 91 },
  { week: 22, actual: null, predicted: 88, efficiency: 93 },
  { week: 23, actual: null, predicted: 92, efficiency: 94 },
  { week: 24, actual: null, predicted: 94, efficiency: 95 },
]

const kpiData = [
  {
    title: "FCR Proyectado",
    value: "1.68",
    change: "+0.03",
    trend: "up",
    description: "Conversión alimenticia estimada próximas 4 semanas",
  },
  {
    title: "Eficiencia Productiva",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    description: "Índice de eficiencia europea proyectado",
  },
  {
    title: "Riesgo de Mortalidad",
    value: "Medio",
    change: "↑",
    trend: "up",
    description: "Probabilidad de incremento en mortalidad",
  },
  {
    title: "ROI Estimado",
    value: "$2.34",
    change: "+$0.12",
    trend: "up",
    description: "Retorno por ave en próximo ciclo",
  },
]

export function PredictiveAnalytics() {
  return (
    <div className="space-y-6">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Dashboard de Análisis Predictivo</CardTitle>
          <CardDescription>Proyecciones basadas en modelos de machine learning y datos históricos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weight" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-yellow-50">
              <TabsTrigger value="weight" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                Peso Proyectado
              </TabsTrigger>
              <TabsTrigger
                value="mortality"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                Mortalidad Predictiva
              </TabsTrigger>
              <TabsTrigger
                value="production"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              >
                Producción Futura
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightPredictionData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Peso (g)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#eab308"
                      fillOpacity={1}
                      fill="url(#weightGradient)"
                      name="Peso Proyectado"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#374151"
                      strokeWidth={3}
                      name="Peso Actual"
                      dot={{ fill: "#374151", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="mortality" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mortalityPredictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Mortalidad (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#374151"
                      strokeWidth={3}
                      name="Mortalidad Actual"
                      dot={{ fill: "#374151", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Mortalidad Proyectada"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionPredictionData}>
                    <defs>
                      <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Semana", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Producción (%)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#eab308"
                      fillOpacity={1}
                      fill="url(#productionGradient)"
                      name="Producción Proyectada"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#374151"
                      strokeWidth={3}
                      name="Producción Actual"
                      dot={{ fill: "#374151", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{kpi.title}</CardTitle>
              {kpi.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{kpi.value}</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className={`font-medium ${kpi.trend === "up" ? "text-yellow-600" : "text-red-500"}`}>
                  {kpi.change}
                </span>{" "}
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
