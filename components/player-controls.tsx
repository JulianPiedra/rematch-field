import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { Player } from "./types"

interface PlayerControlsProps {
  players: Player[]
  controlsOpen: boolean
  onToggleControls: () => void
  onPlayerNameChange: (playerId: string, name: string) => void
  onPlayerVisibilityChange: (playerId: string, visible: boolean) => void
}

export function PlayerControls({
  players,
  controlsOpen,
  onToggleControls,
  onPlayerNameChange,
  onPlayerVisibilityChange,
}: PlayerControlsProps) {
  const team1Players = players.filter((p) => p.team === "team1").sort((a, b) => a.number - b.number)
  const team2Players = players.filter((p) => p.team === "team2").sort((a, b) => a.number - b.number)

  const renderVisibilityToggle = (player: Player) => {
    const isVisible = player.visible !== false

    return (
      <button
        type="button"
        aria-label={isVisible ? `Hide player ${player.number}` : `Show player ${player.number}`}
        title={isVisible ? "Hide player" : "Show player"}
        onClick={() => onPlayerVisibilityChange(player.id, !isVisible)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
          isVisible
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            : "border-gray-600 bg-gray-900 text-gray-400 hover:bg-gray-800"
        }`}
      >
        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <>
      <Button
        onClick={onToggleControls}
        className={controlsOpen ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-700 hover:bg-gray-600"}
      >
        {controlsOpen ? "👤 Player controls" : "👤 Player controls"}
      </Button>

      {controlsOpen && (
        <div className="grid gap-4 basis-full w-full lg:grid-cols-2">
          <div className="rounded-md border border-gray-700 bg-gray-900/60 p-3">
            <p className="mb-2 font-semibold text-white">Blue Team</p>
            <div className="space-y-2">
              {team1Players.map((player) => (
                <div key={player.id} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-gray-300">#{player.number}</span>
                  <input
                    type="text"
                    value={player.name ?? player.number.toString()}
                    onChange={(e) => onPlayerNameChange(player.id, e.target.value)}
                    maxLength={30}
                    className="flex-1 rounded border border-gray-600 bg-gray-950 px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                  />
                  {renderVisibilityToggle(player)}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-gray-700 bg-gray-900/60 p-3">
            <p className="mb-2 font-semibold text-white">Black Team</p>
            <div className="space-y-2">
              {team2Players.map((player) => (
                <div key={player.id} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-gray-300">#{player.number}</span>
                  <input
                    type="text"
                    value={player.name ?? player.number.toString()}
                    onChange={(e) => onPlayerNameChange(player.id, e.target.value)}
                    maxLength={30}
                    className="flex-1 rounded border border-gray-600 bg-gray-950 px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                  />
                  {renderVisibilityToggle(player)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
