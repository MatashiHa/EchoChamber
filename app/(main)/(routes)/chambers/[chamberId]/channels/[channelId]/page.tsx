import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
  params: {
    chamberId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      chamberId: params.chamberId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    //если пользователь пытается получить доступ к каналу, к которому у него нет доступа, возвращаем его на главную страницу
    redirect(`/`);
  }
  return (
    <div className="flex flex-col h-screen lg:mr-[256px]">
      <div className="">
        <ChatHeader
          name={channel.name}
          chamberId={channel.chamberId}
          type="channel"
          role={member?.role}
        />
      </div>
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              chamberId: channel.chamberId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            apiUrl="/api/socket/messages"
            type="channel"
            query={{
              channelId: channel.id,
              chamberId: channel.chamberId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
