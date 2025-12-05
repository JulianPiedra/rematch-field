"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Ball {
  x: number
  y: number
}

interface Props {
  ball: Ball
  onMove: (x: number, y: number) => void
  boardRef: React.RefObject<HTMLDivElement>
}

export default function DraggableBall({ ball, onMove, boardRef }: Props) {
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

        onMove(x, y)
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
  }, [isDragging, onMove, boardRef])

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className="absolute w-8 h-8 rounded-full cursor-pointer select-none"
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
      }}
    />
  )
}
