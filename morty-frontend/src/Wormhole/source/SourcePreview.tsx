import { Alert, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { ChainId } from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { CHAINS_BY_ID } from "@/utils/wormhole/consts";
import { SmartAddress } from "@/Wormhole/core";
import { FaInfo, FaMinus } from "react-icons/fa";
import { AiOutlineMinusCircle } from 'react-icons/ai';


export default function SourcePreview() {
    const {
        sourceChain,
        sourceWalletAddress,
        amount,
        activeStep,
        sourceParsedTokenAccount,
    }: any = useWormholeContext();

    const sourceAmount = amount;

    const explainerContent =
        sourceChain && sourceParsedTokenAccount ? (

            <Alert
                borderRadius={"5px"}
                color="white"
                px={3}
                py={4}
            >
                <HStack
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    fontSize={activeStep < 2 ? "sm" : "sm"} w="100%">

                    <Box
                        p={4}
                        bg="#d93025"
                        rounded={"full"}
                    >

                        <FaMinus />
                    </Box>
                    <Text
                        pl={4}
                    >You're paying out  {sourceAmount}  <SmartAddress
                            chainId={sourceChain}
                            parsedTokenAccount={sourceParsedTokenAccount}
                            isAsset
                        />   from your {CHAINS_BY_ID[sourceChain as ChainId].name} account&nbsp;

                    </Text>

                </HStack></Alert>
        ) : (
            ""
        );

    return <Box w="100%">{explainerContent}</Box>;
}
