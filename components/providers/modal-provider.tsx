"use client";

import { useEffect, useState } from "react";
import { CreateChamberModal } from "../modals/create-chamber-modal";
import { InviteModal } from "../modals/invite-modal";
import { EditChamberModal } from "../modals/edit-chamber-modal";
import { MembersModal } from "../modals/members-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";
import { LeaveChamberModal } from "../modals/leave-chamber-modal";
import { DeleteChamberModal } from "../modals/delete-chamber-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateChamberModal />
      <InviteModal/>
      <EditChamberModal />
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveChamberModal/>
      <DeleteChamberModal/>
    </>
  );
};
