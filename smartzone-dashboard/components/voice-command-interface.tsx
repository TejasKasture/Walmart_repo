"use client"

import { useState } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { FuturisticCard } from "./futuristic-card"

export function VoiceCommandInterface() {
  const [isListening, setIsListening] = useState(false)
  const [command, setCommand] = useState("")
  const [response, setResponse] = useState("")

  const mockCommands = [
    { trigger: "show zone traffic", response: "Displaying real-time zone traffic data" },
    { trigger: "optimize layout", response: "Generating AI-powered layout recommendations" },
    { trigger: "system status", response: "All systems operational - 99.8% uptime" },
    { trigger: "revenue forecast", response: "Projected 12.4% revenue increase this quarter" },
  ]

  const handleVoiceCommand = () => {
    setIsListening(!isListening)

    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)]
        setCommand(randomCommand.trigger)
        setResponse(randomCommand.response)
        setIsListening(false)
      }, 2000)
    }
  }

  return (
    <FuturisticCard glowColor="green" className="p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleVoiceCommand}
          className={`p-3 rounded-full transition-all duration-300 ${
            isListening
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Volume2 size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Voice Assistant</span>
          </div>

          {isListening && <p className="text-sm text-blue-400 animate-pulse">Listening...</p>}

          {command && !isListening && (
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">Command: "{command}"</p>
              <p className="text-sm text-green-400">{response}</p>
            </div>
          )}

          {!command && !isListening && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to activate voice commands</p>
          )}
        </div>
      </div>
    </FuturisticCard>
  )
}
