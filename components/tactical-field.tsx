import type React from "react"
import { DraggableBall } from "./draggable-ball"
import { DraggablePlayer } from "./draggable-player"
import { DrawingCanvas } from "./drawing-canvas"
import { FieldSVG } from "./field-svg"
import { Ball, DrawingLine, DrawingPoint, DrawingShapeType, Player } from "./types"

interface TacticalFieldProps {
  boardRef: any
  players: Player[]
  ball: Ball
  drawings: DrawingLine[]
  currentLine: DrawingPoint[]
  drawingColor: string
  drawingWidth: number
  isArrowMode: boolean
  drawingShape: DrawingShapeType
  drawMode: boolean
  onPlayerMove: (id: string, x: number, y: number) => void
  onBallMove: (x: number, y: number) => void
  onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onContinueDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onEndDrawing: () => void
}

export function TacticalField({
  boardRef,
  players,
  ball,
  drawings,
  currentLine,
  drawingColor,
  drawingWidth,
  isArrowMode,
  drawingShape,
  drawMode,
  onPlayerMove,
  onBallMove,
  onStartDrawing,
  onContinueDrawing,
  onEndDrawing,
}: TacticalFieldProps) {
  return (
    <div
      ref={boardRef}
      className="relative w-full bg-gradient-to-b from-green-600 to-green-700 rounded-lg overflow-hidden shadow-2xl"
      style={{ aspectRatio: "2 / 1" }}
    >
      <FieldSVG />

      {players.filter((player) => player.visible !== false).map((player) => (
        <DraggablePlayer key={player.id} player={player} onMove={onPlayerMove} boardRef={boardRef} disabled={drawMode} />
      ))}

      <DraggableBall ball={ball} onMove={onBallMove} boardRef={boardRef} disabled={drawMode} />

      <DrawingCanvas
        drawings={drawings}
        currentLine={currentLine}
        drawingColor={drawingColor}
        drawingWidth={drawingWidth}
        isArrowMode={isArrowMode}
        drawingShape={drawingShape}
        onMouseDown={onStartDrawing}
        onMouseMove={onContinueDrawing}
        onMouseUp={onEndDrawing}
        drawMode={drawMode}
      />
    </div>
  )
}
