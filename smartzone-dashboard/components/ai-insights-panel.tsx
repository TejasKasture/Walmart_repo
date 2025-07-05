"use client"

import { useState, useEffect } from "react"
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Zap } from "lucide-react"
import { FuturisticCard } from "./futuristic-card"

export function AIInsightsPanel() {
  const [insights, setInsights] = useState([])
  const [currentInsight, setCurrentInsight] = useState(0)

  useEffect(() => {
    const aiInsights = [
      {
        type: "prediction",
        icon: Brain,
        title: "Traffic Surge Predicted",
        message: "AI forecasts 40% traffic increase in Electronics zone at 3 PM",
        confidence: 94,
        color: "blue",
      },
      {
        type: "optimization",
        icon: Lightbulb,
        title: "Layout Optimization",
        message: "Moving premium items to zone B2 could increase revenue by 15%",
        confidence: 87,
        color: "yellow",
      },
      {
        type: "trend",
        icon: TrendingUp,
        title: "Seasonal Pattern Detected",
        message: "Summer products showing 23% higher engagement in morning hours",
        confidence: 91,
        color: "blue",
      },
      {
        type: "alert",
        icon: AlertTriangle,
        title: "Congestion Warning",
        message: "Zone A1 approaching capacity limit - consider crowd management",
        confidence: 96,
        color: "yellow",
      },
    ]

    setInsights(aiInsights)

    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % aiInsights.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (insights.length === 0) return null

  const insight = insights[currentInsight]
  const Icon = insight.icon

  return (
    <FuturisticCard glowColor={insight.color} animated className="p-6">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-full bg-${insight.color}-500/20`}>
          <Icon size={24} className={`text-${insight.color}-400`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
            <div className="flex items-center space-x-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{insight.confidence}% confidence</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{insight.message}</p>
          <div className="mt-3 flex space-x-2">
            {insights.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  index === currentInsight ? `bg-${insight.color}-400` : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </FuturisticCard>
  )
}
