import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";


export type Provider = ethers.providers.Web3Provider | undefined;
export type Signer = ethers.Signer | undefined;

export enum ConnectType {
  METAMASK
}

export interface Connection {
  connectType: ConnectType;
  name: string;
  icon: string;
}

interface IEthereumProviderContext {
  connect(connectType: ConnectType): void;
  disconnect(): void;
  provider: Provider;
  chainId: number | undefined;
  signer: Signer;
  signerAddress: string | undefined;
  providerError: string | null;
  availableConnections: Connection[];
  connectType: ConnectType | undefined;
}

const EthereumProviderContext = React.createContext<IEthereumProviderContext>({
  connect: (connectType: ConnectType) => { },
  disconnect: () => { },
  provider: undefined,
  chainId: undefined,
  signer: undefined,
  signerAddress: undefined,
  providerError: null,
  availableConnections: [],
  connectType: undefined,
});

export const EthereumWalletProvider = ({ children }: { children: any }) => {
  const [providerError, setProviderError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [signer, setSigner] = useState<Signer>(undefined);
  const [signerAddress, setSignerAddress] = useState<string | undefined>(
    undefined
  );
  const [availableConnections, setAvailableConnections] = useState<
    Connection[]
  >([]);
  const [connectType, setConnectType] = useState<ConnectType | undefined>(
    undefined
  );
  const [ethereumProvider, setEthereumProvider] = useState<any>(undefined);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      const connections: Connection[] = [];
      try {
        const detectedProvider = await detectEthereumProvider();
        if (detectedProvider) {
          connections.push({
            connectType: ConnectType.METAMASK,
            name: "MetaMask",
            icon: "/icons/metamask-fox.svg",
          });
        }
      } catch (error) {
        console.error(error);
      }
      if (!cancelled) {
        setAvailableConnections(connections);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const disconnect = useCallback(() => {
    setProviderError(null);
    setProvider(undefined);
    setChainId(undefined);
    setSigner(undefined);
    setSignerAddress(undefined);
    setConnectType(undefined);
    if (ethereumProvider?.removeAllListeners) {
      ethereumProvider.removeAllListeners();
    }
    setEthereumProvider(undefined);

  }, [ethereumProvider]);

  const connect = useCallback(
    (connectType: ConnectType) => {
      setConnectType(connectType);
      if (connectType === ConnectType.METAMASK) {
        detectEthereumProvider()
          .then((detectedProvider) => {
            if (detectedProvider) {
              setEthereumProvider(detectedProvider);
              const provider = new ethers.providers.Web3Provider(
                // @ts-ignore
                detectedProvider,
                "any"
              );
              provider
                .send("eth_requestAccounts", [])
                .then(async () => {
                  setProviderError(null);
                  setProvider(provider);
                  provider
                    .getNetwork()
                    .then((network) => {
                      setChainId(Number(network.chainId));
                    })
                    .catch(() => {
                      setProviderError(
                        "An error occurred while getting the network"
                      );
                    });
                  const signer = await provider.getSigner();
                  setSigner(signer);
                  signer
                    .getAddress()
                    .then((address) => {
                      setSignerAddress(address);
                    })
                    .catch(() => {
                      setProviderError(
                        "An error occurred while getting the signer address"
                      );
                    });

                  if (detectedProvider && detectedProvider.on) {
                    detectedProvider.on("chainChanged", (chainId) => {
                      try {
                        setChainId(Number(chainId));
                      } catch (e) { }
                    });
                    detectedProvider.on("accountsChanged", async (accounts) => {
                      try {
                        const signer = await provider.getSigner();
                        setSigner(signer);
                        signer
                          .getAddress()
                          .then((address) => {
                            setSignerAddress(address);
                          })
                          .catch(() => {
                            setProviderError(
                              "An error occurred while getting the signer address"
                            );
                          });
                      } catch (e) { }
                    });
                  }
                })
                .catch(() => {
                  setProviderError(
                    "An error occurred while requesting eth accounts"
                  );
                });
            } else {
              setProviderError("Please install MetaMask");
            }
          })
          .catch(() => {
            setProviderError("Please install MetaMask");
          });
      }
    },
    [disconnect]
  );

  const contextValue = useMemo(
    () => ({
      connect,
      disconnect,
      provider,
      chainId,
      signer,
      signerAddress,
      providerError,
      availableConnections,
      connectType,
    }),
    [
      connect,
      disconnect,
      provider,
      chainId,
      signer,
      signerAddress,
      providerError,
      availableConnections,
      connectType,
    ]
  );
  return (
    <EthereumProviderContext.Provider value={contextValue}>
      {children}
    </EthereumProviderContext.Provider>
  );
};
export const useEthereumProvider = () => {
  return useContext(EthereumProviderContext);
};
