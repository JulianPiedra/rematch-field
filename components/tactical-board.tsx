"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import DraggablePlayer from "./draggable-player"
import DraggableBall from "./draggable-ball"

type GameMode = "3v3" | "4v4" | "5v5"

interface Player {
  id: string
  team: "team1" | "team2"
  x: number
  y: number
  number: number
}

interface Ball {
  x: number
  y: number
}
const initialTeam1: Player[] = [
  { id: "w1", team: "team1", number: 1, x: 40, y: 50 },
  { id: "w2", team: "team1", number: 2, x: 30, y: 20 },
  { id: "w3", team: "team1", number: 3, x: 30, y: 80 },
  { id: "w4", team: "team1", number: 4, x: 25, y: 50 },
  { id: "w5", team: "team1", number: 5, x: 3, y: 50 },
]

const initialTeam2: Player[] = [
  { id: "b1", team: "team2", number: 1, x: 60, y: 50 },
  { id: "b2", team: "team2", number: 2, x: 70, y: 20 },
  { id: "b3", team: "team2", number: 3, x: 70, y: 80 },
  { id: "b4", team: "team2", number: 4, x: 75, y: 50 },
  { id: "b5", team: "team2", number: 5, x: 97, y: 50 },
]
const initialPositions = {
  "3v3": {
    team1: [
      { id: "w1", number: 1, x: 30, y: 50 },
      { id: "w2", number: 2, x: 20, y: 30 },
      { id: "w3", number: 3, x: 20, y: 70 },
    ],
    team2: [
      { id: "b1", number: 1, x: 70, y: 50 },
      { id: "b2", number: 2, x: 80, y: 30 },
      { id: "b3", number: 3, x: 80, y: 70 },
    ],
  },

  "4v4": {
    team1: [
      { id: "w1", number: 1, x: 28, y: 50 },
      { id: "w2", number: 2, x: 18, y: 30 },
      { id: "w3", number: 3, x: 18, y: 70 },
      { id: "w4", number: 4, x: 10, y: 50 },
    ],
    team2: [
      { id: "b1", number: 1, x: 72, y: 50 },
      { id: "b2", number: 2, x: 82, y: 30 },
      { id: "b3", number: 3, x: 82, y: 70 },
      { id: "b4", number: 4, x: 90, y: 50 },
    ],
  },

  "5v5": {
    team1: initialTeam1,
    team2: initialTeam2,
  },
}

const modes = {
  "3v3": {
    team1: initialTeam1.slice(0, 3),
    team2: initialTeam2.slice(0, 3),
  },
  "4v4": {
    team1: initialTeam1.slice(0, 4),
    team2: initialTeam2.slice(0, 4),
  },
  "5v5": {
    team1: initialTeam1,
    team2: initialTeam2,
  },
}


