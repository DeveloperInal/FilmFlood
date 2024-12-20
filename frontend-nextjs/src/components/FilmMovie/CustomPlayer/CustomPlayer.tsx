'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Subtitles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
    videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const controlsRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.addEventListener('timeupdate', handleTimeUpdate)
            video.addEventListener('loadedmetadata', handleLoadedMetadata)
            document.addEventListener('fullscreenchange', handleFullscreenChange)

            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate)
                video.removeEventListener('loadedmetadata', handleLoadedMetadata)
                document.removeEventListener('fullscreenchange', handleFullscreenChange)
            }
        }
    }, [])

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }, [isPlaying])

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }, [])

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }, [])

    const handleSeek = useCallback((value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0]
            setCurrentTime(value[0])
        }
    }, [])

    const handleVolumeChange = useCallback((value: number[]) => {
        if (videoRef.current) {
            const newVolume = value[0]
            videoRef.current.volume = newVolume
            setVolume(newVolume)
            setIsMuted(newVolume === 0)
        }
    }, [])

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }, [isMuted])

    const handleRewind = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 10
            setCurrentTime(videoRef.current.currentTime)
        }
    }, [])

    const handleFastForward = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime += 10
            setCurrentTime(videoRef.current.currentTime)
        }
    }, [])

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            videoRef.current?.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }, [])

    const handleFullscreenChange = useCallback(() => {
        setIsFullscreen(!!document.fullscreenElement)
    }, [])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleMouseMove = useCallback(() => {
        setShowControls(true)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            if (isFullscreen) {
                setShowControls(false)
            }
        }, 3000)
    }, [isFullscreen])

    const handleMouseLeave = useCallback(() => {
        if (isFullscreen) {
            setShowControls(false)
        }
    }, [isFullscreen])

    return (
        <div
            className={`mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-4xl'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                <video
                    ref={videoRef}
                    className="w-full h-full"
                    src={videoUrl}
                    onClick={togglePlay}
                    controls={false}
                />
                <div
                    ref={controlsRef}
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-white text-sm">{formatTime(currentTime)}</span>
                        <Slider
                            value={[currentTime]}
                            max={duration}
                            step={1}
                            onValueChange={(value) => setCurrentTime(value[0])}
                            onValueCommit={handleSeek}
                            className="flex-grow [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                        <span className="text-white text-sm">{formatTime(duration)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglePlay}
                                className="text-white hover:bg-white/20 transition-colors w-12 h-12"
                            >
                                {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRewind}
                                className="text-white hover:bg-white/20 transition-colors w-12 h-12"
                            >
                                <SkipBack className="h-8 w-8"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleFastForward}
                                className="text-white hover:bg-white/20 transition-colors w-12 h-12"
                            >
                                <SkipForward className="h-8 w-8"/>
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleMute}
                                    className="text-white hover:bg-white/20 transition-colors"
                                >
                                    {isMuted ? <VolumeX className="h-6 w-6"/> : <Volume2 className="h-6 w-6"/>}
                                </Button>
                                <Slider
                                    value={[volume]}
                                    max={1}
                                    step={0.01}
                                    onValueChange={handleVolumeChange}
                                    className="w-24"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 transition-colors"
                            >
                                <Subtitles className="h-6 w-6"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullscreen}
                                className="text-white hover:bg-white/20 transition-colors"
                            >
                                {isFullscreen ? <Minimize className="h-6 w-6"/> : <Maximize className="h-6 w-6"/>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer

