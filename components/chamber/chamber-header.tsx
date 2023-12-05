"use client";

import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@prisma/client";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { ChamberWithMembersWithProfiles } from "@/types";

interface ChamberHeaderProps {
  chamber: ChamberWithMembersWithProfiles;
  role?: MemberRole;
}

export const ChamberHeader = ({ chamber, role }: ChamberHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full font-semibold px-3 flex items-center h-12 border-neutral-200/25 dark:border-slate-900/50 border-b-2 hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition">
          {chamber.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        <DropdownMenuItem className="text-yellow-600 dark:text-yellow-400 px-3 py-2 text-sm cursor-pointer">
          Your role: {role}
        </DropdownMenuItem>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { chamber })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editChamber", { chamber })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Chamber Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { chamber })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("createChannel")}
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteChamber", { chamber })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Chamber
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveChamber", { chamber })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Chamber
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
