import {
  ChainId,
  EVMChainId,
  getForeignAssetAlgorand,
  getForeignAssetEth,
  getForeignAssetSolana,
  hexToUint8Array,
} from "@certusone/wormhole-sdk";
import { Provider } from "@/contexts/WormholeContext/EthereumWalletContext";
import algosdk from "algosdk";
import { ethers } from "ethers";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
} from "@/utils/wormhole/consts";

export async function algorandTargetAsset(
  originChain: ChainId,
  originAsset: string
) {
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

    const data = {
      doesExist: !!asset,
      address: asset === null ? asset : asset.toString(),
    };

    return data;
  } catch (e) {
    console.error("error getting foreign asset", e);
  }
}

export async function evmTargetAsset(
  targetChain: EVMChainId,
  provider: Provider,
  originChain: ChainId,
  originAsset: string
) {
  try {
    const asset = await getForeignAssetEth(
      getTokenBridgeAddressForChain(targetChain),
      provider!,
      originChain,
      hexToUint8Array(originAsset)
    );

    const data = {
      doesExist: asset !== ethers.constants.AddressZero,
      address: asset,
    };

    return data;
  } catch (e) {
    console.error("error getting foreign asset", e);
  }
}
