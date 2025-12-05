"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Player {
  id: string
  team: "team1" | "team2"
  x: number
  y: number
  number: number
}

interface Props {
  player: Player
  onMove: (id: string, x: number, y: number) => void
  boardRef: React.RefObject<HTMLDivElement>
}


export default function DraggablePlayer({ player, onMove, boardRef }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !boardRef.current) return

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!boardRef.current) return
        
        const boardRect = boardRef.current.getBoundingClientRect()
        const x = ((e.clientX - boardRect.left) / boardRect.width) * 100
        const y = ((e.clientY - boardRect.top) / boardRect.height) * 100

        onMove(player.id, x, y)
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }
  }, [isDragging, onMove, player.id, boardRef])

  const isTeam1 = player.team === "team1"

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer select-none"
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
      }}
    >
      {player.number}
    </div>
  )
}
