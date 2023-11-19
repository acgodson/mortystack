import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePay } from "../../../hooks/usePay";
import { SignerType } from "..";


export const AppContext = createContext<{
  id?: string,
  assets?: any,
  appName?: string;
  url?: string;
  setAppInfo?(info: any): void
  signer?: SignerType | undefined
  reference: string | null,
  txnID: string | null,
  receipt: bigint | number | null,
  setReference(ref: any): void,
  setTxnID(r: string): void,
  setReceipt(): void
}>({
  reference: null,
  txnID: null,
  receipt: null,
  setReference: (r) => { },
  setTxnID: () => { },
  setReceipt: () => { }
});



export const defaultAppInfo = {
  id: "",
  appName: undefined,
  assets: undefined,
  url: "",
  signer: undefined,
  reference: null,
  assetID: "",
  txnID: "",
  setReference: () => { },
  setTxnID: () => { },

};
export const AppProvider = ({ children, appInfo }: any) => {
  const [reference, setReference] = useState<string | null>(""); //reference from txn
  const [receipt, setReceipt] = useState("") //claimable receipt
  const [txnID, setTxnID] = useState("")


  useEffect(() => {
    const storedRef = localStorage.getItem('lastReference');
    if (storedRef) {

      // trigger verification

    }
  }, []);

  return (
    <AppContext.Provider
      value={
        {
          ...appInfo,
          reference,
          setReference,
          receipt,
          setReceipt,
          txnID,
          setTxnID
        }
      }
    >
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
