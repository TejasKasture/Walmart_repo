"use client"

import { useEffect, useState } from "react"

interface HolographicDisplayProps {
  title: string
  value: string | number
  subtitle?: string
  color?: "blue" | "white" | "yellow" | "gray" | "green" | "purple" | "cyan" | "red"
  animated?: boolean
}

export function HolographicDisplay({
  title,
  value,
  subtitle,
  color = "blue",
  animated = true,
}: HolographicDisplayProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (animated && typeof value === "number") {
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          const diff = value - prev
          if (Math.abs(diff) < 1) return value
          return prev + diff * 0.1
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [value, animated])

  const colorClasses: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_10px_rgba(0,113,206,0.8)]",
    white: "text-gray-700 dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]",
    yellow: "text-yellow-600 dark:text-yellow-400 drop-shadow-[0_0_10px_rgba(255,194,32,0.8)]",
    gray: "text-gray-600 dark:text-gray-400 drop-shadow-[0_0_10px_rgba(128,128,128,0.6)]",
    green: "text-green-600 dark:text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]",
    purple: "text-purple-600 dark:text-purple-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]",
    cyan: "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]",
    red: "text-red-600 dark:text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 dark:via-blue-800/20 to-transparent animate-pulse" />
      <div className="relative p-6 text-center">
        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{title}</h3>
        <div className={`text-4xl font-bold ${colorClasses[color]}`}>
          {animated && typeof value === "number" ? displayValue.toFixed(1) : value}
        </div>
        {subtitle && <p className="text-xs text-blue-500 dark:text-blue-300 mt-2">{subtitle}</p>}
      </div>
    </div>
  )
}
