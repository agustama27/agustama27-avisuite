"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Settings } from "lucide-react"

export function RolePermissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Roles y Permisos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Administrador</span>
              </div>
              <p className="text-xs text-gray-600">Acceso completo al sistema</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Operador</span>
              </div>
              <p className="text-xs text-gray-600">Acceso limitado a funciones</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Solo Lectura</span>
              </div>
              <p className="text-xs text-gray-600">Solo visualización de datos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
