import { useTransfer } from "@/Wormhole/core/";
import React, { createContext, useContext } from "react";


interface WormholeStoreContextProps {
}




const WormholeStoreContext = createContext<WormholeStoreContextProps | undefined>(
  undefined
);

export const useWormholeContext = () => {
  const context = useContext(WormholeStoreContext);
  if (!context) {
    throw new Error("useWormholeContext must be used within a WormholeProvider");
  }
  return context;
};


export const WormholeProvider = (prop: { children: any }) => {
  // const attestHook = useAttest();
  const transferHook = useTransfer();


  return (
    <WormholeStoreContext.Provider value={{ ...transferHook, }}>
      {prop.children}
    </WormholeStoreContext.Provider>
  );
};
