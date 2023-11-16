import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useVerify, useVerify as useVerifyHook } from '../../../hooks/useVerify';

export const NetworkContext = createContext<{
  id?: string | undefined;
  status?: string | null,
} | any>({});



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



export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
