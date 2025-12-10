import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react"
import { DrawingLine, DrawingPoint } from "./types"

interface DrawingCanvasProps {
  drawings: DrawingLine[]
  currentLine: DrawingPoint[]
  drawingColor: string
  drawingWidth: number
  isArrowMode: boolean
  onMouseDown: (e: ReactMouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: ReactMouseEvent<HTMLCanvasElement>) => void
  onMouseUp: () => void
  drawMode: boolean
}

export function DrawingCanvas({
  drawings,
  currentLine,
  drawingColor,
  drawingWidth,
  isArrowMode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  drawMode,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawings.forEach((line) => {
      drawLine(ctx, line.points, line.color, line.width, line.isArrow, canvas.width, canvas.height)
    })

    if (currentLine.length > 0) {
      drawLine(ctx, currentLine, drawingColor, drawingWidth, isArrowMode, canvas.width, canvas.height)
    }
  }, [drawings, currentLine, drawingColor, drawingWidth, isArrowMode])

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    points: DrawingPoint[],
    color: string,
    width: number,
    isArrow: boolean,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    if (points.length < 2) return

    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    ctx.moveTo((points[0].x / 100) * canvasWidth, (points[0].y / 100) * canvasHeight)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo((points[i].x / 100) * canvasWidth, (points[i].y / 100) * canvasHeight)
    }

    ctx.stroke()

    if (isArrow && points.length >= 2) {
      const lastPoint = points[points.length - 1]
      const secondLastPoint = points[points.length - 2]

      const x1 = (secondLastPoint.x / 100) * canvasWidth
      const y1 = (secondLastPoint.y / 100) * canvasHeight
      const x2 = (lastPoint.x / 100) * canvasWidth
      const y2 = (lastPoint.y / 100) * canvasHeight

      const angle = Math.atan2(y2 - y1, x2 - x1)
      const arrowLength = 15
      const arrowAngle = Math.PI / 6

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x2, y2)
      ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle), y2 - arrowLength * Math.sin(angle - arrowAngle))
      ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle), y2 - arrowLength * Math.sin(angle + arrowAngle))
      ctx.closePath()
      ctx.fill()
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={600}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: drawMode ? "auto" : "none", cursor: drawMode ? "crosshair" : "default", zIndex: drawMode ? 20 : 10 }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  )
}
