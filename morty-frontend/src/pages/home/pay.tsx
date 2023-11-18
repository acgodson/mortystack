import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Input, Button, Text, Center, VStack, Divider, HStack, Tooltip, Alert, Flex, useToast } from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle, FaInfo } from "react-icons/fa";
import algosdk, { Algodv2 } from "algosdk";
import { useWallet } from "@txnlab/use-wallet";
import TransferBridge from "@/Wormhole";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { BridgeSteps } from "@/components/Pay/Steps";
import { MdArrowBack, MdDirectionsBoatFilled, MdLinkOff } from "react-icons/md";
import { ConnectType, useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { CHAIN_ID_ALGORAND, hexToUint8Array } from "@certusone/wormhole-sdk";
import { ALGORAND_HOST, } from "@/utils/wormhole/consts";
import { AlgoTokenPicker, KeyAndBalance, SmartAddress } from "@/Wormhole/core";
import { algosToMicroAlgos, calculateKeccak256, extractToken, getEquivalentAmount } from "@/utils/helpers";
import { createParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { formatUnits } from "@ethersproject/units";
import SendConfirmationDialog from "@/Wormhole/send/SendConfirmationDialog";
import AnimatedSpinner from "@/components/Animations/AnimatedSpinner";
import { truncate } from "fs/promises";
import { Invoice } from "@/utils/types";
import { PaymentTxnType, useTransaction } from "@/contexts/TransactionContext";
import { MortyClient } from "@/tsContracts/MortyClient";



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
    const { providers, activeAddress, signer } = useWallet()
    const [source, setSource] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState(0)
    const { activeStep, originChain }: any = useWormholeContext()
    const { signerAddress, provider, connect } = useEthereumProvider();
    const [tokenAmount, setTokenAmount] = useState('')
    const [amount, setAmount] = useState('')
    const [token, setToken] = useState('')
    const [parsedToken, setParsedToken] = useState<any | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [balanceConfirmed, setBalanceConfirmed] = useState<boolean | null>(null);
    const [isValidating, setIsValidating] = useState<boolean>(true)
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [isPaying, setIsPaying] = useState<boolean>(false);
    const [appID, setAppID] = useState<number>(479526612)
    const [success, setSuccess] = useState(false)
    const sender = { signer, addr: activeAddress! }
    const toast = useToast()
    const typedClient = new MortyClient(
        {
            sender: sender,
            resolveBy: 'id',
            id: appID,
        },
        algodClient
    );


    //make a payment to a record
    const SubmitPayment = async ({ token, amount, description, sellersSigner, organizationID, from, reference }: PaymentTxnType) => {
        setIsPaying(true)
        if (!activeAddress) {
            return
        }

        console.log(reference);
        console.log(organizationID);

        const result = await typedClient.appClient.getBoxValue(algosdk.decodeAddress(sellersSigner).publicKey);
        if (result) {
            const decoder = new algosdk.ABITupleType([
                new algosdk.ABIUintType(64),
                new algosdk.ABIUintType(64),
            ]);
            const value: any = decoder.decode(result)
            console.log(value);
            const resultSum = value.map((x: bigint) => Number(x));
            const period: number = resultSum.reduce(
                (acc: number, num: number) => acc + num,
                0
            );
            console.log(period)

            const rr = calculateKeccak256(organizationID + period.toString());
            console.log(rr)

            const atc = new algosdk.AtomicTransactionComposer();
            const suggestedParams = await algodClient.getTransactionParams().do();
            const encoder = new TextEncoder;

            try {
                const txIndex = (
                    await typedClient.getGlobalState()
                ).TxnIDx?.asNumber().valueOf();

                const depositTxn =
                    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                        from: activeAddress,
                        suggestedParams: await algodClient.getTransactionParams().do(),
                        to: (await typedClient.appClient.getAppReference()).appAddress,
                        amount: 200_000,
                    });

                atc.addTransaction({
                    txn: depositTxn,
                    signer,
                });


                atc.addMethodCall({
                    method: typedClient.appClient.getABIMethod("makePayment")!,
                    methodArgs: [
                        BigInt(token),
                        amount,
                        encoder.encode(description),
                        algosdk.decodeAddress(sellersSigner).publicKey,
                        encoder.encode(organizationID),
                        from,
                        sellersSigner
                    ],
                    suggestedParams: suggestedParams,
                    sender: activeAddress,
                    boxes: [
                        {
                            appIndex: appID,
                            name: algosdk.encodeUint64(txIndex!),
                        },
                        {
                            appIndex: appID,
                            name: algosdk.decodeAddress(activeAddress).publicKey
                        },
                        {
                            appIndex: appID,
                            name: hexToUint8Array(reference)
                        },
                    ],
                    appID,
                    signer,
                });


                const assetTxn =
                    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        from: activeAddress,
                        suggestedParams: await algodClient.getTransactionParams().do(),
                        to: (await typedClient.appClient.getAppReference()).appAddress,
                        amount: algosToMicroAlgos(amount),
                        assetIndex: token,
                    });

                atc.addTransaction({
                    txn: assetTxn,
                    signer,
                });

                const result = await atc.execute(algodClient, 4)
                console.log(result)

                setSuccess(true)

                //update invoice status on firestore post hackathon so that the invoice can be reusable
                setIsPaying(false)

            } catch (e: any) {
                console.log(e)
                toast({
                    status: "error",
                    description: e.toString(),
                    position: "top"
                })
                setIsPaying(false)
            }
        }

    }


    const handleConfirmClick = async () => {

        console.log(parsedToken.mintKey)

        SubmitPayment(
            {
                token: parseInt(parsedToken.mintKey),
                amount: parseInt(amount),
                description: invoice?.id!,
                sellersSigner: invoice?.metadata.signer!,
                organizationID: invoice?.metadata.organization!,
                from: activeAddress!,
                reference: invoice?.metadata.record!
            }
        );
        // setIsConfirmOpen(false);
    };
    const handleConfirmClose = useCallback(() => {
        setIsConfirmOpen(false);
    }, []);

    async function prepareToken() {
        if (!tokenAmount || !activeAddress || !token) {
            return
        }
        const asset_ID = extractToken(token)


        const accountInfo = await algodClient
            .accountInformation(activeAddress)
            .do();

        let ParsedOriginAccounts = [];

        const assetInfo = await algodClient.getAssetByID(Number(asset_ID)).do();
        const metadata = {
            tokenName: assetInfo.params.name,
            symbol: assetInfo.params["unit-name"],
            decimals: assetInfo.params.decimals,
        };
        for (const asset of accountInfo.assets) {
            console.log(asset)
            const assetId = asset["asset-id"];
            console.log(assetId)
            console.log(asset_ID)
            if (assetId.toString() === asset_ID?.toString()) {
                const assetId = asset["asset-id"];
                console.log(assetId)
                console.log(asset_ID)
                const amount = asset.amount;
                const parsedAccount = createParsedTokenAccount(
                    activeAddress,
                    assetId.toString(),
                    amount,
                    metadata.decimals,
                    parseFloat(formatUnits(amount, metadata.decimals)),
                    formatUnits(amount, metadata.decimals).toString(),
                    metadata.symbol,
                    metadata.tokenName,
                    undefined,
                    false
                );
                console.log(parsedAccount)
                ParsedOriginAccounts.push(parsedAccount)

            } else {
                toast({
                    status: "error",
                    description: `You don't have asset ${token} in your current account. Please connect another wallet with asset and sufficent balance`,
                    position: "bottom",
                    duration: 2000000,
                    isClosable: true
                })
            }
        }
        setParsedToken(ParsedOriginAccounts[0])
    }

    async function fetchInvoice() {
        setLoading(true)
        console.log(ref)
        if (ref && ref.length > 5) {

            try {
                let headersList = {
                    "Content-Type": "application/json"
                }
                let bodyContent = JSON.stringify({
                    "ref": ref
                });

                let response = await fetch("api/fetch-invoice", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                });

                let data: any = await response.json();
                console.log(data);

                setStatus(data.success.toString())

                if (data.success) {
                    setTokenAmount(data.invoice.metadata.invoiceTotal)
                    setToken(data.invoice.metadata.invoiceToken)
                    setInvoice(data.invoice)

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
        if (tokenAmount && activeAddress && token && !parsedToken) {
            prepareToken()
        }
    }, [tokenAmount, activeAddress, token, parsedToken])



    async function getPrice() {
        console.log("pay parsed token", parsedToken)
        if (!parsedToken) {
            return
        }
        console.log("parsed Token", parsedToken)
        let headersList = {
            "Content-Type": "application/json"
        }
        let bodyContent = JSON.stringify({
            "symbol": parsedToken.symbol === "WMATIC" ? "MATIC" : parsedToken.symbol === "WETH" ? "ETH"
                : parsedToken.symbol === "WALGO" ? "ALGO" : parsedToken.symbol
        });
        let response = await fetch("api/fetch-price", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });
        let data = await response.json();
        if (data.usdPrice) {
            const equiv = getEquivalentAmount(data.usdPrice, parseInt(tokenAmount), 2)
            const sufficient = parsedToken.uiAmount >= equiv;
            // alert(amount)
            setAmount(equiv.toString())
            console.log(equiv.toString())
            console.log(sufficient)
            setBalanceConfirmed(sufficient)
            setIsValidating(false)
        }

    }

    useEffect(() => {
        if (balanceConfirmed === null && pageIndex === 1 && parsedToken && tokenAmount && isValidating && !amount) {
            console.log("checFh")
            const { uiAmount } = parsedToken
            if (uiAmount) {
                getPrice()
            }
        }
    },)


    useEffect(() => {
        if (parsedToken) {
            console.log("parsed token at pay page", parsedToken)
        }
    }, [parsedToken])


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
                        <Text
                            color="#81e6d9"
                            mt="4" fontWeight="bold">
                            Transaction Successful
                        </Text>
                        <Text

                            textAlign={"center"}
                            fontSize={"sm"} >You an Claim Receipt After Seller has Retrieved Payment </Text>

                        <Button
                            isDisabled={true}
                            mt="4" colorScheme="teal" onClick={() => copyReference()}>
                            Claim Receipt
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


                    {!success && (
                        <>

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
                                {!status &&
                                    <Center>
                                        <AnimatedSpinner />
                                    </Center>
                                }
                                {status !== "true" ? (
                                    renderStatusContent()
                                ) : (
                                    <>
                                        {!loading && (
                                            <>

                                                {/* Payment OPTION page */}
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
                                                            // isLoading={isValidating}
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

                                                            <>
                                                                {invoice && (
                                                                    //EvM to Algo Payment
                                                                    <TransferBridge
                                                                        tokenAmount={tokenAmount}
                                                                        amount={amount}
                                                                        invoice={invoice}

                                                                    />
                                                                )}
                                                            </>


                                                            :

                                                            // Algo to Algo Payment
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
                                                                        <VStack py={4} lineHeight={"15px"} w="100%">
                                                                            <HStack
                                                                                justifyContent={"center"}
                                                                                alignItems={"center"}
                                                                                w="100%"
                                                                            >
                                                                                <Text
                                                                                    fontSize={["xl", "xl", "xl", "3xl"]}
                                                                                    textAlign={"center"}
                                                                                    color="white"
                                                                                    fontWeight={"semibold"}
                                                                                > {amount}
                                                                                </Text>

                                                                                <Box pl={1} color="white">
                                                                                    <SmartAddress
                                                                                        chainId={CHAIN_ID_ALGORAND}
                                                                                        parsedTokenAccount={parsedToken}
                                                                                        isAsset
                                                                                    />

                                                                                </Box>
                                                                            </HStack>

                                                                            <Text
                                                                                color={"whiteAlpha.600"}
                                                                                fontWeight={"semibold"}>${tokenAmount}</Text>
                                                                        </VStack>
                                                                    </Alert>

                                                                    {activeAddress && <AlgoTokenPicker
                                                                        value={parsedToken || null}
                                                                        disabled={true}
                                                                        wallet={activeAddress}
                                                                        onChange={() => {

                                                                        }}
                                                                    />}

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
                                                                        {!isValidating && !balanceConfirmed && (
                                                                            <Box py={2}>
                                                                                <Text
                                                                                    textAlign={"center"}
                                                                                    fontSize={"xs"} color="red.200"

                                                                                >
                                                                                    Insufficient Balance
                                                                                    to cover payment and transaction fees

                                                                                </Text>
                                                                            </Box>
                                                                        )}

                                                                        <Box w="100%" pt={8}>
                                                                            <Button
                                                                                h="45px"
                                                                                w="100%"
                                                                                isLoading={isPaying}
                                                                                isDisabled={!activeAddress || !balanceConfirmed}
                                                                                onClick={handleConfirmClick}
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

                        </>
                    )}

                    {success && (
                        <VStack align={"center"}>
                            <FaCheckCircle size={48} color="green" />
                            <Text
                                color="#81e6d9"
                                mt="4" fontWeight="bold">
                                Transaction Successful
                            </Text>
                        </VStack>
                    )}


                    {!success && pageIndex !== 0 && pageIndex !== 1 && <BridgeSteps active={activeStep} />}




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
