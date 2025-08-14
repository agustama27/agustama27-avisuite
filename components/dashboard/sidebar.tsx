"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BirdIcon as Birds,
  BarChart3,
  Thermometer,
  Settings,
  LogOut,
  EggIcon,
  Brain,
  Calendar,
  FileText,
  DollarSign,
  Users,
  Activity,
  Egg,
  GitCommit,
  TrendingUp,
  Route,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Ciclo Productivo",
    href: "/dashboard/ciclo-productivo",
    icon: Calendar,
  },
  {
    name: "Parvadas",
    href: "/dashboard/parvadas",
    icon: Birds,
  },
  {
    name: "Eventos y Tratamientos",
    href: "/dashboard/eventos",
    icon: Activity,
  },
]

const productionLinks = [
  {
    name: "Reproductoras",
    href: "/dashboard/reproductoras",
    icon: Egg,
  },
  {
    name: "Incubación",
    href: "/dashboard/incubacion",
    icon: GitCommit,
  },
  {
    name: "Comparativos",
    href: "/dashboard/comparativos",
    icon: TrendingUp,
  },
  {
    name: "Trazabilidad",
    href: "/dashboard/trazabilidad",
    icon: Route,
  },
]

const analysisLinks = [
  {
    name: "Costos y Conversión",
    href: "/dashboard/costos",
    icon: DollarSign,
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
  },
  {
    name: "Documentos",
    href: "/dashboard/documentos",
    icon: FileText,
  },
  {
    name: "Monitoreo IoT",
    href: "/dashboard/monitoreo",
    icon: Thermometer,
  },
  {
    name: "Poultry IA",
    href: "/dashboard/poultry-ia",
    icon: Brain,
  },
]

const systemLinks = [
  {
    name: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users,
  },
  {
    name: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const renderLinks = (links: typeof sidebarLinks) =>
    links.map((link) => {
      const isActive = pathname === link.href
      return (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-yellow-50",
          )}
        >
          <link.icon className="h-5 w-5" />
          {link.name}
        </Link>
      )
    })

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="bg-primary p-2 rounded-md">
          <EggIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-yellow-800">AviSuite</h1>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {renderLinks(sidebarLinks)}

          <Separator className="my-4" />
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Producción</h3>
          </div>
          {renderLinks(productionLinks)}

          <Separator className="my-4" />
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Análisis</h3>
          </div>
          {renderLinks(analysisLinks)}

          <Separator className="my-4" />
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</h3>
          </div>
          {renderLinks(systemLinks)}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
