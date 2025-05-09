import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore.js";
import { Slider } from "../components/Slider.js";
import { VolumeFull, VolumeSilenced } from "../icons/VolumeIcons.js";

export const Pause = () => {
    return (
        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
        ><path
            d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"
        ></path></svg>
)}

export const Play = () => {
    return (
        <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"></path></svg>
)}

const CurrentSong = ({ image, title, artists }) => {
    return(
        <div className="flex items-center gap-5 relative overflow-hidden">
            <picture className="size-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden">
                <img src={image} alt={title} />
            </picture>

            <div className="flex flex-col">
                <h3 className="font-semibold text-sm block">
                    {title}
                </h3>

                <span className="text-xs opacity-80">
                    {artists?.join(', ')}
                </span>
            </div>

        </div>
    )
}

const SongControl = ({ audio }) => {
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        audio.current.addEventListener('timeupdate', handleTimeUpdate)
        return () => (
            audio.current.removeEventListener('timeupdate', handleTimeUpdate)
        )
    }, [])

    const handleTimeUpdate = () => {
        setCurrentTime(audio.current.currentTime)
    }

    const formatTime = time => {
        if(time == null){
            return '0:00'
        }
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60)

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const duration = audio?.current?.duration ?? 0

    return (
        <div className="flex gap-x-3 text-xs pt-2">
            <span className="opacity-50 w-12 text-right">{formatTime(currentTime)}</span>
            <Slider max={audio?.current?.duration ?? 0} min={0} value={[currentTime]} className="w-[400px]" 
                    onValueChange={(value) => {
                        audio.current.currentTime = value
                    }}/>
            <span className="opacity-50 w-12">
                {duration ? formatTime(duration) : '0:00'}
            </span>
        </div>
    )
}

const VolumeControl = () => {
    const volume = usePlayerStore(state => state.volume)
    const setVolume = usePlayerStore(state => state.setVolume)
    const previewVolumeRef = useRef(volume)

    const isVolumeSilence = volume < 0.01

    const handleClickVolume = () => {
        if(isVolumeSilence){
            setVolume(previewVolumeRef.current)
        }else {
            previewVolumeRef.current = volume
            setVolume(0)
        }
    }

    return(
        <div className="flex justify-center gap-2">
            <button className="opacity-70 hover:opacity-100 transition" onClick={handleClickVolume}>
                {isVolumeSilence ? <VolumeSilenced /> : <VolumeFull />}
            </button>

            <Slider defaultValue={[100]} max={100} min={0} value={[volume * 100]} className="w-[95px]" 
                    onValueChange={(value) => {
                        const [newVolume] = value
                        const volumeValue = newVolume / 100
                        setVolume(volumeValue)
                    }}/>
        </div>
    )
}

export function Player () {
    const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore(state => state)
    const audioRef = useRef()
    const volumeRef = useRef(1)

    useEffect(() => {
        isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }, [isPlaying])

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        const { song, songs, playlist } = currentMusic
        if (song) {
            const src = `/music/${playlist?.id}/0${song?.id}.mp3`
            audioRef.current.src = src
            audioRef.current.volume = volume
            audioRef.current.play()
        }
    }, [currentMusic])

    const handleClick = () => {
        setIsPlaying(!isPlaying)
    }

    return(
        <div className="flex flex-row justify-between w-full px-1 z-50">
            <div className="w-[180px]">
                <CurrentSong {...currentMusic.song}/>
            </div>

            <div className="grid place-content-center gap-4 flex-1">
                <div className="flex justify-center flex-col items-center">
                    <button className="bg-white rounded-full p-2" onClick={handleClick}>
                        {isPlaying ? <Pause/> : <Play/>}
                    </button>
                    <SongControl audio={audioRef}/>
                    <audio ref={audioRef}/>
                </div>
            </div>

            <div className="grid place-content-center">
                <VolumeControl />
            </div>
        </div>
    )
}