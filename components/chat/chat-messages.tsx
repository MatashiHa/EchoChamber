"use client"

import { Member } from "@prisma/client";

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
    return(

        <div className = "flex-1 flex flex-col w py-4 mr-auto owerflow-y-auto">
            gfngrjopsg grjnkokf nqwef newopmefbgeoqWBGIFRFEWQEFBTJCASFJBEWQO-=DBFQWOKERJCASL,M;QSWOENVSQWO-KENSCALVNKEWOCASVMGOWLCSBFKOBSAPQ[FBOKD-]
        </div>
    )
}