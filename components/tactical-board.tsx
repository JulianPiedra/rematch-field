"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import swal from "sweetalert"
import { ControlPanel } from "./control-panel"
import { DrawingControls } from "./drawing-controls"
import { InfoBar } from "./info-bar"
import { PlaybackControls } from "./playback-controls"
import { PlayerControls } from "./player-controls"
import { SavedPlays } from "./saved-plays"
import { TacticalField } from "./tactical-field"
import { StorageService } from "./storage"
import {
  Ball,
  DrawingLine,
  DrawingPoint,
  DrawingShapeType,
  PlayFrame,
  Player,
  SavedPlay,
  createInitialPlayers,
} from "./types"

function applyPlayerPreferences(players: Player[], preferences: ReturnType<typeof StorageService.loadPlayerPreferences>): Player[] {
  if (preferences.length === 0) {
    return players
  }

  const preferencesById = new Map(preferences.map((preference) => [preference.id, preference]))

  return players.map((player) => {
    const preference = preferencesById.get(player.id)
    if (!preference) {
      return player
    }

    return {
      ...player,
      name: preference.name,
      visible: preference.visible,
    }
  })
}

export default function TacticalBoard() {
  const [ball, setBall] = useState<Ball>({ x: 50, y: 50 })
  const [players, setPlayers] = useState<Player[]>(() => createInitialPlayers())
  const boardRef = useRef<HTMLDivElement>(null)

  const [drawMode, setDrawMode] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState<DrawingPoint[]>([])
  const [drawings, setDrawings] = useState<DrawingLine[]>([])
  const [drawingColor, setDrawingColor] = useState("#FFD700")
  const [drawingWidth, setDrawingWidth] = useState(3)
  const [isArrowMode, setIsArrowMode] = useState(true)
  const [drawingShape, setDrawingShape] = useState<DrawingShapeType>("freehand")
  const [playerControlsOpen, setPlayerControlsOpen] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [recordedFrames, setRecordedFrames] = useState<PlayFrame[]>([])
  const [savedPlays, setSavedPlays] = useState<SavedPlay[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedPlay, setSelectedPlay] = useState<SavedPlay | null>(null)

  useEffect(() => {
    const plays = StorageService.loadPlays()
    setSavedPlays(plays)

    const playerPreferences = StorageService.loadPlayerPreferences()
    setPlayers((currentPlayers) => applyPlayerPreferences(currentPlayers, playerPreferences))
  }, [])

  useEffect(() => {
    StorageService.savePlays(savedPlays)
  }, [savedPlays])

  useEffect(() => {
    const preferences = players.map((player) => ({
      id: player.id,
      name: player.name,
      visible: player.visible,
    }))

    StorageService.savePlayerPreferences(preferences)
  }, [players])

  const onDragAndDrop = (play: string | SavedPlay) => {
    try {
      const parsed = typeof play === "string" ? JSON.parse(play) : play
      if (!parsed || typeof parsed !== "object" || !("name" in parsed) || !("frames" in parsed)) {
        swal({ title: "Invalid play JSON", text: "Missing required fields.", icon: "error" })
        return
      }

      const playWithId: SavedPlay = {
        id: typeof parsed.id === "string" && parsed.id ? parsed.id : Date.now().toString(),
        name: typeof parsed.name === "string" ? parsed.name : "Untitled play",
        frames: Array.isArray(parsed.frames) ? parsed.frames : [],
      }

      if (playWithId.frames.length === 0) {
        swal({ title: "Invalid play JSON", text: "A saved play needs at least one snapshot.", icon: "error" })
        return
      }

      setSavedPlays((prev) => [...prev, playWithId])
      swal({ title: "Imported play", text: playWithId.name, icon: "success" })
    } catch (err) {
      console.error(err)
      swal({ title: "Failed to parse dropped play JSON.", icon: "error" })
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragOver(false)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault()
    setIsDragOver(false)

    // Prefer files if present
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      try {
        const text = await file.text()
        onDragAndDrop(text)
        return
      } catch (err) {
        console.error(err)
        swal({ title: "Unable to read dropped file.", icon: "error" })
        return
      }
    }

    // Fallback to dataTransfer payloads
    const jsonData = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain")
    if (jsonData) {
      onDragAndDrop(jsonData)
    }
  }

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

  const handlePlayerNameChange = (playerId: string, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, name } : p)))
  }

  const handlePlayerVisibilityChange = (playerId: string, visible: boolean) => {
    setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, visible } : p)))
  }

  const resetPositions = () => {
    const playerPreferences = StorageService.loadPlayerPreferences()
    setPlayers(applyPlayerPreferences(createInitialPlayers(), playerPreferences))
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

    setCurrentLine((prev) => {
      if (drawingShape === "freehand") {
        return [...prev, { x, y }]
      }

      const start = prev[0]
      return start ? [start, { x, y }] : [{ x, y }]
    })
  }

  const endDrawing = () => {
    if (!isDrawing || currentLine.length < 2) {
      setIsDrawing(false)
      setCurrentLine([])
      return
    }

    const newDrawing: DrawingLine = {
      id: Date.now().toString(),
      points: drawingShape === "freehand" ? currentLine : currentLine.slice(0, 2),
      color: drawingColor,
      width: drawingWidth,
      isArrow: drawingShape !== "circle" && isArrowMode,
      shape: drawingShape,
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

  const savePlay = async () => {
    if (recordedFrames.length < 2) {
      await swal({
        title: "Not enough snapshots",
        text: "You need at least 2 snapshots to save a play!",
        icon: "warning",
      })
      return
    }

    const playName = await swal({
      title: "Enter play name:",
      content: { element: "input", attributes: { placeholder: "Play name" } }
    } as any)
    if (!playName) return

    const newPlay: SavedPlay = {
      id: Date.now().toString(),
      name: playName,
      frames: recordedFrames,
    }

    setSavedPlays((prev) => [...prev, newPlay])
    setRecordedFrames([])
    setIsRecording(false)
    await swal({ title: "Play saved successfully!", icon: "success" })
  }

  const loadPlay = (play: SavedPlay) => {
    setSelectedPlay(play)
    setCurrentFrame(0)
    setIsPlaying(false)

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

  const deletePlay = async (playId: string) => {
    const willDelete = await swal({
      title: "Delete this play?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    })
    if (willDelete) {
      setSavedPlays((prev) => prev.filter((p) => p.id !== playId))
      if (selectedPlay?.id === playId) {
        setSelectedPlay(null)
      }
      await swal({ title: "Play deleted", icon: "success" })
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
    <div
      className="space-y-4 p-6 bg-gray-900 min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ControlPanel
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

      <div className="flex gap-3 flex-wrap items-center bg-gray-800 p-3 rounded-lg">
        <DrawingControls
          drawMode={drawMode}
          onToggleDrawMode={() => setDrawMode((prev) => !prev)}
          isArrowMode={isArrowMode}
          onToggleArrowMode={() => setIsArrowMode((prev) => !prev)}
          drawingShape={drawingShape}
          onChangeShape={setDrawingShape}
          drawingColor={drawingColor}
          onChangeColor={setDrawingColor}
          drawingWidth={drawingWidth}
          onChangeWidth={setDrawingWidth}
          onUndo={undoLastDrawing}
          onClear={clearDrawings}
        />

        <PlayerControls
          players={players}
          controlsOpen={playerControlsOpen}
          onToggleControls={() => setPlayerControlsOpen((prev) => !prev)}
          onPlayerNameChange={handlePlayerNameChange}
          onPlayerVisibilityChange={handlePlayerVisibilityChange}
        />
      </div>

      <TacticalField
        boardRef={boardRef}
        players={players}
        ball={ball}
        drawings={drawings}
        currentLine={currentLine}
        drawingColor={drawingColor}
        drawingWidth={drawingWidth}
        isArrowMode={isArrowMode}
        drawingShape={drawingShape}
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

      {/* Drag-and-drop import overlay */}
      {isDragOver && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border-2 border-blue-400 bg-blue-950/40 px-6 py-4 text-center text-blue-200 shadow-lg">
              <p className="font-semibold">Drop a saved play JSON to import</p>
              <p className="text-xs opacity-80">File or text containing a SavedPlay</p>
            </div>
          </div>
        </div>
      )}

      <SavedPlays savedPlays={savedPlays} onLoad={loadPlay} onDelete={deletePlay} />
    </div>
  )
}