export default function TacticalBoard() {
  const [gameMode, setGameMode] = useState<GameMode>("5v5")
  const [ball, setBall] = useState<Ball>({ x: 51.5, y: 50 })
  const boardRef = useRef<HTMLDivElement>(null)

    const [players, setPlayers] = useState<Player[]>([
    ...initialTeam1,
    ...initialTeam2,
  ])
useEffect(() => {
  const current = initialPositions[gameMode]

  const newPlayers = [
    ...current.team1.map(p => ({ ...p, team: "team1" as const })),
    ...current.team2.map(p => ({ ...p, team: "team2" as const })),
  ]

  setPlayers(newPlayers)

  // Si querés mover la pelota al centro también:
  setBall({ x: 51.5, y: 50 })
}, [gameMode])


  const handlePlayerMove = (playerId: string, x: number, y: number) => {
    setPlayers(
      players.map((p) =>
        p.id === playerId ? { ...p, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : p,
      ),
    )
  }
  

  const handleBallMove = (x: number, y: number) => {
    setBall({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  const resetPositions = () => {

     setPlayers([
      ...initialTeam1,
      ...initialTeam2,
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setGameMode("3v3")}
          variant={gameMode === "3v3" ? "default" : "outline"}
          className="bg-green-600 hover:bg-green-700 text-white border-green-500"
        >
          3v3
        </Button>
        <Button
          onClick={() => setGameMode("4v4")}
          variant={gameMode === "4v4" ? "default" : "outline"}
          className="bg-green-600 hover:bg-green-700 text-white border-green-500"
        >
          4v4
        </Button>
        <Button
          onClick={() => setGameMode("5v5")}
          variant={gameMode === "5v5" ? "default" : "outline"}
          className="bg-green-600 hover:bg-green-700 text-white border-green-500"
        >
          5v5
        </Button>
        <Button
          onClick={resetPositions}
          variant="outline"
          className="ml-auto border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
        >
          Reset
        </Button>
      </div>

      <div
        ref={boardRef}
        className="relative w-full bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden shadow-2xl"
        style={{ aspectRatio: "2 / 1" }}
      >
        {/* Field Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 50"
        >
          <defs>
            <pattern id="field-lines" x="0" y="0" width="100%" height="100%" patternUnits="objectBoundingBox">
              {/* Franjas verticales de colores alternados - 34 franjas */}
              {Array.from({ length: 34 }).map((_, i) => {
                const x = (i / 34) * 100
                const width = (1 / 34) * 100
                const isEven = i % 2 === 0
                return (
                  <rect
                    key={`stripe-${i}`}
                    x={`${x}%`}
                    y="0"
                    width={`${width}%`}
                    height="100%"
                    fill={isEven ? "rgba(0,100,0,0.15)" : "rgba(0,150,0,0.15)"}
                  />
                )
              })}

              {/* Center line */}
              <line x1="51.5%" y1="0" x2="51.5%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3%" />

              {/* Center circle */}
              <circle cx="51.5%" cy="50%" r="8%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2%" />

              {/* Center spot */}
              <circle cx="51.5%" cy="50%" r="0.8%" fill="rgba(255,255,255,0.6)" />

              {/* GOAL AREAS - LEFT SIDE */}
              {/* Área grande (penal) - left */}
              <rect
                x="-1"
                y="15%"
                width="20%"
                height="70%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.2%"
              />

              {/* Área chica - left */}
              <rect
                x="-1%"
                y="30%"
                width="8%"
                height="40%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.2%"
              />

              {/* Media luna del punto penal - left (semicírculo fuera del área) */}
              <svg width="100%" height="100%">
                <clipPath id="cut">
                  <rect x="19%" y="0" width="50%" height="100%" />
                </clipPath>

                <circle
                  cx="15%"
                  cy="50%"
                  r="8%"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.2%"
                  clipPath="url(#cut)"
                />
              </svg>

              {/* Punto penal - left */}
              <circle cx="12.2" cy="25" r="0.5%" fill="rgba(255,255,255,0.6)" />

              {/* GOAL AREAS - RIGHT SIDE */}
              {/* Área grande (penal) - right */}
              <rect
                x="81%"
                y="15%"
                width="20%"
                height="70%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.2%"
              />

              {/* Área chica - right */}
              <rect
                x="93%"
                y="30%"
                width="8%"
                height="40%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.2%"
              />

              {/* Media luna del punto penal - right (semicírculo fuera del área) */}
              <svg width="100%" height="100%">
                <clipPath id="rightArc">
                  <rect x="61%" y="0" width="20%" height="100%" />
                </clipPath>

                <circle
                  cx="85%"
                  cy="50%"
                  r="8%"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.2%"
                  clipPath="url(#rightArc)"
                />
              </svg>




              {/* Punto penal - right */}
              <circle cx="87.8" cy="25" r="0.5%" fill="rgba(255,255,255,0.6)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#field-lines)" />
        </svg>

        {/* Players */}
        {players.map((player) => (
          <DraggablePlayer key={player.id} player={player} onMove={handlePlayerMove} boardRef={boardRef as React.RefObject<HTMLDivElement>} />
        ))}

        {/* Ball */}
        <DraggableBall ball={ball} onMove={handleBallMove} boardRef={boardRef as React.RefObject<HTMLDivElement>} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
        <div>
          <p className="font-semibold text-white">Black team</p>
          <p>{players.filter((p) => p.team === "team1").length} players</p>
        </div>
        <div>
          <p className="font-semibold text-white">Ball</p>
          <p>
            {Math.round(ball.x)}%, {Math.round(ball.y)}%
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">White team </p>
          <p>{players.filter((p) => p.team === "team2").length} players</p>
        </div>
      </div>
    </div>
  )
}