"use client";

import { useEffect, useState } from "react";
import { CreateChamberModal } from "../modals/create-chamber-modal";

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
    </>
  );
};
