
import { CHAINS_BY_ID } from "@/utils/wormhole/consts";
import { useTargetInfo } from "./Target";
import { SmartAddress } from "@/Wormhole/core";
import { ChainId } from "@certusone/wormhole-sdk";
import { Box, Flex, Text, HStack, Alert } from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";


export default function TargetPreview() {

    const {
        targetChain,
        readableTargetAddress,
        targetAsset,
        symbol,
        tokenName,
        logo,
    } = useTargetInfo();




    const explainerContent =
        targetChain && readableTargetAddress ? (
            <Box>


                <Alert
                    borderRadius={"5px"}
                    color={"#152036"}
                    px={3}
                    py={4}
                >

                    <HStack
                        px={3}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                        textAlign={"left"}
                        fontSize={"sm"}
                        w="100%">

                        <Box
                            p={4}
                            bg="#62c94a"
                            rounded={"full"}
                        >
                            <FaPlus />
                        </Box>

                        <Box
                            pl={4}
                        >
                            Seller is expecting
                            <SmartAddress
                                chainId={targetChain}
                                address={targetAsset}
                                symbol={symbol}
                                tokenName={tokenName}
                                logo={logo}
                                isAsset
                            />
                            from Algorand account
                            <SmartAddress chainId={targetChain} address={readableTargetAddress} />

                        </Box>



                    </HStack>

                </Alert>

            </Box>
        ) : (
            ""
        );

    return (
        <Box w="100%">
            {explainerContent}
        </Box>
    );
}
