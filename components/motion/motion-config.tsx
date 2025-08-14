"use client"

import type React from "react"

import { MotionConfig, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface MotionProviderProps {
  children: React.ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </MotionConfig>
  )
}
