"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Activity,
  TrendingUp,
  Users,
  MapPin,
  Target,
  DollarSign,
  Eye,
  Clock,
  Cpu,
  Moon,
  Sun,
  Bell,
  Brain,
  Shield,
  Wifi,
  Database,
  Thermometer,
  LucideIcon,
} from "lucide-react"
import { ThemeProvider, useTheme } from "../contexts/theme-context"
import { FuturisticCard } from "../components/futuristic-card"
import { HolographicDisplay } from "../components/holographic-display"
import { NeuralNetworkBackground } from "../components/neural-network-bg"
import { AIInsightsPanel } from "../components/ai-insights-panel"
import { VoiceCommandInterface } from "../components/voice-command-interface"
import { PredictiveAnalytics } from "../components/predictive-analytics"
import { HeatmapVisualization } from "../components/heatmap-visualization"
import { AdvancedHeatmapControls } from "../components/advanced-heatmap-controls"

// Type definitions
interface LiveData {
  totalVisitors?: number
  activeZones?: number
  detectionAccuracy?: number
  systemUptime?: number
  peakZone?: string
  aiProcessingSpeed?: number
  networkLatency?: number
  dataProcessed?: number
  currentTraffic?: Record<string, number>
}

interface Recommendation {
  id: number
  product: string
  fromZone: string
  toZone: string
  revenueImpact: string
  confidence: number
  effort: string
  reason: string
  aiScore: number
  implementationTime: string
  riskLevel: string
}

interface Notification {
  id: number
  type: string
  message: string
  time: string
}

interface PerformanceMetric {
  name: string
  value: string
  color: string
  icon: LucideIcon
  trend: string
}

interface TabButtonProps {
  id: string
  label: string
  isActive: boolean
  onClick: (id: string) => void
  icon: LucideIcon
}

interface EnhancedMetricCardProps {
  metric: PerformanceMetric
}

interface EnhancedRecommendationCardProps {
  rec: Recommendation
}

