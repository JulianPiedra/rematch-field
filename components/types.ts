export type GameMode = "3v3" | "4v4" | "5v5"

export interface Player {
  id: string
  team: "team1" | "team2"
  x: number
  y: number
  number: number
}

export interface Ball {
  x: number
  y: number
}

export interface DrawingPoint {
  x: number
  y: number
}

export interface DrawingLine {
  id: string
  points: DrawingPoint[]
  color: string
  width: number
  isArrow: boolean
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
  gameMode: GameMode
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

export const initialPositions = {
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
