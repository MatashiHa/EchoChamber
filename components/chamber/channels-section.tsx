"use client";

import { useModal } from "@/hooks/use-modal-store";
import { ChamberWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus } from "lucide-react";

interface ChannelsSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels";
  channelType?: ChannelType;
  chamber?: ChamberWithMembersWithProfiles;
}

export const ChannelsSection = ({
  label,
  role,
  sectionType,
  channelType,
  chamber,
}: ChannelsSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
