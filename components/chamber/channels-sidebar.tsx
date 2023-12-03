import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ChamberHeader } from "./chamber-header";
import { ScrollArea } from "../ui/scroll-area";
import { ChannelsSection } from "./channels-section";
import { ChamberChannel } from "./chamber-channel";

interface ChamberSidebarProps {
  chamberId: string;
  role?: MemberRole;
}

export const ChannelsSidebar = async ({
  chamberId,
  role,
}: ChamberSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const chamber = await db.chamber.findUnique({
    where: {
      id: chamberId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  // фильтруем каналы по типам
  const textChannels = chamber?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = chamber?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = chamber?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  if (!chamber) {
    return redirect("/");
  }

  //const role = chamber.members.find((member) => member.profileId)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#192235] bg-[#F5F2F3]">
      <ChamberHeader chamber={chamber} role={role} />

      <ScrollArea className="flex-1 px-3">
        {!!textChannels?.length && (
          <div className="mb-2">
            <ChannelsSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ChamberChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  chamber={chamber}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ChannelsSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ChamberChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  chamber={chamber}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ChannelsSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ChamberChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  chamber={chamber}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
