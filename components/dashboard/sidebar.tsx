"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
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
  const [isCollapsed, setIsCollapsed] = useState(false)

  const renderLinks = (links: typeof sidebarLinks) =>
    links.map((link) => {
      const isActive = pathname === link.href
      return (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative",
            isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-yellow-50",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? link.name : undefined}
        >
          <link.icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{link.name}</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {link.name}
            </div>
          )}
        </Link>
      )
    })

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-4 z-50 p-2 h-8 w-8 hover:bg-yellow-50 flex-shrink-0 transition-all duration-300",
          isCollapsed ? "left-4" : "left-60"
        )}
        title={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        )}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <EggIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold text-yellow-800">AviSuite</h1>}
        </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {renderLinks(sidebarLinks)}

          <Separator className="my-4" />
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Producción</h3>
            </div>
          )}
          {renderLinks(productionLinks)}

          <Separator className="my-4" />
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Análisis</h3>
            </div>
          )}
          {renderLinks(analysisLinks)}

          <Separator className="my-4" />
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistema</h3>
            </div>
          )}
          {renderLinks(systemLinks)}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-red-500 hover:text-red-600 hover:bg-red-50 group relative",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-2">Cerrar sesión</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              Cerrar sesión
            </div>
          )}
        </Button>
      </div>
    </div>
    </>
  )
}
