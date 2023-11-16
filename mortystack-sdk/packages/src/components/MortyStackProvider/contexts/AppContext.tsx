import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePay } from "../../../hooks/usePay";


export const AppContext = createContext<{
  id?: string,
  assets?: any,
  appName?: string;
  url?: string;
  setAppInfo?(info: any): void

}>({});



export const defaultAppInfo = {
  id: "",
  appName: undefined,
  assets: undefined,
  url: "",
};
export const AppProvider = ({ children, appInfo }: any) => {
  const { countdown, status, txn } = usePay()


  useEffect(() => {
    const storedRef = localStorage.getItem('lastReference');
    if (storedRef) {

      // trigger verification

    }
  }, []);

  return (
    <AppContext.Provider value={appInfo}>
      {children}
    </AppContext.Provider>
  );
};



export const useAppInfo = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
