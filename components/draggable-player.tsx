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
  const displayLabel = player.name?.trim() || player.number.toString()

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className="absolute h-12 w-12 select-none"
      title={displayLabel}
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: disabled ? "not-allowed" : "pointer",
        pointerEvents: "auto",
      }}
    >
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded bg-gray-950/85 px-2 py-1 text-center text-xs font-semibold leading-none text-white shadow-md">
        <span className="block text-ellipsis whitespace-nowrap">{displayLabel}</span>
      </div>

      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: isTeam1 ? "#0026ff" : "#000",
          color: isTeam1 ? "#000" : "#fff",
          border: isDragging ? "3px solid #fbbf24" : "",
          boxShadow: isDragging ? "0 0 20px rgba(251, 191, 36, 0.6)" : "none",
          transition: isDragging ? "none" : "all 0.2s",
          scale: isDragging ? "1.1" : "1",
        }}
      />
    </div>
  )
}
