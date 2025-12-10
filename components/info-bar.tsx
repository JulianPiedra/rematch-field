import { Ball, Player } from "./types"

interface InfoBarProps {
  players: Player[]
  ball: Ball
}

export function InfoBar({ players, ball }: InfoBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
      <div>
        <p className="font-semibold text-white">White Team</p>
        <p>{players.filter((p) => p.team === "team1").length} players</p>
      </div>
      <div>
        <p className="font-semibold text-white">Ball</p>
        <p>
          {Math.round(ball.x)}%, {Math.round(ball.y)}%
        </p>
      </div>
      <div>
        <p className="font-semibold text-white">Black Team</p>
        <p>{players.filter((p) => p.team === "team2").length} players</p>
      </div>
    </div>
  )
}
