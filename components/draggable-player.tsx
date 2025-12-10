"use client"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from "react"
import { Player } from "./types"

interface DraggablePlayerProps {
  player: Player
  onMove: (id: string, x: number, y: number) => void
  boardRef: RefObject<HTMLDivElement>
  disabled?: boolean
}

export function DraggablePlayer({ player, onMove, boardRef, disabled }: DraggablePlayerProps) {
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
      onMove(player.id, x, y)
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
  }, [isDragging, onMove, player.id, boardRef, disabled])

  const isTeam1 = player.team === "team1"

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm select-none"
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: "translate(-50%, -50%)",
        backgroundColor: isTeam1 ? "#fff" : "#000",
        color: isTeam1 ? "#000" : "#fff",
        border: isDragging ? "3px solid #fbbf24" : "2px solid rgba(255,255,255,0.5)",
        boxShadow: isDragging ? "0 0 20px rgba(251, 191, 36, 0.6)" : "none",
        transition: isDragging ? "none" : "all 0.2s",
        scale: isDragging ? "1.1" : "1",
        cursor: disabled ? "not-allowed" : "pointer",
        pointerEvents: "auto",
      }}
    >
      {player.number}
    </div>
  )
}
