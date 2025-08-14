"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { UserForm } from "./user-form"

const users = [
  {
    id: 1,
    name: "Juan García",
    email: "juan.garcia@avisuite.com",
    phone: "+1234567890",
    role: "administrador",
    status: "active",
    lastLogin: "2024-01-20T10:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "María López",
    email: "maria.lopez@avisuite.com",
    phone: "+1234567891",
    role: "encargado_galpon",
    status: "active",
    lastLogin: "2024-01-19T15:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@avisuite.com",
    phone: "+1234567892",
    role: "dueno_granja",
    status: "active",
    lastLogin: "2024-01-18T09:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@avisuite.com",
    phone: "+1234567893",
    role: "encargado_galpon",
    status: "inactive",
    lastLogin: "2024-01-10T14:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const getRoleBadge = (role: string) => {
  switch (role) {
    case "administrador":
      return <Badge className="bg-red-100 text-red-800">Administrador</Badge>
    case "dueno_granja":
      return <Badge className="bg-blue-100 text-blue-800">Dueño de Granja</Badge>
    case "encargado_galpon":
      return <Badge className="bg-green-100 text-green-800">Encargado de Galpón</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function UserManagement() {
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleCloseForm = () => {
    setShowUserForm(false)
    setEditingUser(null)
  }

  return (
    <>
      <Card className="border-yellow-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-yellow-800">Usuarios del Sistema</CardTitle>
              <CardDescription>Gestiona los usuarios y sus accesos al sistema</CardDescription>
            </div>
            <Button onClick={() => setShowUserForm(true)} className="bg-yellow-500 hover:bg-yellow-600">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Último acceso: {new Date(user.lastLogin).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showUserForm && <UserForm user={editingUser} onClose={handleCloseForm} onSave={handleCloseForm} />}
    </>
  )
}
