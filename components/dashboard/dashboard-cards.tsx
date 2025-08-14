"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion as m, useMotionValue, animate } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bird, Egg, AlertTriangle, TrendingUp } from "lucide-react"
import { cardHover, fadeInUp, staggerContainer } from "@/components/motion/motion-presets"

interface KPICardProps {
  title: string
  value: number
  change: string
  icon: React.ComponentType<{ className?: string }>
  isLoading?: boolean
  suffix?: string
}

function AnimatedNumber({ value, duration = 1, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const motionValue = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      onUpdate: (latest) => {
        if (suffix === "%") {
          setDisplayValue(Math.round(latest * 10) / 10) // One decimal for percentages
        } else {
          setDisplayValue(Math.round(latest))
        }
      },
    })

    return controls.stop
  }, [value, duration, motionValue, suffix])

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

function KPICard({ title, value, change, icon: Icon, isLoading, suffix = "" }: KPICardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1" />
        </CardContent>
      </Card>
    )
  }

  return (
    <m.div {...cardHover}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={value} suffix={suffix} />
          </div>
          <p className="text-xs text-muted-foreground">{change}</p>
        </CardContent>
      </Card>
    </m.div>
  )
}

export function DashboardCards() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    {
      title: "Total de Aves",
      value: 24500,
      change: "+2.5% desde el mes pasado",
      icon: Bird,
      suffix: "",
    },
    {
      title: "Producción de Huevos",
      value: 18435,
      change: "+4.1% desde ayer",
      icon: Egg,
      suffix: "",
    },
    {
      title: "Mortalidad Diaria",
      value: 0.3,
      change: "-0.1% desde ayer",
      icon: AlertTriangle,
      suffix: "%",
    },
    {
      title: "Tasa de Postura",
      value: 85.2,
      change: "+1.2% desde la semana pasada",
      icon: TrendingUp,
      suffix: "%",
    },
  ]

  return (
    <m.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={staggerContainer({ staggerChildren: 0.1 })}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <m.div key={card.title} variants={fadeInUp}>
          <KPICard {...card} isLoading={isLoading} />
        </m.div>
      ))}
    </m.div>
  )
}
