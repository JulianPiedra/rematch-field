import { Button } from "@/components/ui/button"

interface DrawingControlsProps {
  drawMode: boolean
  onToggleDrawMode: () => void
  isArrowMode: boolean
  onToggleArrowMode: () => void
  drawingColor: string
  onChangeColor: (color: string) => void
  drawingWidth: number
  onChangeWidth: (width: number) => void
  onUndo: () => void
  onClear: () => void
}

const colors = ["#FFD700", "#FF0000", "#00FF00", "#0080FF", "#FFFFFF"]

export function DrawingControls({
  drawMode,
  onToggleDrawMode,
  isArrowMode,
  onToggleArrowMode,
  drawingColor,
  onChangeColor,
  drawingWidth,
  onChangeWidth,
  onUndo,
  onClear,
}: DrawingControlsProps) {
  return (
    <div className="flex gap-3 flex-wrap items-center bg-gray-800 p-3 rounded-lg">
      <Button
        onClick={onToggleDrawMode}
        className={drawMode ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 hover:bg-gray-600"}
      >
        {drawMode ? "✏️ Drawing ON" : "✏️ Drawing OFF"}
      </Button>

      {drawMode && (
        <>
          <Button onClick={onToggleArrowMode} variant={isArrowMode ? "default" : "outline"} className="border-gray-600">
            {isArrowMode ? "➡️ Arrow" : "~ Line"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Color:</span>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onChangeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${drawingColor === color ? "border-white" : "border-gray-600"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Width:</span>
            <Button onClick={() => onChangeWidth(2)} variant={drawingWidth === 2 ? "default" : "outline"} size="sm">
              Thin
            </Button>
            <Button onClick={() => onChangeWidth(3)} variant={drawingWidth === 3 ? "default" : "outline"} size="sm">
              Medium
            </Button>
            <Button onClick={() => onChangeWidth(5)} variant={drawingWidth === 5 ? "default" : "outline"} size="sm">
              Thick
            </Button>
          </div>

          <Button onClick={onUndo} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-900/20">
            ↶ Undo
          </Button>

          <Button onClick={onClear} variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
            🗑️ Clear All
          </Button>
        </>
      )}
    </div>
  )
}
