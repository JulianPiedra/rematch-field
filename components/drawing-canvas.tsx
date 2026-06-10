import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react"
import { DrawingLine, DrawingPoint, DrawingShapeType } from "./types"

interface DrawingCanvasProps {
  drawings: DrawingLine[]
  currentLine: DrawingPoint[]
  drawingColor: string
  drawingWidth: number
  isArrowMode: boolean
  drawingShape: DrawingShapeType
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
  drawingShape,
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
      renderShape(ctx, line, canvas.width, canvas.height)
    })

    if (currentLine.length > 0) {
      const preview: DrawingLine = {
        id: "preview",
        points: currentLine,
        color: drawingColor,
        width: drawingWidth,
        isArrow: drawingShape !== "circle" && isArrowMode,
        shape: drawingShape,
      }
      renderShape(ctx, preview, canvas.width, canvas.height)
    }
  }, [drawings, currentLine, drawingColor, drawingWidth, isArrowMode, drawingShape])

  const renderShape = (
    ctx: CanvasRenderingContext2D,
    line: DrawingLine,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    const shape: DrawingShapeType = line.shape ?? "freehand"
    const color = line.color
    const width = line.width

    if (shape === "circle") {
      drawCircle(ctx, line.points, color, width, canvasWidth, canvasHeight)
      return
    }

    if (shape === "straight") {
      drawStraight(ctx, line.points, color, width, line.isArrow, canvasWidth, canvasHeight)
      return
    }

    drawFreehand(ctx, line.points, color, width, line.isArrow, canvasWidth, canvasHeight)
  }

  const drawFreehand = (
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
      drawArrowHead(ctx, points[points.length - 2], points[points.length - 1], color, canvasWidth, canvasHeight)
    }
  }

  const drawStraight = (
    ctx: CanvasRenderingContext2D,
    points: DrawingPoint[],
    color: string,
    width: number,
    isArrow: boolean,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    if (points.length < 2) return

    const start = points[0]
    const end = points[points.length - 1]

    const x1 = (start.x / 100) * canvasWidth
    const y1 = (start.y / 100) * canvasHeight
    const x2 = (end.x / 100) * canvasWidth
    const y2 = (end.y / 100) * canvasHeight

    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    if (isArrow) {
      drawArrowHead(ctx, start, end, color, canvasWidth, canvasHeight)
    }
  }

  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    points: DrawingPoint[],
    color: string,
    width: number,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    if (points.length < 2) return

    const center = points[0]
    const edge = points[points.length - 1]

    const cx = (center.x / 100) * canvasWidth
    const cy = (center.y / 100) * canvasHeight
    const ex = (edge.x / 100) * canvasWidth
    const ey = (edge.y / 100) * canvasHeight
    const radius = Math.sqrt((ex - cx) ** 2 + (ey - cy) ** 2)

    ctx.strokeStyle = color
    ctx.lineWidth = width

    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    from: DrawingPoint,
    to: DrawingPoint,
    color: string,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    const x1 = (from.x / 100) * canvasWidth
    const y1 = (from.y / 100) * canvasHeight
    const x2 = (to.x / 100) * canvasWidth
    const y2 = (to.y / 100) * canvasHeight

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
