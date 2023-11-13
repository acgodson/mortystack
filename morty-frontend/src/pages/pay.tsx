import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Input, Button, Text, Center, IconButton, VStack, Spinner, Divider, HStack, Tooltip, Alert } from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle, FaInfo } from "react-icons/fa";
import algosdk, { Algodv2 } from "algosdk";
import { useWallet } from "@txnlab/use-wallet";
import TransferBridge from "@/Wormhole";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { BridgeSteps } from "@/components/Pay/Steps";
import { MdArrowBack, MdLinkOff } from "react-icons/md";
import { ConnectType, useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { CHAIN_ID_ALGORAND } from "@certusone/wormhole-sdk";
import { ALGORAND_HOST, } from "@/utils/wormhole/consts";
import { AlgoTokenPicker, KeyAndBalance, SmartAddress } from "@/Wormhole/core";
import { extractToken } from "@/utils/helpers";
import { createParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { formatUnits } from "@ethersproject/units";
import SendConfirmationDialog from "@/Wormhole/send/SendConfirmationDialog";



const algodClient = new Algodv2(
    ALGORAND_HOST.algodToken,
    ALGORAND_HOST.algodServer,
    ALGORAND_HOST.algodPort
);


const PaymentPage: React.FC = () => {
    const router = useRouter();
    const { ref } = router.query;
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { providers, activeAddress } = useWallet()
    const [source, setSource] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState(0)
    const { activeStep, originChain }: any = useWormholeContext()
    const { availableConnections, signerAddress, provider, connect } = useEthereumProvider();
    const [amount, setAmount] = useState('')
    const [token, setToken] = useState('')
    const [parsedToken, setParsedToken] = useState<any | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);


    const handleClick = () => {

    }




    const handleTransferClick = useCallback(() => {
        setIsConfirmOpen(true);
    }, []);
    const handleConfirmClick = useCallback(() => {
        handleClick();
        setIsConfirmOpen(false);

    }, [handleClick]);
    const handleConfirmClose = useCallback(() => {
        setIsConfirmOpen(false);
    }, []);





    async function prepareToken() {
        console.log("mannn")
        if (!amount || !activeAddress || !token) {
            return
        }
        const assetID = extractToken(token)
        const assetInfo = await algodClient.getAssetByID(Number(assetID)).do();
        const metadata = {
            tokenName: assetInfo.params.name,
            symbol: assetInfo.params["unit-name"],
            decimals: assetInfo.params.decimals,
        };


        const tk = createParsedTokenAccount(
            activeAddress,
            assetID!,
            amount,
            metadata.decimals,
            parseFloat(formatUnits(amount, metadata.decimals)),
            formatUnits(amount, metadata.decimals).toString(),
            metadata.symbol,
            metadata.tokenName,
            undefined,
            false
        );
        console.log("I'm going with this now", tk)
        setParsedToken(tk)
        return tk


    }


    async function fetchInvoice() {
        setLoading(true)
        console.log(ref)
        if (ref && ref.length > 5) {

            try {
                let headersList = {
                    "Accept": "*/*",
                    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                    "Content-Type": "application/json"
                }

                let bodyContent = JSON.stringify({
                    "ref": ref
                });

                let response = await fetch("http://localhost:3000/api/fetch-invoice", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                });

                let data: any = await response.json();
                console.log(data);

                setStatus(data.success.toString())

                if (data.success) {
                    setAmount(data.invoice.metadata.invoiceTotal)
                    setToken(data.invoice.metadata.invoiceToken)
                }
                if (!data.success) {
                    console.log("expireeeeed")
                }
                setLoading(false)



            } catch (e) {
                console.error(e)
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (ref && ref.length > 0) {
            fetchInvoice()
        } else {
            setStatus(null);
        }
    }, [ref]);


    useEffect(() => {
        if (amount && activeAddress && token && !parsedToken) {
            prepareToken()

        }
    }, [amount, activeAddress, token, parsedToken])





    useEffect(() => {
        console.log(source)
    }, [source])

    const copyReference = () => {
    };


    const renderStatusContent = () => {
        console.log(status)
        switch (status) {
            case "not-found":
                return (
                    <VStack align={"center"}>
                        <FaExclamationCircle size={48} color="red" />
                        <Text mt="4" fontWeight="bold">
                            Invalid URL
                        </Text>
                    </VStack>
                );
            case "false":
                return (
                    <VStack align={"center"}>
                        <FaExclamationCircle size={48} color="orange" />
                        <Text mt="4" fontWeight="bold">
                            Not Found. Invalid or Expired URL
                        </Text>
                    </VStack>
                );
            case "true":
                return (
                    <VStack align={"center"}>
                        <FaCheckCircle size={48} color="green" />
                        <Text mt="4" fontWeight="bold">
                            Transaction found
                        </Text>
                        <Button mt="4" colorScheme="teal" onClick={() => copyReference()}>
                            Copy Reference
                        </Button>
                    </VStack>
                );
            default:
                return null;
        }
    };


    const is0x = activeAddress && activeAddress.startsWith("0x") ? true : false;

    return (
        <Box>
            <Center h="100vh">
                <VStack
                    w="100%"
                    alignItems="center">
                    <Box>
                        <Box
                            position="absolute"
                            marginTop="16px"
                            h="50px"
                            w="50px"
                            bg="red"
                            rounded="full"
                        />
                    </Box>

                    <Box
                        display={pageIndex === 0 ? "none" : "block"}
                        left={32}
                        top={18}
                        position={"absolute"}>
                        <HStack
                            pb={"20px"}
                            as="button"
                            onClick={() => setPageIndex(0)}
                        >
                            <MdArrowBack />
                            <Text>            Back to Payment Option</Text>
                        </HStack>

                    </Box>

                    <Box
                        px={24}
                        h="fit-content"
                        flexDirection="column"
                        display="flex"
                        justifyContent="space-around"
                        bg={"rgba(21, 34, 57, 0.8)"}
                        py={8}
                        borderWidth="0.9px"
                        borderColor="#253350"
                        borderRadius="lg"
                        shadow="md"
                        maxW={["md", "md", "xl"]}
                        w="100%"
                        sx={{
                            backdropFilter: "blur(15px)",
                        }}
                    >
                        {!status && <Spinner />}
                        {status !== "true" ? (
                            renderStatusContent()
                        ) : (
                            <>
                                {!loading && (
                                    <>
                                        {pageIndex === 0 && (
                                            <>
                                                <Text
                                                    color="whiteAlpha.800"
                                                    textAlign="center"
                                                    letterSpacing="2px"
                                                    fontSize={["md", "md", "2xl"]}
                                                    fontWeight="semibold"
                                                    mb="4"
                                                >
                                                    Connect your Wallet
                                                </Text>
                                                <VStack mt={5} w="100%" spacing={5}>
                                                    {providers?.map((provider, index) => (
                                                        <Button
                                                            w="100%"
                                                            h="50px"
                                                            bg={index === 0 ? "black" : "#ffee55"}
                                                            color={index === 0 ? "white" : "black"}
                                                            px={5}
                                                            leftIcon={
                                                                <Box
                                                                    width={30}
                                                                    height={30}
                                                                    alt={`${provider.metadata.name} icon`}
                                                                    src={provider.metadata.icon}
                                                                    as="img"
                                                                />
                                                            }
                                                            key={provider.metadata.id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!activeAddress) {
                                                                    provider.connect();
                                                                }

                                                                setSource(0);
                                                                setPageIndex(1)
                                                            }}
                                                            disabled={provider.isConnected}
                                                        >
                                                            Connect {provider.metadata.name}
                                                        </Button>
                                                    ))}
                                                </VStack>
                                                <Divider py={3} />
                                                <HStack
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Box mx={3} w="13%" bg="#a8a9ee" h="0.3px" />
                                                    <Text
                                                        py={5}
                                                        fontStyle="italic"
                                                        textAlign="center"
                                                        fontSize="xs"
                                                    >
                                                        More Options
                                                    </Text>
                                                    <Box mx={3} w="13%" bg="#a8a9ee" h="0.3px" />
                                                </HStack>
                                                <Button
                                                    bg="#25272a"
                                                    w="100%"
                                                    h="50px"
                                                    color="white"
                                                    leftIcon={
                                                        <Box
                                                            w="100%"
                                                            as="img"
                                                            src="/icons/metamask-fox.svg"
                                                            h="40px"
                                                        />
                                                    }
                                                    pl={5}
                                                    fontSize={["md", "md", "xl"]}
                                                    onClick={() => {
                                                        if (!signerAddress) {
                                                            connect(ConnectType.METAMASK)
                                                        }
                                                        setSource(1);
                                                        setPageIndex(2)
                                                    }}

                                                >
                                                    Metamask
                                                </Button>
                                            </>
                                        )}
                                        {(pageIndex === 1 || pageIndex === 2) && (
                                            <>
                                                {pageIndex === 2 ?

                                                    <TransferBridge /> :

                                                    <>
                                                        <Box w="100%">
                                                            {/* {parsedToken && ( */}
                                                            <Alert
                                                                borderRadius={"5px"}
                                                                color={"#152036"}
                                                                px={3}
                                                                py={4}
                                                                fontSize={activeStep < 2 ? "md" : "md"}
                                                                w="100%"
                                                            >
                                                                <HStack
                                                                    justifyContent={"space-between"}
                                                                    alignItems={"flex-start"}
                                                                >

                                                                    <Box
                                                                        p={4}
                                                                        bg="#4e4fe4"
                                                                        rounded={"full"}
                                                                    >
                                                                        <FaInfo
                                                                            color="white" />
                                                                    </Box>

                                                                    <Text
                                                                        color="#4e4fe4"
                                                                        fontWeight={"semibold"}
                                                                    >You're paying out  {amount}
                                                                        <SmartAddress
                                                                            chainId={CHAIN_ID_ALGORAND}
                                                                            parsedTokenAccount={parsedToken}
                                                                            isAsset
                                                                        />   for seller to redeem

                                                                    </Text>
                                                                </HStack>
                                                            </Alert>
                                                            {/* )} */}


                                                            {activeAddress && <AlgoTokenPicker
                                                                value={parsedToken || null}
                                                                disabled={true}
                                                                wallet={activeAddress}
                                                                onChange={() => {

                                                                }}
                                                            />}

                                                            <KeyAndBalance chainId={CHAIN_ID_ALGORAND} />
                                                            <Box py={5} w="100%">

                                                                {activeAddress ?
                                                                    <Tooltip w="100%" title={activeAddress}>
                                                                        <Button
                                                                            w="100%"
                                                                            h="50px"
                                                                            color="gray"
                                                                            bg="blackAlpha.700"
                                                                            _hover={{
                                                                                bg: "blackAlpha.700",
                                                                                color: "gray"
                                                                            }}
                                                                            _active={{
                                                                                bg: "blackAlpha.700",
                                                                                color: "gray"
                                                                            }}
                                                                            _focus={{
                                                                                bg: "blackAlpha.700",
                                                                                color: "gray"
                                                                            }}
                                                                            // variant="outlined"
                                                                            size="small"
                                                                            onClick={
                                                                                () => providers![1].disconnect()
                                                                            }
                                                                            leftIcon={<MdLinkOff />}
                                                                        >
                                                                            Disconnect {activeAddress.substring(0, is0x ? 6 : 3)}...
                                                                            {activeAddress.substr(activeAddress.length - (is0x ? 4 : 3))}
                                                                        </Button>
                                                                    </Tooltip>
                                                                    :
                                                                    <HStack w="100%" spacing={10}>
                                                                        {providers?.map((provider, index) => (

                                                                            <Button
                                                                                h="45px"
                                                                                fontSize={"sm"}
                                                                                w="fit-content"
                                                                                bg={index === 0 ? "black" : "#ffee55"}
                                                                                color={index === 0 ? "white" : "black"}
                                                                                px={5}
                                                                                leftIcon={<Box
                                                                                    width={25}
                                                                                    height={25}
                                                                                    alt={`${provider.metadata.name} icon`}
                                                                                    src={provider.metadata.icon}
                                                                                    as="img" />}
                                                                                key={provider.metadata.id}
                                                                                type="button" onClick={provider.connect} disabled={provider.isConnected}>
                                                                                Connect {provider.metadata.name}
                                                                            </Button>
                                                                        ))}

                                                                    </HStack>
                                                                }


                                                                <Box w="100%" pt={8}>
                                                                    <Button
                                                                        h="45px"
                                                                        w="100%"
                                                                        isDisabled={!activeAddress}
                                                                    // onClick={handleTransferClick}

                                                                    >
                                                                        Transfer
                                                                    </Button>
                                                                    <SendConfirmationDialog
                                                                        open={isConfirmOpen}
                                                                        onClick={handleConfirmClick}
                                                                        onClose={handleConfirmClose}
                                                                    />
                                                                </Box>




                                                            </Box>



                                                        </Box>

                                                    </>
                                                }

                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Box>

                    {pageIndex !== 0 && pageIndex !== 1 && <BridgeSteps active={activeStep} />}


                    <HStack
                        opacity="0.9"
                        pt={4}
                        justifyContent="center"
                        w="100%"
                        spacing={3}
                        color="white"
                        alignItems="center"
                    >
                        <Text fontSize="11.5px">Verified by</Text>
                        <Box
                            h="17px"
                            w="auto"
                            as="img"
                            alt="morty inc"
                            src="/verifiedmorty.png"
                        />
                    </HStack>
                </VStack>
            </Center>
        </Box >
    );

};

export default PaymentPage;
