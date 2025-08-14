"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { motion as m, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, BarChart3, FileText, Download, Copy } from "lucide-react"
import { buttonPress } from "@/components/motion/motion-presets"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
  hasAttachment?: boolean
  attachmentType?: "chart" | "report"
}

const quickQuestions = [
  "¿Cuál fue la producción semanal de huevos?",
  "¿Cómo está la mortalidad comparada con el mes pasado?",
  "¿Qué galpón tiene mejor FCR?",
  "Genera reporte de eficiencia productiva",
]

export const IntegratedAIChat = forwardRef<{ sendMessage: (message: string) => Promise<void> }, {}>(
  function IntegratedAIChat(props, ref) {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente especializado en análisis avícola. Puedo ayudarte con consultas sobre producción, mortalidad, FCR, y generar reportes personalizados. ¿En qué puedo ayudarte?",
        timestamp: new Date(),
      },
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Expose sendMessage method to parent
    useImperativeHandle(ref, () => ({
      sendMessage: async (messageText: string) => {
        await sendMessage(messageText)
      },
    }))

    // Auto-scroll to bottom on new messages
    useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }
      }
    }, [messages])

    const generateAIResponse = (
      userMessage: string,
    ): { content: string; hasAttachment?: boolean; attachmentType?: "chart" | "report" } => {
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes("producción") && lowerMessage.includes("semanal")) {
        return {
          content:
            "La producción semanal de huevos fue de 129,450 unidades, representando un 87.3% de postura promedio. Esto es un incremento del 2.1% respecto a la semana anterior. Te adjunto un gráfico detallado por galpón.",
          hasAttachment: true,
          attachmentType: "chart",
        }
      }

      if (lowerMessage.includes("mortalidad")) {
        return {
          content:
            "La mortalidad acumulada actual es del 2.8%, lo cual está 0.3 puntos por debajo del mes pasado (3.1%). El Galpón 4 presenta la menor mortalidad con 2.0%. La tendencia es favorable.",
          hasAttachment: false,
        }
      }

      if (lowerMessage.includes("fcr") || lowerMessage.includes("conversión")) {
        return {
          content:
            "El FCR promedio actual es de 1.67. El Galpón 3 tiene el mejor FCR con 1.62, seguido del Galpón 1 con 1.65. Te recomiendo revisar la formulación del alimento en los galpones con FCR superior a 1.70.",
          hasAttachment: false,
        }
      }

      if (lowerMessage.includes("reporte") || lowerMessage.includes("informe")) {
        return {
          content:
            "He generado un reporte completo de eficiencia productiva que incluye: FCR por galpón, análisis de mortalidad, producción de huevos, y recomendaciones de mejora. El reporte está listo para descargar.",
          hasAttachment: true,
          attachmentType: "report",
        }
      }

      // Default response
      return {
        content:
          "Entiendo tu consulta. Basándome en los datos actuales de tus parvadas, puedo proporcionarte información específica. ¿Podrías ser más específico sobre qué métricas te interesan? Por ejemplo: producción, mortalidad, FCR, o algún galpón en particular.",
        hasAttachment: false,
      }
    }

    const sendMessage = async (messageText?: string) => {
      const textToSend = messageText || input.trim()
      if (!textToSend) return

      const userMessage: Message = {
        id: Date.now(), // Use timestamp to avoid ID conflicts
        role: "user",
        content: textToSend,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsTyping(true)

      // Simulate AI processing time
      setTimeout(() => {
        const aiResponse = generateAIResponse(textToSend)
        const assistantMessage: Message = {
          id: Date.now() + 1, // Use timestamp + 1 to avoid conflicts
          role: "assistant",
          content: aiResponse.content,
          timestamp: new Date(),
          hasAttachment: aiResponse.hasAttachment,
          attachmentType: aiResponse.attachmentType,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1500)
    }

    const copyMessage = async (message: Message) => {
      try {
        await navigator.clipboard.writeText(message.content)
        setCopiedMessageId(message.id)
        setTimeout(() => setCopiedMessageId(null), 2000)
      } catch (err) {
        console.error("Failed to copy message:", err)
      }
    }

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return (
      <Card className="border-yellow-200 h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <MessageCircle className="h-5 w-5" />
            Chat de IA Integrado
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Questions */}
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-500 mb-2">Preguntas rápidas:</p>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((question, index) => (
                <m.button
                  key={index}
                  className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent border rounded px-2 py-1"
                  onClick={() => sendMessage(question)}
                  {...buttonPress}
                >
                  {question}
                </m.button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <m.div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 relative group ${
                        message.role === "user" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {message.hasAttachment && (
                        <m.div
                          className="mt-2 p-2 bg-white bg-opacity-20 rounded border border-white border-opacity-30"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center gap-2 text-xs">
                            {message.attachmentType === "chart" ? (
                              <BarChart3 className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span>{message.attachmentType === "chart" ? "Gráfico adjunto" : "Reporte adjunto"}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </m.div>
                      )}

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">{formatTime(message.timestamp)}</p>
                        <m.button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black hover:bg-opacity-10 rounded"
                          onClick={() => copyMessage(message)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Copy className="h-3 w-3" />
                        </m.button>
                      </div>

                      {copiedMessageId === message.id && (
                        <m.div
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                        >
                          ¡Copiado!
                        </m.div>
                      )}
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <m.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">IA está escribiendo...</span>
                    </div>
                  </div>
                </m.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-yellow-200">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-2"
            >
              <m.div className="flex-1" whileFocus={{ boxShadow: "0 0 0 3px rgba(234, 179, 8, 0.1)" }}>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre tus parvadas, métricas o solicita un reporte..."
                  className="flex-1 min-h-[40px] max-h-24 resize-none border-yellow-300 focus:border-yellow-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
              </m.div>
              <m.button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                {...buttonPress}
              >
                <Send className="h-4 w-4" />
              </m.button>
            </form>
          </div>
        </CardContent>
      </Card>
    )
  },
)
