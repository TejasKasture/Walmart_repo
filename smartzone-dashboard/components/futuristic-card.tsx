"use client"

import type { ReactNode } from "react"

interface FuturisticCardProps {
  children: ReactNode
  className?: string
  glowColor?: "blue" | "white" | "yellow" | "gray" | "green" | "purple" | "cyan" | "red"
  animated?: boolean
}

export function FuturisticCard({
  children,
  className = "",
  glowColor = "blue",
  animated = false,
}: FuturisticCardProps) {
  const glowColors: Record<string, string> = {
    blue: "shadow-blue-500/20 border-blue-500/30 shadow-[0_0_15px_rgba(0,113,206,0.3)]",
    white: "shadow-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]",
    yellow: "shadow-yellow-500/20 border-yellow-500/30 shadow-[0_0_15px_rgba(255,194,32,0.3)]",
    gray: "shadow-gray-500/20 border-gray-500/30 shadow-[0_0_15px_rgba(128,128,128,0.2)]",
    green: "shadow-green-500/20 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    purple: "shadow-purple-500/20 border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]",
    cyan: "shadow-cyan-500/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    red: "shadow-red-500/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  }

  return (
    <div
      className={`
        relative backdrop-blur-xl bg-white/95 dark:bg-blue-950/90 
        border border-blue-200 dark:border-blue-800 rounded-2xl 
        shadow-2xl ${glowColors[glowColor]} 
        ${animated ? "hover:scale-105 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,113,206,0.4)]" : ""}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
