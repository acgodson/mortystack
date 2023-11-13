import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
    hexToNativeString,
} from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import useSyncTargetAddress from "@/hooks/wormhole/useSyncTargetAddress";
import { KeyAndBalance, SmartAddress } from "@/Wormhole/core";


export const useTargetInfo = () => {
    const { targetChain, targetAddressHex, targetAsset, targetParsedTokenAccount }: any = useWormholeContext()
    const tokenName = targetParsedTokenAccount?.name;
    const symbol = targetParsedTokenAccount?.symbol;
    const logo = targetParsedTokenAccount?.logo;
    const readableTargetAddress = hexToNativeString(targetAddressHex, targetChain) || "";

    return useMemo(
        () => ({
            targetChain,
            targetAsset,
            tokenName,
            symbol,
            logo,
            readableTargetAddress,
        }),

        [targetChain, targetAsset, tokenName, symbol, logo, readableTargetAddress]
    );
};



function Target() {
    const {
        targetChain,
        targetAsset,
        tokenName,
        symbol,
        logo,
        readableTargetAddress,
    } = useTargetInfo();
    const { amount, setTargetChain, targetAddressHex, incrementStep, setActiveStep }: any = useWormholeContext()
    const [isTargetComplete, setIsTargetComplete] = useState(false)
    const [shouldLockFields, setShouldLockFields] = useState(false)
    const uiAmountString = ""  //targetParsedTokenAccount.uiAmount.toFixed(4);
    const transferAmount = amount;
    const { statusMessage, isReady } = useIsWalletReady(targetChain);
    const isLoading = !statusMessage

    useSyncTargetAddress(!shouldLockFields);

    const handleNextClick = useCallback(() => {
        setActiveStep(2)
        incrementStep();
    }, []);

    useEffect(() => {
        if (readableTargetAddress) {
            setIsTargetComplete(true)
            setShouldLockFields(true)
        }
    }, [readableTargetAddress])


    return (
        <>
            {/* generate a new address and key */}
            <KeyAndBalance chainId={targetChain} />

            {readableTargetAddress && (
                <>
                    {targetAsset && (
                        <Box
                            w="100%"
                            fontSize={"sm"}
                            bg="#4e4fe4"
                            borderRadius={"5px"}
                            py={4}
                            px={3}

                        >

                            A generated one-time account   <span style={{
                                color: "yellow"
                            }}>
                                <SmartAddress
                                    chainId={targetChain}
                                    address={readableTargetAddress}
                                    variant="h6"
                                />   &nbsp;    {`(Current balance: ${uiAmountString || "0"})`}
                            </span>
                            &nbsp;      would receive an equivalent

                            <span style={{
                                color: "yellow"
                            }}
                            >
                                <SmartAddress
                                    chainId={targetChain}
                                    address={targetAsset}
                                    symbol={symbol}
                                    tokenName={tokenName}
                                    logo={logo}
                                    isAsset
                                />
                            </span> from the bridge for  seller to redeem

                        </Box>
                    )}
                </>
            )}

            <Box w="100%" pt={12}>
                <Button
                    w="100%"
                    bg="#0e1320"
                    color="white"
                    _hover={{
                        bg: "#0e1320",
                        color: "white"
                    }}
                    _active={{
                        bg: "#0e1320",
                        color: "white"
                    }}
                    _focus={{
                        bg: "#0e1320",
                        color: "white"
                    }}
                    // isDisabled={!isTargetComplete}
                    onClick={handleNextClick}
                    isLoading={false}
                >
                    Next
                </Button>

            </Box>

        </>
    );
}

export default Target;
