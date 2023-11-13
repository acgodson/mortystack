import {
    ChainId,
    CHAIN_ID_ALGORAND,
    CHAIN_ID_BSC,
    CHAIN_ID_CELO,
    CHAIN_ID_ETH,
    CHAIN_ID_FANTOM,
    CHAIN_ID_POLYGON,
    CHAIN_ID_ARBITRUM,
} from "@certusone/wormhole-sdk";
import { CLUSTER, getExplorerName } from "@/utils/wormhole/consts";
import { Transaction } from "@/Wormhole/core/store/transferSlice";
import { Box, Button, Center, Text } from "@chakra-ui/react";

export function ShowTx({
    chainId,
    tx,
}: {
    chainId: ChainId;
    tx: Transaction;
}) {

    const showExplorerLink = CLUSTER === "testnet" || CLUSTER === "devnet";
    const explorerAddress =
        chainId === CHAIN_ID_ETH
            ? `https://${CLUSTER === "testnet" ? "goerli." : ""}etherscan.io/tx/${tx?.id
            }`
            : chainId === CHAIN_ID_BSC
                ? `https://${CLUSTER === "testnet" ? "testnet." : ""}bscscan.com/tx/${tx?.id
                }`
                : chainId === CHAIN_ID_POLYGON
                    ? `https://${CLUSTER === "testnet" ? "mumbai." : ""}polygonscan.com/tx/${tx?.id
                    }`

                    : chainId === CHAIN_ID_FANTOM
                        ? `https://${CLUSTER === "testnet" ? "testnet." : ""}ftmscan.com/tx/${tx?.id
                        }`

                        : chainId === CHAIN_ID_CELO
                            ? `https://${CLUSTER === "testnet" ? "alfajores.celoscan.io" : "explorer.celo.org"
                            }/tx/${tx?.id}`


                            : chainId === CHAIN_ID_ALGORAND
                                ? `https://${CLUSTER === "testnet" ? "testnet." : ""}algoexplorer.io/tx/${tx?.id
                                }`
                                : chainId === CHAIN_ID_ARBITRUM
                                    ? `https://${CLUSTER === "testnet" ? "goerli." : ""}arbiscan.io/tx/${tx?.id
                                    }`
                                    : undefined;
    const explorerName = getExplorerName(chainId);


    return (
        <Box
            mt={2}
            fontSize={"xs"}>

            <Text
                py={3}
                bg="blackAlpha.400"
                px={5}
                variant="body2">
                {tx.id}
            </Text>
            {showExplorerLink && explorerAddress ? (
                <Center w="100%">
                    <Button
                        py={4}
                        textAlign={"center"}
                        as="a"
                        href={explorerAddress}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        variant="outlined"
                    >
                        View on {explorerName}
                    </Button>
                </Center>
            ) : null}
        </Box>
    );
}
