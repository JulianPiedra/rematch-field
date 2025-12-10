"use client"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from "react"
import { Ball } from "./types"

interface DraggableBallProps {
  ball: Ball
  onMove: (x: number, y: number) => void
  boardRef: RefObject<HTMLDivElement>
  disabled?: boolean
}

export function DraggableBall({ ball, onMove, boardRef, disabled }: DraggableBallProps) {
  const [isDragging, setIsDragging] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !boardRef.current || disabled) return

      const boardRect = boardRef.current.getBoundingClientRect()
      const x = ((e.clientX - boardRect.left) / boardRect.width) * 100
      const y = ((e.clientY - boardRect.top) / boardRect.height) * 100
      onMove(x, y)
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, onMove, boardRef, disabled])

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className="absolute w-8 h-8 rounded-full select-none"
      style={{
        left: `${ball.x}%`,
        top: `${ball.y}%`,
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        border: isDragging ? "3px solid #ff6b6b" : "2px solid rgba(255,255,255,0.8)",
        boxShadow: isDragging
          ? "0 0 25px rgba(255, 107, 107, 0.8), inset 0 0 5px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.3), inset 0 0 5px rgba(255,255,255,0.5)",
        transition: isDragging ? "none" : "all 0.2s",
        scale: isDragging ? "1.25" : "1",
        cursor: disabled ? "not-allowed" : "pointer",
        pointerEvents: "auto",
      }}
    />
  )
}
