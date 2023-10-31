import React, { createContext, ReactNode, useContext } from "react";
import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";


interface ModalContextProps {
  children: ReactNode;
}

interface ModalContextValue extends UseDisclosureReturn { }

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: ModalContextProps) {
  const disclosure = useDisclosure();


  return (
    <ModalContext.Provider value={disclosure}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
