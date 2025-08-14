"use client"

import { PredictiveAnalytics } from "@/components/poultry-ia/predictive-analytics"
import { AIRecommendations } from "@/components/poultry-ia/ai-recommendations"
import { IntegratedAIChat } from "@/components/poultry-ia/integrated-ai-chat"

export default function PoultryIAPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500 p-2 rounded-lg">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Poultry IA</h1>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          Análisis Predictivo Avanzado
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Predictive Analytics Dashboard - Takes 2 columns */}
        <div className="xl:col-span-2">
          <PredictiveAnalytics />
        </div>

        {/* AI Recommendations - Takes 1 column */}
        <div className="space-y-6">
          <AIRecommendations />

          {/* Integrated AI Chat */}
          <IntegratedAIChat />
        </div>
      </div>
    </div>
  )
}
