import { Button } from "@/components/ui/button"
import { SavedPlay } from "./types"

interface SavedPlaysProps {
  savedPlays: SavedPlay[]
  onLoad: (play: SavedPlay) => void
  onDelete: (id: string) => void
}

export function SavedPlays({ savedPlays, onLoad, onDelete }: SavedPlaysProps) {
  if (savedPlays.length === 0) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Saved Plays ({savedPlays.length})</h3>
      <div className="space-y-2">
        {savedPlays.map((play) => (
          <div key={play.id} className="flex items-center justify-between bg-gray-700 p-3 rounded hover:bg-gray-600">
            <div>
              <p className="text-white font-medium">{play.name}</p>
              <p className="text-sm text-gray-400">
                {play.gameMode} • {play.frames.length} snapshots
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onLoad(play)} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                Load
              </Button>
              <Button
                onClick={() => onDelete(play.id)}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
