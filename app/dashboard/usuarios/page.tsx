"use client"
import { UserManagement } from "@/components/usuarios/user-management"
import { RolePermissions } from "@/components/usuarios/role-permissions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administración de usuarios, roles y permisos del sistema</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-yellow-50">
          <TabsTrigger value="users" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Roles y Permisos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
