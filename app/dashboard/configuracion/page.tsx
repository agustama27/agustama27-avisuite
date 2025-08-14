"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/dashboard/user-management"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function ConfiguracionPage() {
  const [thresholds, setThresholds] = useState({
    maxDailyMortality: 0.5,
    minTemperature: 18,
    maxTemperature: 28,
    minHumidity: 40,
    maxHumidity: 70,
    minWaterConsumption: 200,
    maxWaterConsumption: 300,
    minFeedConsumption: 100,
    maxFeedConsumption: 150,
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const handleSaveThresholds = () => {
    toast({
      title: "Configuración guardada",
      description: "Los umbrales han sido actualizados correctamente.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Preferencias guardadas",
      description: "Las preferencias de notificación han sido actualizadas.",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuración</h1>

      <Tabs defaultValue="thresholds">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="thresholds">Umbrales</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Umbrales de Alerta</CardTitle>
              <CardDescription>Configura los valores límite para generar alertas automáticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Mortalidad diaria máxima (%)</Label>
                    <span>{thresholds.maxDailyMortality.toFixed(1)}%</span>
                  </div>
                  <Slider
                    value={[thresholds.maxDailyMortality]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setThresholds({ ...thresholds, maxDailyMortality: value[0] })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Temperatura mínima (°C)</Label>
                      <span>{thresholds.minTemperature}°C</span>
                    </div>
                    <Slider
                      value={[thresholds.minTemperature]}
                      min={10}
                      max={25}
                      step={1}
                      onValueChange={(value) => setThresholds({ ...thresholds, minTemperature: value[0] })}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Temperatura máxima (°C)</Label>
                      <span>{thresholds.maxTemperature}°C</span>
                    </div>
                    <Slider
                      value={[thresholds.maxTemperature]}
                      min={20}
                      max={35}
                      step={1}
                      onValueChange={(value) => setThresholds({ ...thresholds, maxTemperature: value[0] })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Humedad mínima (%)</Label>
                      <span>{thresholds.minHumidity}%</span>
                    </div>
                    <Slider
                      value={[thresholds.minHumidity]}
                      min={30}
                      max={60}
                      step={5}
                      onValueChange={(value) => setThresholds({ ...thresholds, minHumidity: value[0] })}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Humedad máxima (%)</Label>
                      <span>{thresholds.maxHumidity}%</span>
                    </div>
                    <Slider
                      value={[thresholds.maxHumidity]}
                      min={50}
                      max={90}
                      step={5}
                      onValueChange={(value) => setThresholds({ ...thresholds, maxHumidity: value[0] })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveThresholds}>Guardar Configuración</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificación</CardTitle>
              <CardDescription>Configura cómo deseas recibir las alertas del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas en tu correo electrónico</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base">
                      Notificaciones por SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas en tu teléfono móvil</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base">
                      Notificaciones Push
                    </Label>
                    <p className="text-sm text-muted-foreground">Recibe alertas en la aplicación</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Guardar Preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
