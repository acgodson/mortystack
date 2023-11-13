import { useEffect, useMemo } from "react";
import {
  CHAIN_ID_ALGORAND,
  ethers_contracts,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import { Algodv2 } from "algosdk";
import { formatUnits } from "ethers/lib/utils";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import {
  ALGORAND_HOST, getEvmChainId,
} from "@/utils/wormhole/consts";
import { createParsedTokenAccount } from "@/hooks/wormhole/useGetSourceParsedTokenAccounts";
import useMetadata from "./useMetaData";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";






function useGetTargetParsedTokenAccounts() {

  const {
    targetChain,
    targetAsset,
    setTargetParsedTokenAccount }: any = useWormholeContext()

  const targetAssetArrayed = useMemo(
    () => (targetAsset ? [targetAsset] : []),
    [targetAsset]
  );
  const metadata = useMetadata(targetChain, targetAssetArrayed);
  const tokenName =
    (targetAsset && metadata.data?.get(targetAsset)?.tokenName) || undefined;
  const symbol =
    (targetAsset && metadata.data?.get(targetAsset)?.symbol) || undefined;
  const logo =
    (targetAsset && metadata.data?.get(targetAsset)?.logo) || undefined;
  const decimals =
    (targetAsset && metadata.data?.get(targetAsset)?.decimals) || undefined;
  const {
    provider,
    signerAddress,
    chainId: evmChainId,
  } = useEthereumProvider();
  const hasCorrectEvmNetwork = evmChainId === getEvmChainId(targetChain);
  const { account: algoAccounts } = useRelayContext();
  const hasResolvedMetadata = metadata.data || metadata.error;

  useEffect(() => {
    // targetParsedTokenAccount is cleared on setTargetAsset, but we need to clear it on wallet changes too
    setTargetParsedTokenAccount(undefined)
    if (!targetAsset || !hasResolvedMetadata) {
      return;
    }
    let cancelled = false;

    if (
      isEVMChain(targetChain) &&
      provider &&
      signerAddress &&
      hasCorrectEvmNetwork
    ) {
      const token = ethers_contracts.TokenImplementation__factory.connect(
        targetAsset,
        provider
      );
      token
        .decimals()
        .then((decimals) => {
          token.balanceOf(signerAddress).then((n) => {
            if (!cancelled) {

              setTargetParsedTokenAccount(
                createParsedTokenAccount(
                  signerAddress,
                  token.address,
                  n.toString(),
                  decimals,
                  Number(formatUnits(n, decimals)),
                  formatUnits(n, decimals),
                  symbol,
                  tokenName,
                  logo
                )
              )
            }
          });
        })
        .catch(() => {
          if (!cancelled) {
            // TODO: error state
          }
        });
    }


    if (
      targetChain === CHAIN_ID_ALGORAND &&
      algoAccounts &&
      decimals !== undefined
    ) {
      const algodClient = new Algodv2(
        ALGORAND_HOST.algodToken,
        ALGORAND_HOST.algodServer,
        ALGORAND_HOST.algodPort
      );
      try {
        const tokenId = BigInt(targetAsset);
        algodClient
          .accountInformation(algoAccounts.addr)
          .do()
          .then((accountInfo) => {
            let balance = 0;
            if (tokenId === BigInt(0)) {
              balance = accountInfo.amount;
            } else {
              let ret = 0;
              const assets: Array<any> = accountInfo.assets;
              assets.forEach((asset) => {
                if (tokenId === BigInt(asset["asset-id"])) {
                  ret = asset.amount;
                  return;
                }
              });
              balance = ret;
            }

            setTargetParsedTokenAccount(createParsedTokenAccount(
              algoAccounts.addr,
              targetAsset,
              balance.toString(),
              decimals,
              Number(formatUnits(balance, decimals)),
              formatUnits(balance, decimals),
              symbol,
              tokenName,
              logo
            ))


          })
          .catch(() => {
            if (!cancelled) {
              // TODO: error state
            }
          });
      } catch (e) {
        if (!cancelled) {
          // TODO: error state
        }
      }
    }


    return () => {
      cancelled = true;
    };
  }, [
    targetAsset,
    targetChain,
    provider,
    signerAddress,
    hasCorrectEvmNetwork,
    hasResolvedMetadata,
    symbol,
    tokenName,
    logo,
    algoAccounts,
    decimals,
  ]);
}

export default useGetTargetParsedTokenAccounts;
