import React , { ReactChild }from "react";
import { Box, Button, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { MdFileCopy, MdOpenInNew } from "react-icons/md";
import {
    ChainId,
    CHAIN_ID_ALGORAND,
    CHAIN_ID_BSC,
    CHAIN_ID_CELO,
    CHAIN_ID_ETH,
    CHAIN_ID_FANTOM,
    CHAIN_ID_POLYGON,
    CHAIN_ID_ARBITRUM,
    CHAIN_ID_SEPOLIA,
} from "@certusone/wormhole-sdk";
import { CLUSTER, getExplorerName } from "@/utils/wormhole/consts";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";


function shortenAddress(address: string) {
    return address.length > 10
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : address;
}

export default function SmartAddress({
    chainId,
    parsedTokenAccount,
    address,
    symbol,
    tokenName,
    variant,
    noGutter,
    noUnderline,
    extraContent,
    isAsset,
}: {
    chainId: ChainId;
    parsedTokenAccount?: ParsedTokenAccount;
    address?: string;
    logo?: string;
    tokenName?: string;
    symbol?: string;
    variant?: any;
    noGutter?: boolean;
    noUnderline?: boolean;
    extraContent?: ReactChild;
    isAsset?: boolean;
}) {

    const useableAddress = parsedTokenAccount?.mintKey || address || "";
    const useableSymbol = parsedTokenAccount?.symbol || symbol || "";
    const isNative = parsedTokenAccount?.isNativeAsset || false;
    const addressShort = shortenAddress(useableAddress) || "";

    const useableName = isNative
        ? "Native Currency"
        : parsedTokenAccount?.name
            ? parsedTokenAccount.name
            : tokenName
                ? tokenName
                : "";
    const explorerAddress = isNative
        ? null
        : chainId === CHAIN_ID_ETH
            ? `https://${CLUSTER === "testnet" ? "goerli." : ""}etherscan.io/${isAsset ? "token" : "address"
            }/${useableAddress}`
            : chainId === CHAIN_ID_SEPOLIA
                ? `https://${CLUSTER === "testnet" ? "sepolia." : ""}etherscan.io/${isAsset ? "token" : "address"
                }/${useableAddress}`
                : chainId === CHAIN_ID_BSC
                    ? `https://${CLUSTER === "testnet" ? "testnet." : ""}bscscan.com/${isAsset ? "token" : "address"
                    }/${useableAddress}`
                    : chainId === CHAIN_ID_POLYGON
                        ? `https://${CLUSTER === "testnet" ? "mumbai." : ""}polygonscan.com/${isAsset ? "token" : "address"
                        }/${useableAddress}`
                        : chainId === CHAIN_ID_FANTOM
                            ? `https://${CLUSTER === "testnet" ? "testnet." : ""}ftmscan.com/${isAsset ? "token" : "address"
                            }/${useableAddress}`
                            : chainId === CHAIN_ID_CELO
                                ? `https://${CLUSTER === "testnet" ? "alfajores.celoscan.io" : "explorer.celo.org"
                                }/address/${useableAddress}`
                                : chainId === CHAIN_ID_ALGORAND
                                    ? `https://${CLUSTER === "testnet" ? "testnet." : ""}algoexplorer.io/${isAsset ? "asset" : "address"
                                    }/${useableAddress}`
                                    : chainId === CHAIN_ID_ARBITRUM
                                        ? `https://${CLUSTER === "testnet" ? "goerli." : ""}arbiscan.io/${isAsset ? "token" : "address"
                                        }/${useableAddress}`
                                        : undefined;
    const explorerName = getExplorerName(chainId);

    const copyToClipboard = useClipboard(useableAddress);

    const explorerButton = !explorerAddress ? null : (
        <Button
            size="small"
            variant="outlined"
            leftIcon={<MdOpenInNew />}
            as="a"
            href={explorerAddress}
            target="_blank"
            rel="noopener noreferrer"
        >
            {"View on " + explorerName}
        </Button>
    );
    //TODO add icon here
    const copyButton = isNative ? null : (
        <Button
            size="small"
            variant="outlined"
            leftIcon={<MdFileCopy />}
        >
            Copy
        </Button>
    );

    const tooltipContent = (
        <Box>
            {useableName && <Text>{useableName}</Text>}
            {useableSymbol && !isNative && (
                <Text>
                    {addressShort}
                </Text>
            )}
            <span>
                {explorerButton}
                {copyButton}
            </span>
            {extraContent ? extraContent : null}
        </Box>
    );

    return (
        <Tooltip
            title={React.Children.toArray(tooltipContent).join("")}
        >
            <Text
                as="div"
            >
                {useableSymbol || addressShort}
            </Text>
        </Tooltip>
    );
}
