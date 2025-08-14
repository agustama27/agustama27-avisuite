"use client"

import { useState } from "react"
import { motion as m, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Edit2, Save, X } from "lucide-react"
import { springSm } from "@/components/motion/motion-presets"

export type FlockData = {
  id: string
  galpon: number
  birds: number
  age: number
  weight: number
  mortality: number
  production: number
}

interface FlockTableProps {
  data: FlockData[]
}

export function FlockTable({ data }: FlockTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<FlockData | null>(null)

  const handleEdit = (flock: FlockData) => {
    setEditingId(flock.id)
    setEditData({ ...flock })
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    // For this prototype, we'll just cancel the edit mode
    setEditingId(null)
    setEditData(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleChange = (field: keyof FlockData, value: string) => {
    if (!editData) return

    // Convert to appropriate type
    let parsedValue: any
    if (field === "id" || field === "galpon") {
      parsedValue = value
    } else {
      parsedValue = Number.parseFloat(value)
      if (isNaN(parsedValue)) parsedValue = 0
    }

    setEditData({
      ...editData,
      [field]: parsedValue,
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Parvada</TableHead>
            <TableHead>Galpón</TableHead>
            <TableHead>Aves</TableHead>
            <TableHead>Edad (semanas)</TableHead>
            <TableHead>Peso Promedio (g)</TableHead>
            <TableHead>Mortalidad (%)</TableHead>
            <TableHead>Postura (%)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {data.map((flock) => (
              <m.tr
                key={flock.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                layout
                className={editingId === flock.id ? "bg-yellow-50" : ""}
              >
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        value={editData?.id || ""}
                        onChange={(e) => handleChange("id", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.id
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        value={editData?.galpon || ""}
                        onChange={(e) => handleChange("galpon", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.galpon
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        type="number"
                        value={editData?.birds || 0}
                        onChange={(e) => handleChange("birds", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.birds.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        type="number"
                        value={editData?.age || 0}
                        onChange={(e) => handleChange("age", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.age
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        type="number"
                        value={editData?.weight || 0}
                        onChange={(e) => handleChange("weight", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.weight.toFixed(1)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        type="number"
                        value={editData?.mortality || 0}
                        onChange={(e) => handleChange("mortality", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.mortality.toFixed(2)
                  )}
                </TableCell>
                <TableCell>
                  {editingId === flock.id ? (
                    <m.div layout transition={springSm}>
                      <Input
                        type="number"
                        value={editData?.production || 0}
                        onChange={(e) => handleChange("production", e.target.value)}
                        className="h-8"
                      />
                    </m.div>
                  ) : (
                    flock.production.toFixed(1)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === flock.id ? (
                    <div className="flex justify-end gap-2">
                      <m.button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={handleCancel}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4" />
                      </m.button>
                      <m.button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={handleSave}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Save className="h-4 w-4" />
                      </m.button>
                    </div>
                  ) : (
                    <m.button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => handleEdit(flock)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </m.button>
                  )}
                </TableCell>
              </m.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
