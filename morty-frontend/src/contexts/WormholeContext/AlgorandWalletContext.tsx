import { PeraWalletConnect } from "@perawallet/connect"
import { Account } from "algosdk";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

interface IAlgorandContext {
  connect(): void,
  disconnect(): void,
  account: Account | null,
  setAccount(account: Account | null): void,
}



interface PeraWalletConnectOptions {
  shouldShowSignTxnToast?: boolean;
  chainId?: AlgorandChainIDs;
}


const AlgorandContext = createContext<IAlgorandContext>({
  connect: () => { },
  disconnect: () => { },
  account: null,
  setAccount: (account: Account | null) => { },
});

export const AlgorandWalletProvider = ({ children }: { children: any }) => {

  const peraWallet = new PeraWalletConnect({
    chainId: 416001
  });

  const [account, setAccount] = useState<Account | null>(null)
  const isConnectedToPeraWallet = !!account;


  const connect = () => {
    peraWallet
      .connect()
      .then((newAccounts: any) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", disconnect);
        setAccount(newAccounts[0]);
      })
      .catch((error: any) => {
        // Handle the reject here
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }


  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession()
      .then((accounts: any) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", disconnect);

        if (peraWallet.isConnected && accounts.length) {
          setAccount(accounts[0]);
        }
      })
      .catch((error: any) => { // Add parameter name for the error
        console.log(error);
      });

  }, []);


  function disconnect() {
    peraWallet.disconnect();

    setAccount(null);
  }



  return (
    <AlgorandContext.Provider value={{ connect, disconnect, account, setAccount }}>
      {children}
    </AlgorandContext.Provider>
  );
};

export const useAlgorandContext = () => {
  return useContext(AlgorandContext);
};
