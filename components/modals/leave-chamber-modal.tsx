"use client";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const LeaveChamberModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  // открыто ли модальное окно для создания сервера
  const isModalOpen = isOpen && type === "leaveChamber";
  const { chamber } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/chambers/${chamber?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log("LEAVE_CHAMBER_MODAL", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Leave{" "}
            <span className="text-center text-indigo-500">
              "{chamber?.name}"
            </span>{" "}
            ?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="bg-gray-100  px-2 py-2">
          <div className="flex items-center justify-between w-full mx-8 ">
            <Button
              disabled={isLoading}
              onClick={onClick}
              variant="primary"
              className="text-2xl w-32 bg-emerald-400/50 hover:bg-emerald-500"
            >
              Yes
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
              className="text-2xl w-32 bg-red-400/75 hover:bg-red-500 text-white"
            >
              No
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
