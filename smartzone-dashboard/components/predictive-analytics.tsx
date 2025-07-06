"use client"

import React, { useState, useEffect } from "react"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"
import { FuturisticCard } from "./futuristic-card"
import { SnowflakeIcon as Crystal, TrendingUp, AlertCircle } from "lucide-react"

interface Prediction {
  hour: string
  current: number
  predicted: number
  confidence: number
}

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedMetric, setSelectedMetric] = useState("traffic")

  useEffect(() => {
    const generatePredictions = () => {
      const hours = Array.from({ length: 24 }, (_, i) => i)
      const trafficPredictions: Prediction[] = hours.map((hour) => ({
        hour: `${hour}:00`,
        current: Math.floor(Math.random() * 200) + 100,
        predicted: Math.floor(Math.random() * 250) + 120,
        confidence: Math.floor(Math.random() * 20) + 80,
      }))

      setPredictions(trafficPredictions)
    }

    generatePredictions()
    const interval = setInterval(generatePredictions, 10000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { id: "traffic", label: "Traffic Flow", color: "cyan" },
    { id: "revenue", label: "Revenue", color: "green" },
    { id: "conversion", label: "Conversion Rate", color: "purple" },
  ]

  return (
    <FuturisticCard glowColor="purple" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Crystal className="text-purple-400" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Analytics</h3>
        </div>

        <div className="flex space-x-2">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedMetric === metric.id
                  ? `bg-${metric.color}-500/20 text-${metric.color}-400 border border-${metric.color}-500/30`
                  : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={predictions}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="current" stroke="#3B82F6" fillOpacity={1} fill="url(#currentGradient)" />
            <Area type="monotone" dataKey="predicted" stroke="#10B981" fillOpacity={1} fill="url(#predictedGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <TrendingUp className="text-blue-400 mx-auto mb-2" size={20} />
          <p className="text-sm text-gray-400">Accuracy</p>
          <p className="text-lg font-bold text-blue-400">94.2%</p>
        </div>

        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <Crystal className="text-green-400 mx-auto mb-2" size={20} />
          <p className="text-sm text-gray-400">Predictions</p>
          <p className="text-lg font-bold text-green-400">24h</p>
        </div>

        <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <AlertCircle className="text-yellow-400 mx-auto mb-2" size={20} />
          <p className="text-sm text-gray-400">Alerts</p>
          <p className="text-lg font-bold text-yellow-400">3</p>
        </div>
      </div>
    </FuturisticCard>
  )
}
