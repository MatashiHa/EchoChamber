import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

interface ChannelIdPageProps{
    params:{
        chamberId: string,
        channelId: string
    }
}

const ChannelIdPage = async ({params}:ChannelIdPageProps) => {
    const profile = await currentProfile()
    if(!profile){
        return redirectToSignIn()
    }

    const channel = await db.channel.findUnique({
        where:{
            id: params.channelId
        }
    })
    const member = await db.member.findFirst({
        where:{
            chamberId: params.chamberId,
            profileId: profile.id
        }
    })
    if(!channel || !member){

        //если пользователь пытается получить доступ к каналу, к которому у него нет доступа, возвращаем его на главную страницу
        redirect(`/`)
    }
    return ( 
        <div className="  flex flex-col h-full lg:mr-[256px]">
            <ChatHeader
                name = {channel.name}
                chamberId={channel.chamberId}  
                type= "channel"
                role = {member?.role}        
            />
            <ChatMessages
                member={member}
                name={channel.name}
                chatId={channel.id}
                type="channel"
                apiUrl="api/messages"
                socketUrl="api/socket/messages"

                socketQuery = {{
                    channelId: channel.id,
                    chamberId: channel.chamberId
                }}
                paramKey="channelId"
                paramValue={channel.id}
                />
            <ChatInput
                name = {channel.name}
                apiUrl = "/api/socket/messages"                
                type = "channel"
                query = {{
                    channelId: channel.id,
                    chamberId: channel.chamberId
                }}
            />
        </div>
     );
}
 
export default ChannelIdPage;