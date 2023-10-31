import React, { ReactNode, createContext, useState } from "react";

export const AppContext = createContext<{
  appName?: string;
  url?: string;
  setAppInfo?: (info: { appName?: string; url?: string }) => void;
}>({});



export const defaultAppInfo = {
  appName: undefined,
  url: "",
};
export const AppProvider = ({ children }: any) => {
  const [appInfo, setAppInfo] = useState<{ appName?: string; url?: string }>(defaultAppInfo);

  return (
    <AppContext.Provider value={{ ...appInfo, setAppInfo }}>
      {children}
    </AppContext.Provider>
  );
};
