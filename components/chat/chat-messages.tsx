"use client"

import { Member } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, XCircle } from "lucide-react";

interface chatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationId"
    paramValue: string;
    type: "channel" | "conversation"
}
export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}:chatMessagesProps) => {

    const queryKey = `chat:${chatId}`
    const{

        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } =  useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,

    })
    if (status === "loading") {
        return(
        <div className = "flex-1 flex flex-col justify-center items-center text-slate-500 dark:text-slate-400">
            <Loader2 className="h-7 w-7  animate-spin"/> Messages loading...
        </div>
        )

    }
    if (status === "error") {
        return(
            <div className = "flex-1 flex flex-col justify-center items-center text-red-500 dark:text-red-400">
            <XCircle  className="h-7 w-7 animate"/> An error of loading messages
        </div>
        )

    }
    return(

        <div className = "flex-1 flex flex-col py-4 mr-auto owerflow-y-auto my-4">
            <div className = "flex-1"/>
            <ChatWelcome
            type = {type}
            name = {name} />
        </div>
    )
}