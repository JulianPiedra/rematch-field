import { Button } from "@/components/ui/button"
import { SavedPlay } from "./types"

interface PlaybackControlsProps {
  play: SavedPlay
  isPlaying: boolean
  currentFrame: number
  playbackSpeed: number
  onClose: () => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onChangeSpeed: (speed: number) => void
}

export function PlaybackControls({
  play,
  isPlaying,
  currentFrame,
  playbackSpeed,
  onClose,
  onPlay,
  onPause,
  onStop,
  onChangeSpeed,
}: PlaybackControlsProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Playing: {play.name}</h3>
        <Button onClick={onClose} variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700" size="sm">
          Close
        </Button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        {!isPlaying ? (
          <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700 text-white">
            ▶ Play
          </Button>
        ) : (
          <Button onClick={onPause} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            ⏸ Pause
          </Button>
        )}

        <Button onClick={onStop} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          ⏹ Stop
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Speed:</span>
          <Button onClick={() => onChangeSpeed(0.5)} variant={playbackSpeed === 0.5 ? "default" : "outline"} size="sm">
            0.5x
          </Button>
          <Button onClick={() => onChangeSpeed(1)} variant={playbackSpeed === 1 ? "default" : "outline"} size="sm">
            1x
          </Button>
          <Button onClick={() => onChangeSpeed(2)} variant={playbackSpeed === 2 ? "default" : "outline"} size="sm">
            2x
          </Button>
        </div>

        <div className="ml-auto text-sm text-gray-400">
          Frame: {currentFrame + 1} / {play.frames.length}
        </div>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full transition-all" style={{ width: `${((currentFrame + 1) / play.frames.length) * 100}%` }} />
      </div>
    </div>
  )
}
