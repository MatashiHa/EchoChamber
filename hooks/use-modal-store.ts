import { Chamber, Channel, ChannelType } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createChamber"
  | "invite"
  | "editChamber"
  | "members"
  | "createChannel"
  | "leaveChamber"
  | "deleteChamber"
  | "deleteChannel"
  | "editChannel";

interface ModalData {
  chamber?: Chamber;
  channel?: Channel;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
