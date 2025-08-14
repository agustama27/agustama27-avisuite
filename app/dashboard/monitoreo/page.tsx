"use client"

import { useState, useEffect } from "react"
import { motion as m } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IoTMonitoringPanel } from "@/components/dashboard/iot-monitoring-panel"
import { mockIoTData } from "@/lib/mock-data"
import { fadeInUp } from "@/components/motion/motion-presets"

export default function MonitoreoPage() {
  const [activeGalpon, setActiveGalpon] = useState("1")
  const [iotData, setIotData] = useState(mockIoTData)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData((prevData) => {
        return prevData.map((item) => {
          // Add small random variations to simulate real-time changes
          const variation = Math.random() * 0.1 - 0.05 // -5% to +5%
          return {
            ...item,
            value: Math.max(0, item.value * (1 + variation)),
          }
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <m.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold">Monitoreo IoT</h1>
      </m.div>

      <m.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Galpón</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1" value={activeGalpon} onValueChange={setActiveGalpon}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="1">Galpón 1</TabsTrigger>
                <TabsTrigger value="2">Galpón 2</TabsTrigger>
                <TabsTrigger value="3">Galpón 3</TabsTrigger>
                <TabsTrigger value="4">Galpón 4</TabsTrigger>
              </TabsList>

              {["1", "2", "3", "4"].map((galpon) => (
                <TabsContent key={galpon} value={galpon}>
                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <IoTMonitoringPanel
                      galponId={Number.parseInt(galpon)}
                      data={iotData.filter((item) => item.galponId === Number.parseInt(galpon))}
                    />
                  </m.div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </m.div>
    </m.div>
  )
}
