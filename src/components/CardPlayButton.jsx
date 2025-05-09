import { Pause, Play } from "./Player.jsx";
import { usePlayerStore } from "../store/playerStore.js";

export function CardPlayButton ({id, size = 'small'}) {
    const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } = usePlayerStore(state => state)
    const isPlayingPlayList = isPlaying && currentMusic?.playlist.id === id

    const handleClick = () => {
        if(isPlayingPlayList){
            setIsPlaying(false)
            return
        }

        fetch(`/api/get-info-playlist.json?id=${id}`)
            .then(res => res.json())
            .then(data => {
                const { songs, playlist } = data
                setIsPlaying(true)
                setCurrentMusic({songs, playlist, song: songs[0]})
        })
    }


    
    return(
        <button onClick={handleClick} className="card-play-button rounded-full bg-green-500 p-4 hover:scale-[1.02] transition hover:bg-green-400">
            {isPlayingPlayList ? <Pause/> : <Play/>}
        </button>
    )
}