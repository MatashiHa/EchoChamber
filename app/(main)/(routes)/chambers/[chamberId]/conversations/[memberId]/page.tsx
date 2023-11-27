import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps{
    params: {
        memberId: string,
        //это id другого члена сервера, который наш партнёр по диалогу
        chamberId: string
    }
}

const MemberIdPage = async({params}: MemberIdPageProps) => {
    const profile = await currentProfile()
    if(!profile){
        return redirectToSignIn()
    }
    const currentMember = await db.member.findFirst({
        where:{
            chamberId: params.chamberId,
            profileId: profile.id
        },
        include:{
            profile: true
        }
    })
    if(!currentMember){
        return redirect(`/`)
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)
    if(!conversation){
        //если по какой-то причине не создался диалог, переводим пользователя на главную странциу сервера
        return redirect(`/chambers/${params.chamberId}`)
    }
    const {memberOne, memberTwo} = conversation

    //если текущий профиль - это memberOne, то собеседник - это memberTwo, и наоборот
    const otherMember = (memberOne.profileId === profile.id)? memberTwo: memberOne
    return ( 
        <div className="bg-white dark:bg-[#192235] flex flex-col h-full">
             <ChatHeader
                imageUrl = {otherMember.profile.imageUrl}
                name = {otherMember.profile.name}
                chamberId = {params.chamberId}
                type = "conversation"
                role = {currentMember?.role}
             />
        </div>
     );
}
 
export default MemberIdPage;