function SmartZoneDashboard() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")
  const [liveData, setLiveData] = useState<LiveData>({})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedSeason, setSelectedSeason] = useState("summer")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Enhanced real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        totalVisitors: Math.floor(Math.random() * 100) + 1200,
        activeZones: 5,
        detectionAccuracy: 94.2 + Math.random() * 2,
        systemUptime: 99.8,
        peakZone: "B2",
        aiProcessingSpeed: 32 + Math.random() * 8,
        networkLatency: 12 + Math.random() * 8,
        dataProcessed: Math.floor(Math.random() * 1000) + 5000,
        currentTraffic: {
          A1: Math.floor(Math.random() * 50) + 120,
          A2: Math.floor(Math.random() * 40) + 100,
          B1: Math.floor(Math.random() * 60) + 150,
          B2: Math.floor(Math.random() * 70) + 180,
          C1: Math.floor(Math.random() * 30) + 70,
        },
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Enhanced recommendations with more features
  useEffect(() => {
    const mockRecommendations: Recommendation[] = [
      {
        id: 1,
        product: "Air Conditioners & Coolers",
        fromZone: "C1",
        toZone: "B2",
        revenueImpact: "₹2,45,000",
        confidence: 87,
        effort: "Medium",
        reason: "Summer peak traffic in B2, 180+ daily visitors",
        aiScore: 94,
        implementationTime: "2-3 days",
        riskLevel: "Low",
      },
      {
        id: 2,
        product: "Health Supplements",
        fromZone: "A1",
        toZone: "A2",
        revenueImpact: "₹1,85,000",
        confidence: 92,
        effort: "Low",
        reason: "High-margin product, adjacent zone optimization",
        aiScore: 96,
        implementationTime: "1 day",
        riskLevel: "Very Low",
      },
      {
        id: 3,
        product: "Premium Smartphones",
        fromZone: "B1",
        toZone: "A1",
        revenueImpact: "₹3,20,000",
        confidence: 78,
        effort: "High",
        reason: "Electronics zone synergy, festive season approach",
        aiScore: 89,
        implementationTime: "5-7 days",
        riskLevel: "Medium",
      },
    ]

    setRecommendations(mockRecommendations)
  }, [selectedSeason])

  // Notification system
  useEffect(() => {
    const mockNotifications: Notification[] = [
      { id: 1, type: "alert", message: "Zone A1 approaching capacity", time: "2 min ago" },
      { id: 2, type: "success", message: "AI model updated successfully", time: "5 min ago" },
      { id: 3, type: "info", message: "New seasonal pattern detected", time: "10 min ago" },
    ]
    setNotifications(mockNotifications)
  }, [])

  const zoneTrafficData = Object.entries(liveData.currentTraffic || {}).map(([zone, count]) => ({
    zone,
    visitors: count as number,
    capacity: 250,
    utilization: Math.round(((count as number) / 250) * 100),
  }))

  const seasonalTrendData = [
    { month: "Jan", traffic: 180, revenue: 45000, prediction: 185 },
    { month: "Feb", traffic: 190, revenue: 48000, prediction: 195 },
    { month: "Mar", traffic: 220, revenue: 55000, prediction: 225 },
    { month: "Apr", traffic: 280, revenue: 70000, prediction: 285 },
    { month: "May", traffic: 320, revenue: 85000, prediction: 330 },
    { month: "Jun", traffic: 380, revenue: 95000, prediction: 390 },
  ]

  const hourlyTrafficData = [
    { hour: "9AM", visitors: 45, predicted: 50 },
    { hour: "10AM", visitors: 78, predicted: 82 },
    { hour: "11AM", visitors: 120, predicted: 125 },
    { hour: "12PM", visitors: 180, predicted: 185 },
    { hour: "1PM", visitors: 220, predicted: 225 },
    { hour: "2PM", visitors: 195, predicted: 200 },
    { hour: "3PM", visitors: 165, predicted: 170 },
    { hour: "4PM", visitors: 140, predicted: 145 },
    { hour: "5PM", visitors: 200, predicted: 205 },
    { hour: "6PM", visitors: 250, predicted: 255 },
    { hour: "7PM", visitors: 180, predicted: 185 },
    { hour: "8PM", visitors: 120, predicted: 125 },
  ]

  const zonePerformanceData = [
    { name: "Electronics (A1)", value: 25, color: "#3B82F6" },
    { name: "Clothing (A2)", value: 20, color: "#10B981" },
    { name: "Groceries (B1)", value: 30, color: "#F59E0B" },
    { name: "Home & Garden (B2)", value: 15, color: "#8B5CF6" },
    { name: "Health & Beauty (C1)", value: 10, color: "#EF4444" },
  ]

  const performanceMetrics = [
    {
      name: "Revenue Increase",
      value: "12.4%",
      color: "#10B981",
      icon: TrendingUp,
      trend: "+2.1% from last month",
    },
    {
      name: "Customer Satisfaction",
      value: "+18%",
      color: "#3B82F6",
      icon: Users,
      trend: "Highest this quarter",
    },
    {
      name: "Detection Accuracy",
      value: `${liveData.detectionAccuracy?.toFixed(1)}%` || "94.2%",
      color: "#8B5CF6",
      icon: Target,
      trend: "Real-time monitoring",
    },
    {
      name: "System Uptime",
      value: "99.8%",
      color: "#F59E0B",
      icon: Activity,
      trend: "24/7 operational",
    },
  ]

  const TabButton: React.FC<TabButtonProps> = ({ id, label, isActive, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/25"
          : "bg-white/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 backdrop-blur-sm border border-blue-200 dark:border-blue-700"
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  )

  const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({ metric }) => {
    const Icon = metric.icon
    return (
      <FuturisticCard glowColor="blue" animated className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {metric.name}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metric.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{metric.trend}</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30" />
            <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
              <Icon size={28} style={{ color: metric.color }} />
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700" style={{ width: "75%" }} />
        </div>
      </FuturisticCard>
    )
  }

  const EnhancedRecommendationCard: React.FC<EnhancedRecommendationCardProps> = ({ rec }) => (
    <FuturisticCard glowColor="green" animated className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{rec.product}</h3>
            <div className="flex items-center space-x-1">
              <Brain size={16} className="text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">AI Score: {rec.aiScore}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.reason}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <MapPin size={12} className="text-gray-400" />
              <span>
                {rec.fromZone} → {rec.toZone}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} className="text-gray-400" />
              <span>{rec.implementationTime}</span>
            </div>
            <div
              className={`px-2 py-1 rounded ${
                rec.effort === "Low"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : rec.effort === "Medium"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}
            >
              {rec.effort} Effort
            </div>
            <div
              className={`px-2 py-1 rounded ${
                rec.riskLevel === "Very Low" || rec.riskLevel === "Low"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
              }`}
            >
              {rec.riskLevel} Risk
            </div>
          </div>
        </div>

        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-green-400">{rec.revenueImpact}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Projected Annual</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400"
                style={{ width: `${rec.confidence}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{rec.confidence}%</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg">
          Implement
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Details
        </button>
      </div>
    </FuturisticCard>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* AI Insights Panel */}
      <AIInsightsPanel />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <EnhancedMetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Holographic Displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FuturisticCard glowColor="cyan">
          <HolographicDisplay
            title="Total Visitors"
            value={liveData.totalVisitors || 1200}
            subtitle="Real-time count"
            color="cyan"
            animated
          />
        </FuturisticCard>
        <FuturisticCard glowColor="green">
          <HolographicDisplay
            title="AI Processing"
            value={`${liveData.aiProcessingSpeed?.toFixed(1) || 32} FPS`}
            subtitle="Neural network speed"
            color="green"
          />
        </FuturisticCard>
        <FuturisticCard glowColor="purple">
          <HolographicDisplay
            title="Data Processed"
            value={`${(liveData.dataProcessed || 5000) / 1000}K`}
            subtitle="Records per hour"
            color="purple"
          />
        </FuturisticCard>
        <FuturisticCard glowColor="yellow">
          <HolographicDisplay
            title="Network Latency"
            value={`${liveData.networkLatency?.toFixed(0) || 12}ms`}
            subtitle="Real-time response"
            color="yellow"
          />
        </FuturisticCard>
      </div>

      {/* Voice Command Interface */}
      <VoiceCommandInterface />

      {/* Live Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FuturisticCard glowColor="blue" className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Eye className="mr-2 text-blue-400" size={20} />
            Live Zone Traffic
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="zone" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="visitors" fill="url(#blueGradient)" />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </FuturisticCard>

        <FuturisticCard glowColor="green" className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Clock className="mr-2 text-green-400" size={20} />
            Hourly Traffic Pattern
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Area type="monotone" dataKey="visitors" stroke="#10B981" fill="url(#greenGradient)" />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#06B6D4"
                fill="url(#cyanGradient)"
                strokeDasharray="5 5"
              />
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </FuturisticCard>
      </div>

      {/* Zone Performance Distribution */}
      <FuturisticCard glowColor="purple" className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <Target className="mr-2 text-purple-400" size={20} />
          Zone Performance Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={zonePerformanceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {zonePerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            {zonePerformanceData.map((zone, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/20 rounded-lg backdrop-blur-sm"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: zone.color }}></div>
                  <span className="font-medium text-gray-900 dark:text-white">{zone.name}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">{zone.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </FuturisticCard>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Predictive Analytics */}
      <PredictiveAnalytics />

      <FuturisticCard glowColor="blue" className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <TrendingUp className="mr-2 text-blue-400" size={20} />
          Seasonal Traffic & Revenue Trends
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={seasonalTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: "8px",
              }}
            />
            <Line yAxisId="left" type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="prediction"
              stroke="#06B6D4"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </FuturisticCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FuturisticCard glowColor="green" className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Zone Utilization Rates</h3>
          <div className="space-y-4">
            {zoneTrafficData.map((zone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Zone {zone.zone}</span>
                  <span className="text-gray-600 dark:text-gray-300">{zone.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      zone.utilization > 80
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : zone.utilization > 60
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                    style={{ width: `${zone.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </FuturisticCard>

        <FuturisticCard glowColor="purple" className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">System Performance</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center">
                <Cpu className="mr-3 text-green-400" size={24} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">AI Processing Speed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Neural network inference</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-400">
                {liveData.aiProcessingSpeed?.toFixed(1) || 32} FPS
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center">
                <Wifi className="mr-3 text-blue-400" size={24} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Network Status</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time connectivity</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-400">{liveData.networkLatency?.toFixed(0) || 12}ms</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center">
                <Database className="mr-3 text-purple-400" size={24} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Data Processing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Records per hour</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-400">
                {((liveData.dataProcessed || 5000) / 1000).toFixed(1)}K
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center">
                <Shield className="mr-3 text-yellow-400" size={24} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Security Status</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System integrity</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-400">Secure</span>
            </div>
          </div>
        </FuturisticCard>
      </div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-8">
      <FuturisticCard glowColor="purple" className="p-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="text-white" size={32} />
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Optimization Engine</h2>
              <p className="text-blue-100">Neural network analysis with 94.2% accuracy</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">127</p>
              <p className="text-blue-100 text-sm">Patterns Analyzed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">15.2s</p>
              <p className="text-blue-100 text-sm">Processing Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">98.7%</p>
              <p className="text-blue-100 text-sm">Model Confidence</p>
            </div>
          </div>
        </div>
      </FuturisticCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <EnhancedRecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>

      <FuturisticCard glowColor="green" className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <DollarSign className="mr-2 text-green-400" size={20} />
          Projected Revenue Impact Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-3xl font-bold text-green-400">₹7,50,000</p>
            <p className="text-gray-600 dark:text-gray-300">Total Annual Impact</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-3xl font-bold text-blue-400">85.7%</p>
            <p className="text-gray-600 dark:text-gray-300">Average Confidence</p>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-3xl font-bold text-purple-400">6 months</p>
            <p className="text-gray-600 dark:text-gray-300">Payback Period</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-3xl font-bold text-yellow-400">15.2%</p>
            <p className="text-gray-600 dark:text-gray-300">ROI Increase</p>
          </div>
        </div>
      </FuturisticCard>
    </div>
  )

  const renderHeatmap = () => (
    <div className="space-y-8">
      {/* Heatmap Controls */}
      <AdvancedHeatmapControls />

      {/* Main Heatmap Visualization */}
      <HeatmapVisualization />

      {/* Additional Heatmap Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FuturisticCard glowColor="red" className="p-6">
          <div className="text-center">
            <div className="p-4 bg-red-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Thermometer className="text-red-400" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Peak Heat Zone</h3>
            <p className="text-2xl font-bold text-red-400 mb-1">Zone B2</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">87% intensity</p>
          </div>
        </FuturisticCard>

        <FuturisticCard glowColor="blue" className="p-6">
          <div className="text-center">
            <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Activity className="text-blue-400" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Movement Flow</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">2.3 m/s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average speed</p>
          </div>
        </FuturisticCard>

        <FuturisticCard glowColor="purple" className="p-6">
          <div className="text-center">
            <div className="p-4 bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="text-purple-400" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Avg Dwell Time</h3>
            <p className="text-2xl font-bold text-purple-400 mb-1">4.2 min</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Per zone visit</p>
          </div>
        </FuturisticCard>
      </div>
    </div>
  )

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100"
      }`}
    >
      <NeuralNetworkBackground />

      {/* Enhanced Header */}
      <div className="backdrop-blur-xl bg-white/95 dark:bg-blue-950/95 shadow-2xl border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-lg opacity-30" />
                <div className="relative p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-700/20 backdrop-blur-sm">
                  <Brain className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  SmartZone AI
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Walmart Store Optimization Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Neural Network Active</span>
              </div>

              <div className="relative">
                <button className="p-2 rounded-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors">
                  <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                {notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{notifications.length}</span>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
              </button>

              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 text-gray-900 dark:text-white backdrop-blur-sm"
              >
                <option value="summer">Summer Season</option>
                <option value="monsoon">Monsoon Season</option>
                <option value="winter">Winter Season</option>
                <option value="festive">Festive Season</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            id="overview"
            label="Neural Overview"
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
            icon={Eye}
          />
          <TabButton
            id="analytics"
            label="Predictive Analytics"
            isActive={activeTab === "analytics"}
            onClick={setActiveTab}
            icon={TrendingUp}
          />
          <TabButton
            id="recommendations"
            label="AI Recommendations"
            isActive={activeTab === "recommendations"}
            onClick={setActiveTab}
            icon={Brain}
          />
          <TabButton
            id="heatmap"
            label="Live Heatmap"
            isActive={activeTab === "heatmap"}
            onClick={setActiveTab}
            icon={Thermometer}
          />
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "recommendations" && renderRecommendations()}
          {activeTab === "heatmap" && renderHeatmap()}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SmartZoneDashboard />
    </ThemeProvider>
  )
}
