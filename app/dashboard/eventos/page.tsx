"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EventForm } from "@/components/eventos/event-form"
import { EventsList } from "@/components/eventos/events-list"
import { MortalityAlert } from "@/components/eventos/mortality-alert"

export default function EventosPage() {
  const [showEventForm, setShowEventForm] = useState(false)
  const [showMortalityAlert, setShowMortalityAlert] = useState(true) // Simulated high mortality

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos y Tratamientos</h1>
          <p className="text-gray-600">Registro de vacunaciones, medicaciones y observaciones veterinarias</p>
        </div>
        <Button onClick={() => setShowEventForm(true)} className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {showMortalityAlert && <MortalityAlert onClose={() => setShowMortalityAlert(false)} />}

      <EventsList />

      {showEventForm && <EventForm onClose={() => setShowEventForm(false)} onSave={() => setShowEventForm(false)} />}
    </div>
  )
}
