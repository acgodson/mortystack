import { Provider } from "@/contexts//WormholeContext/EthereumWalletContext";

import {
  ChainId,
  EVMChainId,
  getOriginalAssetAlgorand,
  getOriginalAssetEth,
  uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { Algodv2 } from "algosdk";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
} from "@/utils/wormhole/consts";

export interface AssetInfo {
  isSourceAssetWormholeWrapped: boolean;
  originChain: ChainId;
  originAsset: string;
}

export async function algorandOriginAsset(mintAddress: string) {
  try {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );

    const wrappedInfo = await getOriginalAssetAlgorand(
      //@ts-ignore
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      BigInt(mintAddress)
    );

    const { isWrapped, chainId, assetAddress } = wrappedInfo;

    const assetInfo: AssetInfo = {
      isSourceAssetWormholeWrapped: isWrapped,
      originChain: chainId,
      originAsset: uint8ArrayToHex(assetAddress),
    };

    return assetInfo;
  } catch (e) {}
}

export async function evmOriginAsset(
  mintAddress: string,
  sourceChain: EVMChainId,
  provider: Provider
) {
  try {
    const wrappedInfo = await getOriginalAssetEth(
      getTokenBridgeAddressForChain(sourceChain),
      provider!,
      mintAddress,
      sourceChain
    );

    const { isWrapped, chainId, assetAddress } = wrappedInfo;

    const assetInfo: AssetInfo = {
      isSourceAssetWormholeWrapped: isWrapped,
      originChain: chainId,
      originAsset: uint8ArrayToHex(assetAddress),
    };

    return assetInfo;
  } catch (e) {
    console.error(e);
  }
}
