"use client";
import { Check, Copy, RefreshCw } from "lucide-react";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();


  // открыто ли модальное окно для создания сервера
  const isModalOpen = isOpen && type === "invite";
  const {chamber} = data

  const[copied, setCopied] = useState(false);
  const[isLoading, setIsLoading] = useState(false);


  const inviteURL =`${origin}/invite/${chamber?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL)

    setCopied(true)
    //после одной секунды считаем, что ссылку можно копировать снова
    setTimeout(() => {
      setCopied(false)
    }, 1000);
  }

  const onNew =async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/chambers/${chamber?.id}/invite-code`)
      
      onOpen ("invite", {chamber: response.data})
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Chamber invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
            disabled ={isLoading}
            className="bg-zinc-400/50 border-0 
            focus-visible:ring-0 text-black 
            focus-visible:ring-offset-0"
            value={inviteURL}
            />
            <Button disabled ={isLoading} onClick={onCopy} size="icon">
              {copied
                ? <Check className="w-4 h-4"/>
                : <Copy className="w-4 h-4"></Copy>
              }
            </Button>
          </div>
          <Button
          onClick={onNew}
          disabled ={isLoading}
          variant="link"
          size="sm"
          className="text-xs text-zinc-500 mt-4"          >
            <RefreshCw className="w-4 h-4 ml-2 mr-2"/>
            Generate a new link            
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
