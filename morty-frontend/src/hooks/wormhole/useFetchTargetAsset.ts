import { useCallback, useEffect, useState } from "react";
import {
  ChainId,
  CHAIN_ID_ALGORAND,
  getForeignAssetAlgorand,
  hexToUint8Array,
  isEVMChain,
  getForeignAssetEth,
  hexToNativeAssetString,
} from "@certusone/wormhole-sdk";
import algosdk from "algosdk";
import { ethers } from "ethers";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import {
  errorDataWrapper,
  fetchDataWrapper,
  receiveDataWrapper,
} from "@/utils/wormhole/helpers";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getEvmChainId,
  getTokenBridgeAddressForChain,
} from "@/utils/wormhole/consts";

function useFetchTargetAsset() {

  const {
    isSourceAssetWormholeWrapped,
    originChain,
    originAsset,
    targetChain,
    setTargetAsset,
  }: any = useWormholeContext();

  useEffect(() => {
    if (originAsset) {
      alert(originAsset); //origin asset is just ID
    }
  }, [originAsset]);

  const { provider, chainId: evmChainId } = useEthereumProvider();
  const correctEvmNetwork = getEvmChainId(targetChain);
  const hasCorrectEvmNetwork = evmChainId === correctEvmNetwork;

  const [lastSuccessfulArgs, setLastSuccessfulArgs] = useState<{
    isSourceAssetWormholeWrapped: boolean | undefined;
    originChain: ChainId | undefined;
    originAsset: string | undefined;
    targetChain: ChainId;
    nft?: boolean;
    tokenId?: string;
  } | null>(null);
  const argsMatchLastSuccess =
    !!lastSuccessfulArgs &&
    lastSuccessfulArgs.isSourceAssetWormholeWrapped ===
      isSourceAssetWormholeWrapped &&
    lastSuccessfulArgs.originChain === originChain &&
    lastSuccessfulArgs.originAsset === originAsset &&
    lastSuccessfulArgs.targetChain === targetChain;

  const setArgs = useCallback(
    () =>
      setLastSuccessfulArgs({
        isSourceAssetWormholeWrapped,
        originChain,
        originAsset,
        targetChain,
      }),
    [isSourceAssetWormholeWrapped, originChain, originAsset, targetChain]
  );

  useEffect(() => {
    if (argsMatchLastSuccess) {
      return;
    }
    setLastSuccessfulArgs(null);
    let cancelled = false;
    (async () => {
      if (isSourceAssetWormholeWrapped && originChain === targetChain) {
        if (!cancelled) {
          setTargetAsset(
            receiveDataWrapper({
              doesExist: true,
              address: hexToNativeAssetString(originAsset, originChain) || null,
            })
          );
        }

        if (!cancelled) {
          setArgs();
        }
        return;
      }

      if (
        isEVMChain(targetChain) &&
        provider &&
        hasCorrectEvmNetwork &&
        originChain &&
        originAsset
      ) {
        setTargetAsset(fetchDataWrapper());

        try {
          const asset = await getForeignAssetEth(
            getTokenBridgeAddressForChain(targetChain as ChainId),
            provider,
            originChain,
            hexToUint8Array(originAsset)
          );
          if (!cancelled) {
            setTargetAsset(
              receiveDataWrapper({
                doesExist: asset !== ethers.constants.AddressZero,
                address: asset,
              })
            );
            setArgs();
          }
        } catch (e) {
          if (!cancelled) {
            setTargetAsset(
              errorDataWrapper("Unable to determine existence of wrapped asset")
            );
          }
        }
      }

      if (targetChain === CHAIN_ID_ALGORAND && originChain && originAsset) {
        alert("yellow");
        setTargetAsset(fetchDataWrapper());
        try {
          const algodClient = new algosdk.Algodv2(
            ALGORAND_HOST.algodToken,
            ALGORAND_HOST.algodServer,
            ALGORAND_HOST.algodPort
          );
          const asset = await getForeignAssetAlgorand(
            //@ts-ignore
            algodClient,
            ALGORAND_TOKEN_BRIDGE_ID,
            originChain,
            originAsset
          );
          if (!cancelled) {
            setTargetAsset(
              receiveDataWrapper({
                doesExist: !!asset,
                address: asset === null ? asset : asset.toString(),
              })
            );
            setArgs();
          }
        } catch (e) {
          console.error(e);
          if (!cancelled) {
            setTargetAsset(
              errorDataWrapper("Unable to determine existence of wrapped asset")
            );
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    isSourceAssetWormholeWrapped,
    originChain,
    originAsset,
    targetChain,
    provider,
    setTargetAsset,
    hasCorrectEvmNetwork,
    argsMatchLastSuccess,
    setArgs,
  ]);
}

export default useFetchTargetAsset;
