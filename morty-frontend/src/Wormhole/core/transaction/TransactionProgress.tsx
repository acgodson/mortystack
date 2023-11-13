import {
    ChainId,
    CHAIN_ID_ARBITRUM,
    CHAIN_ID_CELO,
    CHAIN_ID_FANTOM,
    CHAIN_ID_POLYGON,
    isEVMChain,
} from "@certusone/wormhole-sdk";
import { useEffect, useState } from "react";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { CHAINS_BY_ID, CLUSTER } from "@/utils/wormhole/consts";
import { Box, Progress, Text } from "@chakra-ui/react";
import { Transaction } from "@/Wormhole/core/store/transferSlice";




export function TransactionProgress({
    chainId,
    tx,
    isSendComplete,
}: {
    chainId: ChainId;
    tx: Transaction | undefined;
    isSendComplete: boolean;
}) {

    const { provider } = useEthereumProvider();
    const [currentBlock, setCurrentBlock] = useState(0);
    useEffect(() => {
        if (isSendComplete || !tx) return;

        if (isEVMChain(chainId) && provider) {
            let cancelled = false;
            (async () => {
                while (!cancelled) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    try {
                        const newBlock = await provider.getBlockNumber();
                        if (!cancelled) {
                            setCurrentBlock(newBlock);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }

    }, [isSendComplete, chainId, provider, tx]);


    const blockDiff =
        tx && tx.block && currentBlock ? currentBlock - tx.block : undefined;
    const expectedBlocks = // minimum confirmations enforced by guardians or specified by the contract
        chainId === CHAIN_ID_POLYGON
            ? CLUSTER === "testnet"
                ? 64
                : 512
            :
            chainId === CHAIN_ID_FANTOM ||
                chainId === CHAIN_ID_CELO
                ? 1 // these chains only require 1 conf
                : chainId === CHAIN_ID_ARBITRUM
                    ? 64 // something to show progress
                    : isEVMChain(chainId)
                        ? 15
                        : 1;
    if (
        !isSendComplete &&
        (isEVMChain(chainId)) &&
        blockDiff !== undefined
    ) {
        return (
            <Box>
                <Progress
                    value={
                        blockDiff < expectedBlocks ? (blockDiff / expectedBlocks) * 75 : 75
                    }
                // variant="determinate"
                />
                <Text fontSize={"sm"} variant="body2">
                    {chainId === CHAIN_ID_ARBITRUM
                        ? `Waiting for Ethereum finality on Arbitrum block ${tx?.block}` //TODO: more advanced finality checking for Arbitrum
                        : blockDiff < expectedBlocks
                            ? `Waiting for ${blockDiff} / ${expectedBlocks} confirmations on ${CHAINS_BY_ID[chainId].name}...`
                            : `Waiting for Wormhole Network consensus...`}
                </Text>
            </Box>
        );
    }
    return null;
}
