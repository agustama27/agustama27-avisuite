"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Edit, Trash2 } from "lucide-react"

export function UserManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Administra los usuarios del sistema</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Usuario
            </Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay usuarios registrados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
