"use client"

import type { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ReportPreviewProps {
  reportType: string
  dateRange?: DateRange
}

const productionData = [
  { galpon: "Galpón 1", huevos: 12500, porcentaje: 87.5 },
  { galpon: "Galpón 2", huevos: 11800, porcentaje: 85.2 },
  { galpon: "Galpón 3", huevos: 13200, porcentaje: 89.1 },
  { galpon: "Galpón 4", huevos: 12100, porcentaje: 86.3 },
]

const mortalidadData = [
  { galpon: "Galpón 1", inicial: 5000, actual: 4850, mortalidad: 3.0 },
  { galpon: "Galpón 2", inicial: 5000, actual: 4875, mortalidad: 2.5 },
  { galpon: "Galpón 3", inicial: 5000, actual: 4825, mortalidad: 3.5 },
  { galpon: "Galpón 4", inicial: 5000, actual: 4900, mortalidad: 2.0 },
]

const costosData = [
  { galpon: "Galpón 1", alimento: 12500, manoObra: 3500, servicios: 1800, total: 17800 },
  { galpon: "Galpón 2", alimento: 12200, manoObra: 3500, servicios: 1750, total: 17450 },
  { galpon: "Galpón 3", alimento: 12800, manoObra: 3500, servicios: 1850, total: 18150 },
  { galpon: "Galpón 4", alimento: 12300, manoObra: 3500, servicios: 1780, total: 17580 },
]

const chartData = [
  { name: "Galpón 1", produccion: 87.5, mortalidad: 3.0, fcr: 1.65 },
  { name: "Galpón 2", produccion: 85.2, mortalidad: 2.5, fcr: 1.68 },
  { name: "Galpón 3", produccion: 89.1, mortalidad: 3.5, fcr: 1.62 },
  { name: "Galpón 4", produccion: 86.3, mortalidad: 2.0, fcr: 1.7 },
]

export function ReportPreview({ reportType, dateRange }: ReportPreviewProps) {
  const formatDateRange = () => {
    if (!dateRange?.from) return "";
    
    let result = `${format(dateRange.from, "dd 'de' MMMM 'de' yyyy", { locale: es })}`;
    if (dateRange.to) {
      result += ` al ${format(dateRange.to, "dd 'de' MMMM 'de' yyyy", { locale: es })}`;
    }
    
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          Reporte de {reportType === "produccion" ? "Producción" : 
                      reportType === "mortalidad" ? "Mortalidad" : 
                      reportType === "costos" ? "Costos" : "Completo"}
        </h2>
        <p className="text-muted-foreground">{formatDateRange()}</p>
      </div>
      
      {reportType === "produccion" && (
        <>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Galpón</TableHead>
                    <TableHead className="text-right">Huevos Producidos</TableHead>
                    <TableHead className="text-right">Porcentaje de Postura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionData.map((row) => (
                    <TableRow key={row.galpon}>
                      <TableCell>{row.galpon}</TableCell>
                      <TableCell className="text-right">{row.huevos.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.porcentaje.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {productionData.reduce((sum, row) => sum + row.huevos, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {(productionData.reduce((sum, row) => sum + row.porcentaje, 0) / productionData.length).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="produccion" name="Producción (%)" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      
      {reportType === "mortalidad" && (
        <>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Galpón</TableHead>
                    <TableHead className="text-right">Aves Iniciales</TableHead>
                    <TableHead className="text-right">Aves Actuales</TableHead>
                    <TableHead className="text-right">Mortalidad (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mortalidadData.map((row) => (
                    <TableRow key={row.galpon}>
                      <TableCell>{row.galpon}</TableCell>
                      <TableCell className="text-right">{row.inicial.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.actual.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.mortalidad.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {mortalidadData.reduce((sum, row) => sum + row.inicial, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {mortalidadData.reduce((sum, row) => sum + row.actual, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {(mortalidadData.reduce((sum, row) => sum + row.mortalidad, 0) / mortalidadData.length).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mortalidad" name="Mortalidad (%)" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      
      {reportType === "costos" && (
        <>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Galpón</TableHead>
                    <TableHead className="text-right">Alimento ($)</TableHead>
                    <TableHead className="text-right">Mano de Obra ($)</TableHead>
                    <TableHead className="text-right">Servicios ($)</TableHead>
                    <TableHead className="text-right">Total ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costosData.map((row) => (
                    <TableRow key={row.galpon}>
                      <TableCell>{row.galpon}</TableCell>
                      <TableCell className="text-right">{row.alimento.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.manoObra.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.servicios.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      {costosData.reduce
