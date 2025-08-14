"use client"
import { DocumentGenerator } from "@/components/documentos/document-generator"
import { DocumentHistory } from "@/components/documentos/document-history"

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
        <p className="text-gray-600">Generación y gestión de documentos oficiales y reportes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentGenerator />
        <DocumentHistory />
      </div>
    </div>
  )
}
