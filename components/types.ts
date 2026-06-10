export interface Player {
  id: string
  team: "team1" | "team2"
  x: number
  y: number
  number: number
  name?: string
  visible?: boolean
}

export interface Ball {
  x: number
  y: number
}

export interface DrawingPoint {
  x: number
  y: number
}

export type DrawingShapeType = "freehand" | "straight" | "circle"

export interface DrawingLine {
  id: string
  points: DrawingPoint[]
  color: string
  width: number
  isArrow: boolean
  shape?: DrawingShapeType
}

export interface PlayFrame {
  players: Player[]
  ball: Ball
  timestamp: number
  drawings: DrawingLine[]
}

export interface SavedPlay {
  id: string
  name: string
  frames: PlayFrame[]
}

export const initialTeam1: Player[] = [
  { id: "w1", team: "team1", number: 1, x: 40, y: 50 },
  { id: "w2", team: "team1", number: 2, x: 30, y: 20 },
  { id: "w3", team: "team1", number: 3, x: 30, y: 80 },
  { id: "w4", team: "team1", number: 4, x: 25, y: 50 },
  { id: "w5", team: "team1", number: 5, x: 3, y: 50 },
]

export const initialTeam2: Player[] = [
  { id: "b1", team: "team2", number: 1, x: 60, y: 50 },
  { id: "b2", team: "team2", number: 2, x: 70, y: 20 },
  { id: "b3", team: "team2", number: 3, x: 70, y: 80 },
  { id: "b4", team: "team2", number: 4, x: 75, y: 50 },
  { id: "b5", team: "team2", number: 5, x: 97, y: 50 },
]

export function createInitialPlayers(): Player[] {
  return [
    ...initialTeam1.map((player) => ({ ...player, team: "team1" as const })),
    ...initialTeam2.map((player) => ({ ...player, team: "team2" as const })),
  ]
}
