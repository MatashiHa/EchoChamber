import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ChamberHeader } from "./chamber-header";
import { ChamberWithMembersWithProfiles } from "@/lib/types";

interface ChamberSidebarProps {
  chamberId: string;
}

export const ChannelsSidebar = async ({ chamberId }: ChamberSidebarProps) => {
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
  }) ;

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

  const role = chamber.members.find((member) => member.profileId)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#192235] bg-[#F2F3F5]">
      <ChamberHeader chamber={chamber} role={role} />
    </div>
  );
};
