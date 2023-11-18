import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Text, Link, HStack, Center, Spinner, Alert } from "@chakra-ui/react";
import { CHAIN_ID_ALGORAND } from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import { CHAINS, CLUSTER, getIsTransferDisabled } from "@/utils/wormhole/consts";
import { ChainWarningMessage, ChainSelect, SelectedTokenMessage, TokenSelector, KeyAndBalance } from "@/Wormhole/core";
import { ethers } from "ethers";
import { ConnectType, useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { Algodv2 } from "algosdk";
import { getTokenEquivalent } from "@/utils/wormhole/algorand";
import { MdError } from "react-icons/md";





function Source(
    { tokenAmount, name, paymentMethod, verifying, paymentToken }: { tokenAmount: string, name: string | null, paymentMethod: string, verifying: boolean | null, paymentToken: string | null }
) {
    const { amount, activeStep, setAmount,
        setActiveStep,
        balanceConfirmed,
        setSourceChain,
        sourceChain,
        targetChain,
        sourceParsedTokenAccount,
        setOriginAsset

    }: any = useWormholeContext()

    const targetChainOptions = useMemo(
        () => CHAINS.filter((c: any) => c.id === CHAIN_ID_ALGORAND),
        [sourceChain]
    );

    const sourceChainOptions = useMemo(
        () => CHAINS.filter((c: any) => c.id !== CHAIN_ID_ALGORAND),
        [sourceChain]
    );
    const isSourceTransferDisabled = useMemo(() => {
        return getIsTransferDisabled(sourceChain, true);
    }, [sourceChain]);
    const isTargetTransferDisabled = useMemo(() => {
        return getIsTransferDisabled(targetChain, false);
    }, [targetChain]);
    const parsedTokenAccount = sourceParsedTokenAccount;
    const hasParsedTokenAccount = !!parsedTokenAccount;
    const [uiAmountString, setUiAmountString] = useState("")
    const { isReady, statusMessage } = useIsWalletReady(sourceChain);
    const { provider } = useEthereumProvider()


    const handleSourceChange = useCallback(
        (event: any) => {
            if (event)
                setSourceChain(event)
            // setOriginAsset(null)
            // setSourceChain(event.targe);
        },
        []
    );

    const handleAmountChange = useCallback(
        (event: any) => {
            setAmount(event.target.value / 2); //test Replace with actual bill

        },
        []
    );


    const handleNextClick = () => {
        setActiveStep(1)
    }



    //this is where we set the amount
    useEffect(() => {
        if (isReady && hasParsedTokenAccount) {
            const bal = Number(parsedTokenAccount.uiAmount).toFixed(4)
            setAmount(tokenAmount.toString())
        }

    }, [isReady, hasParsedTokenAccount])


    useEffect(() => {
        console.log(verifying)
    }, [verifying])


    return (
        <Box>
            <Text
                color={"whiteAlpha.400"}
                fontSize={"sm"}
                style={{ display: "flex", alignItems: "center" }}>

                Select Chain to send through the {CLUSTER.toUpperCase()} bridge.


            </Text>
            <br />
            <HStack
                style={{ marginBottom: "25px" }}
                justifyContent={"space-between"}
                alignItems={"center"}
                pb={2}
            >


                <Box  >
                    <Text pb={2} fontSize={'xs'} variant="caption">Paying from</Text>
                    <ChainSelect
                        select
                        variant="outlined"
                        w="full"
                        value={sourceChain}
                        onChange={handleSourceChange}
                        isDisabled={isReady || uiAmountString ? true : false}
                        chains={sourceChainOptions}
                    />
                </Box>

                <Box>
                    <Text fontSize={'xs'} pb={2} variant="caption">To {name || "seller"} </Text>
                    <ChainSelect
                        variant="outlined"
                        select
                        w="full"
                        value={targetChain}
                        isDisabled={true}
                        chains={targetChainOptions}
                    />
                </Box>

            </HStack>

            <KeyAndBalance chainId={sourceChain} />



            {verifying === true ?
                <Box>
                    <TokenSelector
                        disabled={true}
                        token={paymentToken!}
                    />
                </Box> : verifying === false ?

                    <Center>
                        <Alert
                            bg="blackAlpha.400"
                            status="error"
                            color='yellow'
                            fontSize={"sm"}>


                            <Text>Sorry, Wrapped Token does not exist on this {sourceChainOptions.filter((c: any) => c.id === sourceChain)[0].name}, please choose another chain or payment method</Text>
                        </Alert>

                    </Center> :
                    <Center pt={4}>
                        <Spinner />
                    </Center>

            }





            {isReady && hasParsedTokenAccount && (
                <SelectedTokenMessage
                    variant="outlined"
                    label="Amount"
                    w='100%'
                    token={sourceParsedTokenAccount.symbol}
                    amount={amount}
                    onChange={handleAmountChange}
                    isDisabled={true}
                />
            )}

            <ChainWarningMessage chainId={sourceChain} />


            <Box
                w="100%"
                pt={12}>

                <Button
                    w="100%"
                    bg='#0e1320'
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
                    isDisabled={
                        !isReady || !hasParsedTokenAccount || !balanceConfirmed ||
                            isSourceTransferDisabled ||
                            isTargetTransferDisabled ? true : false
                    }
                    onClick={handleNextClick}

                    isLoading={false}
                >
                    Next
                </Button>
            </Box>

        </Box>
    );
}

export default Source;
