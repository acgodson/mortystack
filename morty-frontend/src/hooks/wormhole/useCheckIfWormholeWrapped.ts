
import { useEffect } from "react";
import {
  ChainId,
  CHAIN_ID_ALGORAND,
  getOriginalAssetAlgorand,
  getOriginalAssetEth,
  isEVMChain,
  uint8ArrayToHex,
  WormholeWrappedInfo,
} from "@certusone/wormhole-sdk";
import { Algodv2 } from "algosdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
} from "@/utils/wormhole/consts";




export interface StateSafeWormholeWrappedInfo {
  isWrapped: boolean;
  chainId: ChainId;
  assetAddress: string;
  tokenId?: string;
}

const makeStateSafe = (
  info: WormholeWrappedInfo
): StateSafeWormholeWrappedInfo => ({
  ...info,
  assetAddress: uint8ArrayToHex(info.assetAddress),
});

// Check if the tokens in the configured source chain/address are wrapped
// tokens. Wrapped tokens are tokens that are non-native, I.E, are locked up on
// a different chain than this one.
function useCheckIfWormholeWrapped() {
  const {
    sourceChain,
    sourceAsset,
    isRecovery,
    setSourceWormholeWrappedInfo,
  }: any = useWormholeContext();

  const { provider } = useEthereumProvider();

  useEffect(() => {
    if (isRecovery) {
      return;
    }
    // TODO: loading state, error state
    let cancelled = false;
    (async () => {
      if (isEVMChain(sourceChain) && provider && sourceAsset) {
        const wrappedInfo = makeStateSafe(
          await getOriginalAssetEth(
            getTokenBridgeAddressForChain(sourceChain as ChainId),
            provider,
            sourceAsset,
            sourceChain
          )
        );
        if (!cancelled) {
          setSourceWormholeWrappedInfo(wrappedInfo);
        }
      }

      if (sourceChain === CHAIN_ID_ALGORAND && sourceAsset) {
        try {
          const algodClient = new Algodv2(
            ALGORAND_HOST.algodToken,
            ALGORAND_HOST.algodServer,
            ALGORAND_HOST.algodPort
          );
          const wrappedInfo = makeStateSafe(
            await getOriginalAssetAlgorand(
              //@ts-ignore
              algodClient,
              ALGORAND_TOKEN_BRIDGE_ID,
              BigInt(sourceAsset)
            )
          );
          if (!cancelled) {
            setSourceWormholeWrappedInfo(wrappedInfo);
          }
        } catch (e) {}
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    isRecovery,
    sourceChain,
    sourceAsset,
    provider,
    setSourceWormholeWrappedInfo,
  ]);
}

export default useCheckIfWormholeWrapped;
