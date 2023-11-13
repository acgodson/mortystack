import { PeraWalletConnect } from "@perawallet/connect"
import { Account } from "algosdk";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

interface IAlgorandContext {
  account: Account | null,
  setAccount(account: Account | null): void,
}


const AlgorandContext = createContext<IAlgorandContext>({
  account: null,
  setAccount: (account: Account | null) => { },
});

export const RelayWalletProvider = ({ children }: { children: any }) => {

  const peraWallet = new PeraWalletConnect({
    chainId: 416001
  });

  const [account, setAccount] = useState<Account | null>(null)



  return (
    <AlgorandContext.Provider value={{ account, setAccount }}>
      {children}
    </AlgorandContext.Provider>
  );
};

export const useRelayContext = () => {
  return useContext(AlgorandContext);
};
