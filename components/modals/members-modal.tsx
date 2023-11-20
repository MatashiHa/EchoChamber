"use client";

import qs from "query-string"

import { Check, Copy, Crown, MoreVertical , ArrowUpCircle, User, Ban , Loader2 } from "lucide-react";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChamberWithMembersWithProfiles } from "@/lib/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../ui/user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST": <User  className="h-4 w-4 mr-2 text-zinc-600"/>,
  "MODERATOR": <ArrowUpCircle  className="h-4 w-4 mr-2 text-green-700"/>,
  "ADMIN": <Crown className="h-4 w-4 mr-2 text-yellow-600"/>,
}

export const MembersModal = () => {
  const router = useRouter()

  const { isOpen, onOpen, onClose, type, data } = useModal();


  // открыто ли модальное окно для создания сервера
  const isModalOpen = isOpen && type === "members";
  const {chamber} = data as {chamber: ChamberWithMembersWithProfiles}

  const[copied, setCopied] = useState(false);
  const[loadingId, setLoadingId] = useState("");

  const onKick = async (memberId: string) =>{
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query: {
          chamberId: chamber?.id
        }
      })

      const response = await axios.delete(url)
      router.refresh()
      onOpen("members", {chamber : response.data})

    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId("")
    }
  }
  const onRoleChange =async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)

      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query: {
          chamberId: chamber?.id
        }
      })

      const response = await axios.patch(url, { role })
      router.refresh()
      onOpen("members", {chamber : response.data})

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage members
            <DialogDescription
            className=" text-zinc-500 mt-4 ml-4"
            >
              {chamber?.members?.length} Member(s)
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] ">
          {chamber?.members?.map((member) =>(
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl}/>
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center">
                {roleIconMap[member.role]} 
                {member.profile.name}              
                <p className="text-xxs text-zinc-500 px-2 flex items-center">
                ({member.role})
                </p>
                </div>

                <p className="text-xxs text-zinc-500 font flex items-center">
                {member.profile.email}
                </p>
              </div>
              {chamber.profileId !== member.profileId && loadingId !==  member.id &&
              (
                <div className="flex justify-end items-center ml-auto ">
                <div >
                  <ActionTooltip side="left" align="center" label="Kick">
                        <Button className="border-0"
                        onClick={ () => onKick(member.id)}>
                          <Ban  className="h-6 w-6 text-red-500"/>
                        </Button>
                  </ActionTooltip>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger >
                      <ActionTooltip side="left" align="center" label="Change Role">
                          <MoreVertical className="h-6 w-6 text-zinc-500"/>
                      </ActionTooltip>
                                        
                    </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuItem
                    onClick={() =>  onRoleChange(member.id, "GUEST") }
                    >
                      <User  className="h-4 w-4 mr-2 text-zinc-400"/>
                      GUEST
                      </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={() =>  onRoleChange(member.id, "MODERATOR") }
                    >
                      <ArrowUpCircle  className="h-4 w-4 mr-2 text-green-700"/>
                      MODERATOR
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                                     
                </DropdownMenu>
              </div>              
            </div>
              )}
            {loadingId === member.id &&(
              <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
            )}
            </div>
          ))}
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
};
