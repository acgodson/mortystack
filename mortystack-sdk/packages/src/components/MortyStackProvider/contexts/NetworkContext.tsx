import React, { createContext, useContext, useEffect, useState } from 'react';


export const NetworkContext = createContext<{
  id?: string | undefined;
  status?: string | null
}>({});



export const defaultNetworkInfo = {
  id: undefined,
  status: null,
};

export const NetworkProvider = ({ children }) => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkNetworkStatus = () => {
      //add logic TODO
      const isOnline = navigator.onLine;
      setStatus(isOnline ? 'success' : 'error');
    };
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    checkNetworkStatus();
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, [status]);

  return (
    <NetworkContext.Provider value={{ ...defaultNetworkInfo, status }}>
      {children}
    </NetworkContext.Provider>
  );
};








// Custom hook to access network status
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
