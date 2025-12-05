"use client"
import TacticalBoard from "@/components/tactical-board"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Rematch Tactical Board</h1>
        <TacticalBoard />
      </div>
    </main>
  )
}
