"use client"
import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import ReactPlayer from "react-player"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
    videoUrl: string
    onError: (err: Error) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onError }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [isMuted, setIsMuted] = useState(false)
    const [played, setPlayed] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const playerRef = useRef<ReactPlayer>(null)
    const playerContainerRef = useRef<HTMLDivElement>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handlePlayPause = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsPlaying((prev) => !prev)
        showControlsTemporarily()
    }, [])

    const handleVolumeChange = useCallback((newVolume: number[]) => {
        setVolume(newVolume[0])
        setIsMuted(newVolume[0] === 0)
        showControlsTemporarily()
    }, [])

    const handleToggleMute = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMuted((prev) => !prev)
        showControlsTemporarily()
    }, [])

    const handleProgress = useCallback((state: { played: number }) => {
        setPlayed(state.played)
    }, [])

    const handleDuration = useCallback((duration: number) => {
        setDuration(duration)
    }, [])

    const handleSeek = useCallback((time: number[]) => {
        playerRef.current?.seekTo(time[0])
        showControlsTemporarily()
    }, [])

    const handleRewind = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        const currentTime = playerRef.current?.getCurrentTime() || 0
        playerRef.current?.seekTo(Math.max(currentTime - 10, 0))
        showControlsTemporarily()
    }, [])

    const handleFastForward = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation()
            const currentTime = playerRef.current?.getCurrentTime() || 0
            playerRef.current?.seekTo(Math.min(currentTime + 10, duration))
            showControlsTemporarily()
        },
        [duration],
    )

    const toggleFullscreen = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
        showControlsTemporarily()
    }, [])

    const adjustVolume = useCallback((direction: "up" | "down") => {
        setVolume((prevVolume) => {
            const newVolume = direction === "up" ? prevVolume + 0.1 : prevVolume - 0.1
            return Math.max(0, Math.min(1, newVolume))
        })
        setIsMuted(false)
        showControlsTemporarily()
    }, [])

    const showControlsTemporarily = useCallback(() => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
        }, 1500)
    }, [])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) {
                return // Don't handle key events when focus is on textarea or input
            }
            switch (event.code) {
                case "Space":
                    event.preventDefault()
                    handlePlayPause(event as unknown as React.MouseEvent)
                    break
                case "ArrowLeft":
                    handleRewind(event as unknown as React.MouseEvent)
                    break
                case "ArrowRight":
                    handleFastForward(event as unknown as React.MouseEvent)
                    break
                case "ArrowUp":
                    event.preventDefault()
                    adjustVolume("up")
                    break
                case "ArrowDown":
                    event.preventDefault()
                    adjustVolume("down")
                    break
                case "KeyF":
                    toggleFullscreen(event as unknown as React.MouseEvent)
                    break
                default:
                    break
            }
        }
        document.addEventListener("keydown", handleKeyPress)
        return () => {
            document.removeEventListener("keydown", handleKeyPress)
        }
    }, [handlePlayPause, handleRewind, handleFastForward, adjustVolume, toggleFullscreen])

    useEffect(() => {
        showControlsTemporarily()
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [showControlsTemporarily]) // Added showControlsTemporarily to dependencies

    const formatTime = (seconds: number) => {
        const date = new Date(seconds * 1000)
        const mm = date.getUTCMinutes().toString().padStart(2, "0")
        const ss = date.getUTCSeconds().toString().padStart(2, "0")
        return `${mm}:${ss}`
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        showControlsTemporarily()
    }

    return (
        <div
            ref={playerContainerRef}
            className={`relative overflow-hidden ${
                isFullscreen ? "fixed inset-0 z-50 bg-black" : "max-w-4xl w-full mx-auto rounded-lg shadow-lg"
            }`}
            onMouseMove={showControlsTemporarily}
            onMouseDown={handleMouseDown}
        >
            <div className={`${isFullscreen ? "h-screen" : "aspect-video"}`}>
                <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={volume}
                    muted={isMuted}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onError={(e) => onError(new Error(`Video playback error: ${e}`))}
                />
            </div>
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 space-y-4 transition-opacity duration-300 ${
                    showControls ? "opacity-100" : "opacity-0"
                }`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">{formatTime(played * duration)}</span>
                    <Slider
                        value={[played]}
                        max={1}
                        step={0.001}
                        onValueChange={(value) => handleSeek([value[0] * duration])}
                        className="flex-grow"
                    />
                    <span className="text-white text-sm font-medium">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button onClick={handlePlayPause}>{isPlaying ? <Pause /> : <Play />}</Button>
                        <Button onClick={handleRewind}>
                            <SkipBack />
                        </Button>
                        <Button onClick={handleFastForward}>
                            <SkipForward />
                        </Button>
                        <Button onClick={handleToggleMute}>{isMuted ? <VolumeX /> : <Volume2 />}</Button>
                        <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.01}
                            onValueChange={handleVolumeChange}
                            className="w-24"
                        />
                    </div>
                    <Button onClick={toggleFullscreen}>{isFullscreen ? <Minimize /> : <Maximize />}</Button>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer

