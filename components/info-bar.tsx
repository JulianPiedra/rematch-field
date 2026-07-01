import { Ball, Player } from "./types"

interface InfoBarProps {
  players: Player[]
  ball: Ball
}

export function InfoBar({ players, ball }: InfoBarProps) {
  const team1Players = players.filter((p) => p.team === "team1").sort((a, b) => a.number - b.number)
  const team2Players = players.filter((p) => p.team === "team2").sort((a, b) => a.number - b.number)
  const team1Visible = team1Players.filter((p) => p.visible !== false).length
  const team2Visible = team2Players.filter((p) => p.visible !== false).length

  return (
    <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
      <div>
        <p className="font-semibold text-white">Blue Team</p>
        <p>
          {team1Visible}/{team1Players.length} visible
        </p>
      </div>
      <div>
        <p className="font-semibold text-white">Ball</p>
        <p>
          {Math.round(ball.x)}%, {Math.round(ball.y)}%
        </p>
      </div>
      <div>
        <p className="font-semibold text-white">Black Team</p>
        <p>
          {team2Visible}/{team2Players.length} visible
        </p>
      </div>
    </div>
  )
}
