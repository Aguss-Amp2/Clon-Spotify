import { useState } from "react"
import Pause from "../icons/Pause.astro"
import Play from "../icons/Play.astro"

export function Player () {
    const [isPlaying, setPlaying] = useState(false)

    return (
        <div className="flex flex-row justify-between w-full px-4 z-50">
            <div>
                Current song...
            </div>
            <div className="grid place-content-center gap-4 flex-1">
                <div className="flex justify-center">
                    <button className="bg-white rounded-full p-2" onClick={() => setPlaying(!isPlaying)}>
                        {isPlaying ? <Pause/> : <Play/>}
                    </button>
                </div>
            </div>
            <div>
                Volume
            </div>
        </div>
    )
}