"use client"

import { useState } from "react"
import { FuturisticCard } from "./futuristic-card"
import { Calendar, Clock, Filter, Download, Share2, Settings } from "lucide-react"

export function AdvancedHeatmapControls() {
  const [timeRange, setTimeRange] = useState("1h")
  const [dateRange, setDateRange] = useState("today")
  const [filters, setFilters] = useState({
    minIntensity: 0,
    maxIntensity: 100,
    showEntrances: true,
    showExits: true,
    showPaths: false,
  })

  const timeRanges = [
    { value: "15m", label: "15 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "24h", label: "24 Hours" },
  ]

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ]

  return (
    <FuturisticCard glowColor="cyan" className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <Settings className="mr-2 text-cyan-400" size={18} />
          Heatmap Controls
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            <Clock className="inline mr-1" size={14} />
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="inline mr-1" size={14} />
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-sm"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Intensity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            <Filter className="inline mr-1" size={14} />
            Intensity Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={filters.minIntensity}
              onChange={(e) => setFilters({ ...filters, minIntensity: Number.parseInt(e.target.value) })}
              className="w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-sm"
              placeholder="Min"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={filters.maxIntensity}
              onChange={(e) => setFilters({ ...filters, maxIntensity: Number.parseInt(e.target.value) })}
              className="w-full bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white backdrop-blur-sm"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Actions</label>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500/20 text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-500/30 transition-colors text-sm flex items-center justify-center">
              <Download size={14} className="mr-1" />
              Export
            </button>
            <button className="flex-1 bg-green-500/20 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm flex items-center justify-center">
              <Share2 size={14} className="mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/5">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showEntrances}
              onChange={(e) => setFilters({ ...filters, showEntrances: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Show Entrances</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showExits}
              onChange={(e) => setFilters({ ...filters, showExits: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Show Exits</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showPaths}
              onChange={(e) => setFilters({ ...filters, showPaths: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Show Movement Paths</span>
          </label>
        </div>
      </div>
    </FuturisticCard>
  )
}
