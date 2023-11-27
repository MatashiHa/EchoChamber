import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { MemberRole } from "@prisma/client";
import { UserAvatar } from "../ui/user-avatar";
import { SocketIndicator } from "../socket-indicator";

interface ChatHeaderProps{
    chamberId: string;
    name: string;
    type: "channel" | "conversation"
    imageUrl?: string;
    role: MemberRole;
}

export const ChatHeader = ( {
    chamberId,
     name,
    type,
    imageUrl,
    role
    }: ChatHeaderProps  ) => {
    return(
    <div className="text-md font-semibold px-3 flex items-center h-12 border-b-2
    bg-[#F2F3F5] 
    dark:bg-[#192235]
    border-[#E9E9EA]
    dark:border-[#262646]
    ">
        <MobileToggle 
        chamberId={chamberId}
        role = {role}/>
        {type === "channel" &&(
            <Hash className=" ml-3 mr-1 w-5 h-5 text-zinc-500
            dark:text-zinc-400"/>
        )}
        {type === "conversation" && 
        <UserAvatar
        src={imageUrl}
        className="h-8 w-8 md:h-8 md:w-8 mr-2 ml-2"/>}
        <p
        className="font-semibold text-md text-black dark:text-white"
        >
        {name}
        </p>
        <div className="md:ml-2 ml-auto">
           | <SocketIndicator/>
        </div>
    </div>
    )
}