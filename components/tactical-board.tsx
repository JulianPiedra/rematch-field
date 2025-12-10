"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ControlPanel } from "./control-panel"
import { DrawingControls } from "./drawing-controls"
import { InfoBar } from "./info-bar"
import { PlaybackControls } from "./playback-controls"
import { SavedPlays } from "./saved-plays"
import { TacticalField } from "./tactical-field"
import { StorageService } from "./storage"
import {
  Ball,
  DrawingLine,
  DrawingPoint,
  GameMode,
  PlayFrame,
  Player,
  SavedPlay,
  initialPositions,
  initialTeam1,
  initialTeam2,
} from "./types"

export default function TacticalBoard() {
  const [gameMode, setGameMode] = useState<GameMode>("5v5")
  const [ball, setBall] = useState<Ball>({ x: 50, y: 50 })
  const [players, setPlayers] = useState<Player[]>([...initialTeam1, ...initialTeam2])
  const boardRef = useRef<HTMLDivElement>(null)

  const [drawMode, setDrawMode] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState<DrawingPoint[]>([])
  const [drawings, setDrawings] = useState<DrawingLine[]>([])
  const [drawingColor, setDrawingColor] = useState("#FFD700")
  const [drawingWidth, setDrawingWidth] = useState(3)
  const [isArrowMode, setIsArrowMode] = useState(true)

  const [isRecording, setIsRecording] = useState(false)
  const [recordedFrames, setRecordedFrames] = useState<PlayFrame[]>([])
  const [savedPlays, setSavedPlays] = useState<SavedPlay[]>([])

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedPlay, setSelectedPlay] = useState<SavedPlay | null>(null)

  useEffect(() => {
    const plays = StorageService.loadPlays()
    setSavedPlays(plays)
  }, [])

  useEffect(() => {
    StorageService.savePlays(savedPlays)
  }, [savedPlays])

  useEffect(() => {
    const current = initialPositions[gameMode]
    const newPlayers = [
      ...current.team1.map((p) => ({ ...p, team: "team1" as const })),
      ...current.team2.map((p) => ({ ...p, team: "team2" as const })),
    ]
    setPlayers(newPlayers)
    setBall({ x: 50, y: 50 })
  }, [gameMode])

  const handlePlayerMove = (playerId: string, x: number, y: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : p,
      ),
    )
  }

  const handleBallMove = (x: number, y: number) => {
    setBall({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const resetPositions = () => {
    const current = initialPositions[gameMode]
    const newPlayers = [
      ...current.team1.map((p) => ({ ...p, team: "team1" as const })),
      ...current.team2.map((p) => ({ ...p, team: "team2" as const })),
    ]
    setPlayers(newPlayers)
    setBall({ x: 50, y: 50 })
    setDrawings([])
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setIsDrawing(true)
    setCurrentLine([{ x, y }])
  }

  const continueDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawMode || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setCurrentLine((prev) => [...prev, { x, y }])
  }

  const endDrawing = () => {
    if (!isDrawing || currentLine.length < 2) {
      setIsDrawing(false)
      setCurrentLine([])
      return
    }

    const newDrawing: DrawingLine = {
      id: Date.now().toString(),
      points: currentLine,
      color: drawingColor,
      width: drawingWidth,
      isArrow: isArrowMode,
    }

    setDrawings((prev) => [...prev, newDrawing])
    setIsDrawing(false)
    setCurrentLine([])
  }

  const clearDrawings = () => setDrawings([])

  const undoLastDrawing = () => setDrawings((prev) => prev.slice(0, -1))

  const captureSnapshot = () => {
    const frame: PlayFrame = {
      players: JSON.parse(JSON.stringify(players)),
      ball: { ...ball },
      timestamp: Date.now(),
      drawings: JSON.parse(JSON.stringify(drawings)),
    }
    setRecordedFrames((prev) => [...prev, frame])
  }

  const startRecording = () => {
    setRecordedFrames([])
    setIsRecording(true)
    const frame: PlayFrame = {
      players: JSON.parse(JSON.stringify(players)),
      ball: { ...ball },
      timestamp: Date.now(),
      drawings: JSON.parse(JSON.stringify(drawings)),
    }
    setRecordedFrames([frame])
  }
  const stopRecording = () => {
    setIsRecording(false)
  }

  const deleteLastSnapshot = () => {
    if (recordedFrames.length > 1) {
      setRecordedFrames((prev) => prev.slice(0, -1))
    }
  }

  const savePlay = () => {
    if (recordedFrames.length < 2) {
      alert("You need at least 2 snapshots to save a play!")
      return
    }

    const playName = prompt("Enter play name:")
    if (!playName) return

    const newPlay: SavedPlay = {
      id: Date.now().toString(),
      name: playName,
      frames: recordedFrames,
      gameMode,
    }

    setSavedPlays((prev) => [...prev, newPlay])
    setRecordedFrames([])
    setIsRecording(false)
    alert("Play saved successfully!")
  }

  const loadPlay = (play: SavedPlay) => {
    setSelectedPlay(play)
    setCurrentFrame(0)
    setIsPlaying(false)
    setGameMode(play.gameMode)

    if (play.frames.length > 0) {
      setPlayers(play.frames[0].players)
      setBall(play.frames[0].ball)
      setDrawings(play.frames[0].drawings)
    }
  }

  const playRecording = () => {
    if (!selectedPlay || selectedPlay.frames.length === 0) return
    setIsPlaying(true)
    setCurrentFrame(0)
  }

  const pausePlayback = () => setIsPlaying(false)

  const stopPlayback = () => {
    setIsPlaying(false)
    setCurrentFrame(0)
    if (selectedPlay && selectedPlay.frames.length > 0) {
      setPlayers(selectedPlay.frames[0].players)
      setBall(selectedPlay.frames[0].ball)
      setDrawings(selectedPlay.frames[0].drawings)
    }
  }

  const deletePlay = (playId: string) => {
    if (confirm("Are you sure you want to delete this play?")) {
      setSavedPlays((prev) => prev.filter((p) => p.id !== playId))
      if (selectedPlay?.id === playId) {
        setSelectedPlay(null)
      }
    }
  }

  useEffect(() => {
    if (isPlaying && selectedPlay && selectedPlay.frames.length > 0) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => {
          const next = prev + 1

          if (next >= selectedPlay.frames.length) {
            setIsPlaying(false)
            return prev
          }

          const frame = selectedPlay.frames[next]
          setPlayers(frame.players)
          setBall(frame.ball)
          setDrawings(frame.drawings)

          return next
        })
      }, 1000 / playbackSpeed)

      return () => clearInterval(interval)
    }
  }, [isPlaying, selectedPlay, playbackSpeed])

  return (
    <div className="space-y-4 p-6 bg-gray-900 min-h-screen">
      <ControlPanel
        gameMode=        {gameMode}
        onChangeGameMode={setGameMode}
        onReset={resetPositions}
        isRecording={isRecording}
        isPlaying={isPlaying}
        onStartRecording={startRecording}
        onCapture={captureSnapshot}
        onDeleteLast={deleteLastSnapshot}
        onStopRecording={stopRecording}
        canDeleteLast={recordedFrames.length > 1}
        onSave={savePlay}
        canSave={recordedFrames.length >= 2}
        snapshotsCount={recordedFrames.length}
      />

      <DrawingControls
        drawMode={drawMode}
        onToggleDrawMode={() => setDrawMode((prev) => !prev)}
        isArrowMode={isArrowMode}
        onToggleArrowMode={() => setIsArrowMode((prev) => !prev)}
        drawingColor={drawingColor}
        onChangeColor={setDrawingColor}
        drawingWidth={drawingWidth}
        onChangeWidth={setDrawingWidth}
        onUndo={undoLastDrawing}
        onClear={clearDrawings}
      />

      <TacticalField
        boardRef={boardRef}
        players={players}
        ball={ball}
        drawings={drawings}
        currentLine={currentLine}
        drawingColor={drawingColor}
        drawingWidth={drawingWidth}
        isArrowMode={isArrowMode}
        drawMode={drawMode}
        onPlayerMove={handlePlayerMove}
        onBallMove={handleBallMove}
        onStartDrawing={startDrawing}
        onContinueDrawing={continueDrawing}
        onEndDrawing={endDrawing}
      />

      <InfoBar players={players} ball={ball} />

      {selectedPlay && (
        <PlaybackControls
          play={selectedPlay}
          isPlaying={isPlaying}
          currentFrame={currentFrame}
          playbackSpeed={playbackSpeed}
          onClose={() => setSelectedPlay(null)}
          onPlay={playRecording}
          onPause={pausePlayback}
          onStop={stopPlayback}
          onChangeSpeed={setPlaybackSpeed}
        />
      )}

      <SavedPlays savedPlays={savedPlays} onLoad={loadPlay} onDelete={deletePlay} />
    </div>
  )
}