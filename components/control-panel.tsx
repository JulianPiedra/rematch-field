import { Button } from "@/components/ui/button"

interface ControlPanelProps {
  onReset: () => void
  isRecording: boolean
  isPlaying: boolean
  onStartRecording: () => void
  onCapture: () => void
  onStopRecording: () => void
  onDeleteLast: () => void
  canDeleteLast: boolean
  onSave: () => void
  canSave: boolean
  snapshotsCount: number
}

export function ControlPanel({
  onReset,
  isRecording,
  isPlaying,
  onStartRecording,
  onStopRecording,
  onCapture,
  onDeleteLast,
  canDeleteLast,
  onSave,
  canSave,
  snapshotsCount,
}: ControlPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        
        
        <Button onClick={onReset} variant="outline" className="border-gray-600 text-black-500 hover:bg-gray-700">
          Reset
        </Button>

        <div className="border-l border-gray-600 h-8 mx-2" />

        {!isRecording ? (
          <Button onClick={onStartRecording} className="bg-green-600 hover:bg-green-700 text-white" disabled={isPlaying}>
            ● Start Recording
          </Button>
        ) : (
          <>
          <Button onClick={onStopRecording} className="bg-red-600 hover:bg-red-700 text-white">
              ■ Stop and Delete Recording
            </Button>

            <Button onClick={onCapture} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              📸 Capture Position
            </Button>
            <Button
              onClick={onDeleteLast}
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-900/20"
              disabled={!canDeleteLast}
            >
              ← Delete Last
            </Button>

            <Button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!canSave}
            >
              💾 Save Play
            </Button>
            <span className="text-sm text-blue-400 font-semibold">Recording: {snapshotsCount} snapshots</span>
          </>
        )}
      </div>
    </div>
  )
}
