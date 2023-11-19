"use client";

import { useEffect, useState } from "react";
import { CreateChamberModal } from "../modals/create-chamber-modal";
import { InviteModal } from "../modals/invite-modal";

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
    </>
  );
};
