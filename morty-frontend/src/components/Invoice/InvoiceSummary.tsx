import { evmTargetAsset } from "@/Wormhole/target/targetAsset"
import { useTransaction } from "@/contexts/TransactionContext"
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext"
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext"
import { InvoiceItem } from "@/hooks/useInvoiceDetails"
import { calculateKeccak256 } from "@/utils/helpers"
import { Box, VStack, Text, HStack, Stack, Button, Checkbox, Heading, Link } from "@chakra-ui/react"
import Lottie from "lottie-react";
// import galaxyAnimation from "../components/Animations/success.lottie";
import { useWallet } from "@txnlab/use-wallet"
import algosdk from "algosdk"
import { useEffect, useState } from "react"
import { FaCheckCircle, FaCircle } from "react-icons/fa"

interface InvoiceSummaryType {
    organization: string,
    invoiceTotal: number,
    contactEmail: string,
    customerName: string,
    customerEmail: string,
    invoiceTitle: string,
    invoiceToken: string,
    invoiceItems: any,
    acceptWrapped: boolean,
    record: string
}






export const InvoiceSummary = (
    {
        organization,
        invoiceTotal,
        contactEmail,
        customerName,
        customerEmail,
        invoiceTitle,
        invoiceToken,
        invoiceItems,
        acceptWrapped,
        record,

    }
        : InvoiceSummaryType

) => {


    const { organizations, selectedProvider, web3AuthAccount, signMessage }: any = useWeb3AuthProvider()
    const { activeAddress } = useWallet()
    const { typedClient, setRecord, CreateInvoice, isSubmittingInvoice, setIsSubmittingInvoice, reset,
        setActiveStep
    } = useTransaction()
    const [IRef, setIRef] = useState<string | null>(null)



    const org = organizations ? organizations : []

    const details = [
        {
            title: "Your company details",
            values: [org && organization && org.length > 0 ?
                org.filter((x: any) => x.oid === organization)[0].name : "", contactEmail]
        },
        {
            title: "Customer information",
            values: [customerName, customerEmail]
        },
        {
            title: "Invoice title",
            values: [invoiceTitle]
        },
        {
            title: "Invoice token",
            values: [invoiceToken]
        },

        {
            title: "Record Reference",
            values: [IRef]
        },
    ]


    const [disableWrapped, setDisableWrapped] = useState(acceptWrapped)

    const [success, setSuccess] = useState(false)

    const getReference = async (organization: string) => {
        if (!typedClient) {
            return
        }
        console.log("this is the org used - make sure it's the id", organization)
        console.log(`Calling current Subscription`)

        const ref = activeAddress;
        if (!ref) {
            return
        }
        const res = await typedClient.appClient.getBoxValue(algosdk.decodeAddress(ref).publicKey);
        const decoder = new algosdk.ABITupleType([
            new algosdk.ABIUintType(64),
            new algosdk.ABIUintType(64),
        ]);
        const result: any = decoder.decode(res)
        const resultSum = result.map((x: bigint) => Number(x));
        const period: number = resultSum.reduce(
            (acc: number, num: number) => acc + num,
            0
        );
        const reference = calculateKeccak256(organization + period.toString());
        console.log(organization)
        console.log(period)
        console.log("ref", reference),
            setIRef(reference)
        // setFetchingRef(false)

    }

    useEffect(() => {
        if (!IRef) {
            getReference(organization)
        }

    });


    const handleSubmit = async () => {
        if (!IRef || !activeAddress) {
            return
        }
        setRecord(IRef)

        const metadata = {
            organization,
            invoiceTotal,
            contactEmail,
            customerName,
            customerEmail,
            invoiceTitle,
            invoiceToken,
            invoiceItems,
            acceptWrapped,
            record: IRef,
            signer: activeAddress
        }

        const result = await CreateInvoice(metadata)
        if (result) {
            console.log("returned from clientside", result)

            const offlineInvoices: any = localStorage.getItem("morty-ivc");

            if (offlineInvoices) {
                localStorage.setItem("morty-ivc", JSON.stringify([...JSON.parse(offlineInvoices), ...result]))
            } else {
                localStorage.setItem("morty-ivc", JSON.stringify(result))
            }
            setSuccess(true)
            setActiveStep(4)
        }

    }

    const handleCopyLink = () => {

    }

    useEffect(() => {
        console.log(success)
    }, [success])




    return (

        <Box
            pb={32}
        >
            {!success && (
                <>

                    <Stack
                        justifyContent={'space-between'}
                        direction={["column", "column", 'column', 'row']}
                        w="100%"
                        pt={5}
                        spacing={[0, 0, 0, 10]}

                    >

                        <VStack w='100%'>
                            <Box>
                                <Text
                                    fontSize={"lg"}
                                    textAlign={"left"}>Invoice details</Text>
                            </Box>

                            {details && (
                                details.map((section, index: number) => (
                                    <Box
                                        key={index}
                                        py={4}
                                        w="100%"
                                        borderTop={"0.5px solid gray"}
                                    >
                                        <HStack
                                            fontSize={"sm"}
                                            alignItems={"flex-start"}
                                            justifyContent={"space-between"}>
                                            <Box
                                                color="#a6a6ee"
                                            >
                                                {section.title}
                                            </Box>
                                            <VStack
                                                w="50%"
                                                justifyContent={'flex-start'}
                                                alignItems={"left"}>
                                                {
                                                    section.values.map((value, i) => (
                                                        <Box w="100%" key={i}>
                                                            <Text>{value}</Text>
                                                        </Box>
                                                    ))
                                                }

                                                {index === 3 && (
                                                    <Box bg="blackAlpha.200"
                                                        py={1}
                                                        px={3}
                                                    >
                                                        {!acceptWrapped && (
                                                            <Box
                                                                fontSize={'xs'}
                                                                fontStyle={"italic"}
                                                                textAlign={"center"}
                                                                pb={1}
                                                            > No Dispenser found in Record
                                                            </Box>
                                                        )}
                                                        <HStack
                                                            pb={4}
                                                            py={2}
                                                            alignItems={"center"}
                                                            fontSize={"xs"}
                                                        >
                                                            <Checkbox

                                                                isDisabled={!acceptWrapped}
                                                                isChecked={disableWrapped}
                                                                fontSize={"xs"}
                                                                onChange={() => setDisableWrapped(!disableWrapped)}
                                                            />
                                                            <Box
                                                                color={!acceptWrapped ? "gray.500" : "gray.100"}
                                                            >

                                                                <Box
                                                                    pr={1}
                                                                    fontWeight={"semibold"}
                                                                    as='span'>
                                                                    Accept Wrapped {invoiceToken.split("(")[0].trim()}
                                                                </Box>
                                                                (allow evm/non-algo users to pay). <br />

                                                                This may cost additional charges.
                                                            </Box>
                                                        </HStack>


                                                    </Box>
                                                )}

                                            </VStack>


                                        </HStack>
                                    </Box>
                                ))
                            )}

                        </VStack>


                        <VStack w="100%">
                            <Box
                                w="100%"
                                border={"0.5px solid gray"}
                                borderRadius={"5px"}
                                px={8}
                                py={8}
                            >
                                <Box pb={3}>
                                    <Text textAlign={"left"}>Description</Text>
                                </Box>

                                {invoiceItems && invoiceItems.map((item: InvoiceItem, index: number) => (
                                    <Box
                                        key={index}
                                        py={4}
                                        w="100%"
                                        color="#a6a6ee"
                                        borderTop={"0.5px solid gray"}
                                    >
                                        <HStack
                                            fontSize={"xs"}
                                            alignItems={"flex-start"}
                                            justifyContent={"space-between"}>
                                            <Box >
                                                {item.description}
                                            </Box>

                                            <Box>
                                                {item.unitPrice + " x" + " " + item.quantity}
                                            </Box>
                                        </HStack>

                                    </Box>

                                ))}

                                <Box
                                    py={4}
                                    w="100%"
                                    borderTop={"0.5px solid gray"}
                                >
                                    <HStack
                                        fontSize={"xs"}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}>

                                        <Box
                                            color="#a6a6ee"
                                            fontWeight={"bold"}
                                        >
                                            Subtotal
                                        </Box>

                                        <Box
                                            fontWeight={"bold"}
                                            fontSize={'sm'}
                                            color="#a6a6ee"
                                        >
                                            {invoiceTotal}
                                        </Box>
                                    </HStack>

                                </Box>


                                <Box
                                    py={4}
                                    w="100%"
                                    borderTop={"0.5px solid gray"}
                                >
                                    <HStack
                                        fontSize={"sm"}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}>

                                        <Box
                                            fontWeight={"bold"}
                                        >
                                            Total
                                        </Box>

                                        <Box
                                            fontWeight={"bold"}
                                            fontSize={'md'}
                                        >
                                            {invoiceTotal}
                                        </Box>
                                    </HStack>

                                </Box>


                            </Box>
                        </VStack>

                    </Stack>

                    <Box
                        w="100%"
                        py={12}>
                        <Button
                            isLoading={isSubmittingInvoice}
                            isDisabled={!IRef}
                            w="100%"
                            h="50px"
                            colorScheme="green" onClick={handleSubmit}>
                            Create Invoice
                        </Button>
                    </Box>


                </>
            )}


        </Box>
    )
}

