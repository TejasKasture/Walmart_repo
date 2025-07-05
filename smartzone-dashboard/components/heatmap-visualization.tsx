"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { FuturisticCard } from "./futuristic-card"
import { Thermometer, Users, MapPin, Activity, Zap, Clock } from "lucide-react"

interface HeatmapData {
  x: number
  y: number
  intensity: number
  zone: string
  visitors: number
}

export function HeatmapVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [heatmapMode, setHeatmapMode] = useState<"density" | "movement" | "dwell">("density")

  // Store layout zones
  const zones = [
    { id: "A1", name: "Electronics", x: 50, y: 80, width: 120, height: 80, color: "#3B82F6" },
    { id: "A2", name: "Clothing", x: 200, y: 80, width: 120, height: 80, color: "#10B981" },
    { id: "B1", name: "Groceries", x: 50, y: 200, width: 120, height: 100, color: "#F59E0B" },
    { id: "B2", name: "Home & Garden", x: 200, y: 200, width: 120, height: 100, color: "#8B5CF6" },
    { id: "C1", name: "Health & Beauty", x: 125, y: 330, width: 120, height: 70, color: "#EF4444" },
  ]

  // Generate realistic heatmap data
  useEffect(() => {
    const generateHeatmapData = () => {
      const data: HeatmapData[] = []

      zones.forEach((zone) => {
        // Generate multiple heat points within each zone
        const pointsPerZone = Math.floor(Math.random() * 15) + 10

        for (let i = 0; i < pointsPerZone; i++) {
          const x = zone.x + Math.random() * zone.width
          const y = zone.y + Math.random() * zone.height

          // Different intensity patterns based on mode
          let intensity = 0
          switch (heatmapMode) {
            case "density":
              intensity = Math.random() * 0.8 + 0.2 // Customer density
              break
            case "movement":
              intensity = Math.random() * 0.6 + 0.1 // Movement speed
              break
            case "dwell":
              intensity = Math.random() * 0.9 + 0.1 // Dwell time
              break
          }

          data.push({
            x,
            y,
            intensity,
            zone: zone.id,
            visitors: Math.floor(intensity * 50) + 10,
          })
        }
      })

      setHeatmapData(data)
    }

    generateHeatmapData()
    const interval = setInterval(generateHeatmapData, 3000)
    return () => clearInterval(interval)
  }, [heatmapMode])

  // Draw heatmap on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw store layout
    zones.forEach((zone) => {
      ctx.fillStyle = selectedZone === zone.id ? `${zone.color}40` : `${zone.color}20`
      ctx.strokeStyle = zone.color
      ctx.lineWidth = 2
      ctx.fillRect(zone.x, zone.y, zone.width, zone.height)
      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height)

      // Zone labels
      ctx.fillStyle = zone.color
      ctx.font = "12px Inter, sans-serif"
      ctx.fontWeight = "600"
      ctx.textAlign = "center"
      ctx.fillText(zone.name, zone.x + zone.width / 2, zone.y + zone.height / 2)
      ctx.fillText(zone.id, zone.x + zone.width / 2, zone.y + zone.height / 2 + 15)
    })

    // Draw heatmap points
    heatmapData.forEach((point) => {
      const radius = 15 + point.intensity * 20
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius)

      // Color based on intensity and mode
      let color = ""
      switch (heatmapMode) {
        case "density":
          color = `rgba(255, ${255 - point.intensity * 200}, 0, ${point.intensity * 0.6})`
          break
        case "movement":
          color = `rgba(0, ${100 + point.intensity * 155}, 255, ${point.intensity * 0.5})`
          break
        case "dwell":
          color = `rgba(${100 + point.intensity * 155}, 0, 255, ${point.intensity * 0.4})`
          break
      }

      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw entrance/exit points
    const entrances = [
      { x: 25, y: 150, label: "Main Entrance" },
      { x: 345, y: 250, label: "Side Exit" },
      { x: 185, y: 25, label: "Mall Entrance" },
    ]

    entrances.forEach((entrance) => {
      ctx.fillStyle = "#22C55E"
      ctx.beginPath()
      ctx.arc(entrance.x, entrance.y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#16A34A"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(entrance.label, entrance.x, entrance.y - 15)
    })
  }, [heatmapData, selectedZone, heatmapMode])

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is within any zone
    const clickedZone = zones.find(
      (zone) => x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height,
    )

    setSelectedZone(clickedZone ? clickedZone.id : null)
  }

  const getZoneStats = (zoneId: string) => {
    const zonePoints = heatmapData.filter((point) => point.zone === zoneId)
    const avgIntensity = zonePoints.reduce((sum, point) => sum + point.intensity, 0) / zonePoints.length || 0
    const totalVisitors = zonePoints.reduce((sum, point) => sum + point.visitors, 0)

    return {
      intensity: avgIntensity,
      visitors: totalVisitors,
      hotspots: zonePoints.filter((point) => point.intensity > 0.7).length,
    }
  }

  const modeConfig = {
    density: {
      title: "Customer Density",
      description: "Real-time visitor concentration",
      icon: Users,
      color: "red",
      unit: "people/m²",
    },
    movement: {
      title: "Movement Patterns",
      description: "Customer flow and navigation",
      icon: Activity,
      color: "blue",
      unit: "m/min",
    },
    dwell: {
      title: "Dwell Time",
      description: "Time spent in each area",
      icon: Clock,
      color: "purple",
      unit: "minutes",
    },
  }

  const currentMode = modeConfig[heatmapMode]
  const ModeIcon = currentMode.icon

  return (
    <FuturisticCard glowColor={currentMode.color} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full bg-${currentMode.color}-500/20`}>
            <ModeIcon className={`text-${currentMode.color}-400`} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentMode.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentMode.description}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {Object.entries(modeConfig).map(([mode, config]) => {
            const Icon = config.icon
            return (
              <button
                key={mode}
                onClick={() => setHeatmapMode(mode as typeof heatmapMode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  heatmapMode === mode
                    ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                    : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{config.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Canvas */}
        <div className="lg:col-span-2">
          <div className="relative bg-gray-900 rounded-xl p-4 border border-gray-700">
            <canvas
              ref={canvasRef}
              width={400}
              height={450}
              onClick={handleCanvasClick}
              className="w-full h-auto cursor-pointer rounded-lg"
              style={{ maxHeight: "450px" }}
            />

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
              <h4 className="text-white text-sm font-medium mb-2">Intensity Scale</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300">Low</span>
                <div className="w-20 h-3 rounded-full bg-gradient-to-r from-blue-500/30 via-yellow-500/50 to-red-500/70" />
                <span className="text-xs text-gray-300">High</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-300">Entrances</span>
              </div>
            </div>

            {/* Real-time indicator */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Live Tracking</span>
            </div>
          </div>
        </div>

        {/* Zone Statistics */}
        <div className="space-y-4">
          <div className="bg-white/5 dark:bg-black/20 rounded-xl p-4 backdrop-blur-sm">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Thermometer className="mr-2 text-orange-400" size={18} />
              Zone Analytics
            </h4>

            {selectedZone ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Selected Zone:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedZone}</span>
                </div>

                {(() => {
                  const stats = getZoneStats(selectedZone)
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Intensity:</span>
                        <span className={`font-medium text-${currentMode.color}-400`}>
                          {(stats.intensity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Visitors:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{stats.visitors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Hotspots:</span>
                        <span className="font-medium text-red-400">{stats.hotspots}</span>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Click on a zone to view details</p>
            )}
          </div>

          {/* Overall Statistics */}
          <div className="space-y-3">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="text-blue-400" size={16} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Active</span>
                </div>
                <span className="font-bold text-blue-400">
                  {heatmapData.reduce((sum, point) => sum + point.visitors, 0)}
                </span>
              </div>
            </div>

            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-green-400" size={16} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Peak Zone</span>
                </div>
                <span className="font-bold text-green-400">
                  {
                    zones.reduce((peak, zone) => {
                      const stats = getZoneStats(zone.id)
                      const peakStats = getZoneStats(peak.id)
                      return stats.intensity > peakStats.intensity ? zone : peak
                    }).id
                  }
                </span>
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="text-purple-400" size={16} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Intensity</span>
                </div>
                <span className="font-bold text-purple-400">
                  {((heatmapData.reduce((sum, point) => sum + point.intensity, 0) / heatmapData.length) * 100).toFixed(
                    1,
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm">
              Export Heatmap Data
            </button>
            <button className="w-full bg-white/10 dark:bg-black/20 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-colors text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </FuturisticCard>
  )
}
