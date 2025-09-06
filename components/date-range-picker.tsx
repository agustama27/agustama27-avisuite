"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DateRangePicker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Selector de Fechas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Fecha Inicio
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Fecha Fin
            </Button>
          </div>
          <Button className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Aplicar Filtro
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export with the name that's being imported
export const DatePickerWithRange = DateRangePicker
