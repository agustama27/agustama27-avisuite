"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { GeneticLine, Variable, StandardPoint } from "@/types/domain"
import { uploadStandardCSV } from "@/app/utils"

export function StandardsUpload() {
  const [selectedGenetic, setSelectedGenetic] = useState<GeneticLine>("Ross")
  const [selectedVariable, setSelectedVariable] = useState<Variable>("peso")
  const [uploading, setUploading] = useState(false)
  const [previewData, setPreviewData] = useState<StandardPoint[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const data = await uploadStandardCSV(file, selectedGenetic, selectedVariable)
      setPreviewData(data)
      setShowPreview(true)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleConfirmUpload = () => {
    // Here you would save the standards to your backend
    console.log("Confirming upload of standards:", previewData)
    setShowPreview(false)
    setPreviewData([])
  }

  const downloadTemplate = () => {
    const csvContent = `week,value,variable,genetic
1,0.18,peso,Ross
2,0.36,peso,Ross
3,0.62,peso,Ross
4,0.95,peso,Ross
5,1.35,peso,Ross`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template_estandares.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cargar Estándares
          </CardTitle>
          <CardDescription>Actualiza las curvas estándar por genética y variable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Genética</Label>
            <Select value={selectedGenetic} onValueChange={setSelectedGenetic}>
              <SelectTrigger className="border-yellow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ross">Ross</SelectItem>
                <SelectItem value="Cobb">Cobb</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Variable</Label>
            <Select value={selectedVariable} onValueChange={setSelectedVariable}>
              <SelectTrigger className="border-yellow-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peso">Peso</SelectItem>
                <SelectItem value="mortalidad">Mortalidad</SelectItem>
                <SelectItem value="consumo">Consumo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csvFile">Archivo CSV</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="border-yellow-300"
            />
          </div>

          <div className="space-y-2">
            <Button onClick={downloadTemplate} variant="outline" className="w-full border-yellow-300 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Descargar Plantilla CSV
            </Button>
          </div>

          {uploading && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">Procesando archivo...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-yellow-800">Vista Previa de Estándares</DialogTitle>
            <DialogDescription>Revisa los datos antes de confirmar la carga</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span>
                <strong>Genética:</strong> {selectedGenetic}
              </span>
              <span>
                <strong>Variable:</strong> {selectedVariable}
              </span>
              <span>
                <strong>Registros:</strong> {previewData.length}
              </span>
            </div>

            <div className="border rounded-lg max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semana</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Variable</TableHead>
                    <TableHead>Genética</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((point, index) => (
                    <TableRow key={index}>
                      <TableCell>{point.week}</TableCell>
                      <TableCell>{point.value}</TableCell>
                      <TableCell>{point.variable}</TableCell>
                      <TableCell>{point.genetic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmUpload} className="bg-yellow-500 hover:bg-yellow-600">
                Confirmar Carga
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
