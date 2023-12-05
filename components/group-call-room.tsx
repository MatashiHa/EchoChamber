"use client"

import { useEffect, useState } from "react"
import {AudioConference, LiveKitRoom} from "@livekit/components-react"
import "@livekit/components-styles"
import { Channel } from "@prisma/client"
import { useUser } from "@clerk/nextjs"
import {Loader2} from "lucide-react"

interface GroupCallProps {
    chatId: string
    video: boolean
    audio: boolean
}

export const GroupCall =({
    chatId,
    video,
    audio
}: GroupCallProps) => {
    const {user} = useUser()
    const [token, setToken] = useState("")

    useEffect(() => {
        if(!user?.username){
            return           
        }
        const name = user.username;
        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.log("[MEDIA_ROOM]",error)
            }
        })()
    },[user?.username, chatId])

    if(token ===""){
        return(
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2
                className="h-7 w-7 text-slate-500 animate-spin my-4"
                /> Loading...
            </div>
        )
    }
    return (
        <LiveKitRoom
        data-lk-theme = "default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token = {token}
        connect = {true}
        video = {video}
        audio = {audio}
        >
            <AudioConference/>
        </LiveKitRoom>
    )
}