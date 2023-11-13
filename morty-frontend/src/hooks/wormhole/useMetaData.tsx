import { useMemo } from "react";
import {
  ChainId,
  CHAIN_ID_ALGORAND,
  isEVMChain,
} from "@certusone/wormhole-sdk";
import useAlgoMetadata, { AlgoMetadata } from "@/hooks/wormhole/useAlgoMetadata";
import { DataWrapper, getEmptyDataWrapper } from "@/utils/wormhole/helpers";
import useEvmMetadata, { EvmMetadata } from "@/hooks/wormhole/useEvmMetata";


export type GenericMetadata = {
  symbol?: string;
  logo?: string;
  tokenName?: string;
  decimals?: number;
  //TODO more items
  raw?: any;
};

const constructEthMetadata = (
  addresses: string[],
  metadataMap: DataWrapper<Map<string, EvmMetadata> | null>
) => {
  const isFetching = metadataMap.isFetching;
  const error = metadataMap.error;
  const receivedAt = metadataMap.receivedAt;
  const data = new Map<string, GenericMetadata>();
  addresses.forEach((address) => {
    const meta = metadataMap.data?.get(address);
    const obj = {
      symbol: meta?.symbol || undefined,
      logo: meta?.logo || undefined,
      tokenName: meta?.tokenName || undefined,
      decimals: meta?.decimals,
    };
    data.set(address, obj);
  });

  return {
    isFetching,
    error,
    receivedAt,
    data,
  };
};

const constructAlgoMetadata = (
  addresses: string[],
  metadataMap: DataWrapper<Map<string, AlgoMetadata> | null>
) => {
  const isFetching = metadataMap.isFetching;
  const error = metadataMap.error;
  const receivedAt = metadataMap.receivedAt;
  const data = new Map<string, GenericMetadata>();
  addresses.forEach((address) => {
    const meta = metadataMap.data?.get(address);
    const obj = {
      symbol: meta?.symbol || undefined,
      logo: undefined,
      tokenName: meta?.tokenName || undefined,
      decimals: meta?.decimals,
    };
    data.set(address, obj);
  });

  return {
    isFetching,
    error,
    receivedAt,
    data,
  };
};


export default function useMetadata(
  chainId: ChainId,
  addresses: string[]
): DataWrapper<Map<string, GenericMetadata>> {


  const ethereumAddresses = isEVMChain(chainId) ? addresses : [];
  const algoAddresses = chainId === CHAIN_ID_ALGORAND ? addresses : [];

  const ethMetadata = useEvmMetadata(ethereumAddresses, chainId);
  const algoMetadata = useAlgoMetadata(algoAddresses);


  const output: DataWrapper<Map<string, GenericMetadata>> = useMemo(
    () =>
      isEVMChain(chainId)
        ? constructEthMetadata(ethereumAddresses, ethMetadata)

        : chainId === CHAIN_ID_ALGORAND
          ? constructAlgoMetadata(algoAddresses, algoMetadata)
          : getEmptyDataWrapper(),
    [
      chainId,
      ethereumAddresses,
      ethMetadata,
      algoAddresses,
      algoMetadata,
    ]
  );

  return output;
}
