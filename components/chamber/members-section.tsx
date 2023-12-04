"use client";

import { useModal } from "@/hooks/use-modal-store";
import { ChamberWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";

interface MembersSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "members";
  channelType?: ChannelType;
  chamber?: ChamberWithMembersWithProfiles;
}

export const MembersSection = ({
  label,
  role,
  sectionType,
  chamber,
}: MembersSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="w-full text-center text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { chamber })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
