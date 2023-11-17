//checkout page to preview an invoice


import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Input, Button, Text, Center, VStack, Spinner, HStack, Tooltip, Alert, Checkbox, Stack, Heading } from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle, } from "react-icons/fa";
import algosdk, { Algodv2 } from "algosdk";
import { ALGORAND_HOST, } from "@/utils/wormhole/consts";
import AnimatedSpinner from "@/components/Animations/AnimatedSpinner";
import { InvoiceItem } from "@/hooks/useInvoiceDetails";
import { MortyClient } from "@/tsContracts/MortyClient";
import { calculateKeccak256 } from "@/utils/helpers";
import { SelectedTokenMessage } from "@/Wormhole/core";


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
    const [invoice, setInvoice] = useState<any>();
    const [IRef, setIRef] = useState<string | null>(null)
    const [logo, setLogo] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)



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

                let response = await fetch("/api/fetch-invoice", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList
                });

                let data: any = await response.json();
                console.log(data.invoice)
                setStatus(data.success.toString())
                if (data.success && data.invoice) {
                    setInvoice(data.invoice)
                }
                if (!data.success) {
                    console.log("expireeeeed or invalid")
                }
                setLoading(false)

            } catch (e) {
                console.error(e)
                setLoading(false)
            }
        }
    }
    const typedClient = new MortyClient(
        {
            sender: undefined,
            resolveBy: 'id',
            id: 479526612 
        },
        algodClient
    );


    const getReference = async () => {
        if (!typedClient || !invoice.metadata.signer || !invoice.metadata.organization) {
            return
        }
        const organization = invoice.metadata.organization;
        console.log("this is the org used - make sure it's the id", organization)
        console.log(`Calling current Subscription`)

        const ref = invoice.metadata.signer;
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
        console.log(period)
        console.log("ref", reference),
            setIRef(reference)
    }

    const fetchOrgmetadata = async () => {

        if (!invoice.metadata.organization) {
            return
        }

        let headersList = {
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "oid": invoice.metadata.organization,
        });

        let response = await fetch("/api/fetch-org-by-id", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data: any = await response.json();
        if (data.success) {
            setName(data.info.name.toUpperCase())
            setLogo(data.info.url)
            console.log(data);
        }

    }

    useEffect(() => {
        if (!IRef && invoice) {
            getReference()
        }

    });



    useEffect(() => {
        if (ref && ref.length > 0) {
            fetchInvoice()
        } else {
            setStatus(null);
        }
    }, [ref]);


    useEffect(() => {
        if (invoice && !logo) {
            fetchOrgmetadata()
        }
    }, [invoice])



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




    const details: any[] =
        invoice ? [
            {
                title: "Biller reference",
                values: [invoice.metadata.organization, invoice.metadata.contactEmail]
            },
            {
                title: "Billed to",
                values: [invoice.metadata.customerName, invoice.metadata.customerEmail]
            },
            {
                title: "Invoice title",
                values: [invoice.metadata.invoiceTitle]
            },
            {
                title: "Invoice token",
                values: [invoice.metadata.invoiceToken]
            },

            {
                title: "Record Reference",
                values: [IRef || "fetching reference..."]
            },
        ] as any[] : []



    return (
        <Box w="100%" pt={[32, 32, 32, 0]}>
            <Center
                w="100%"
                h="100vh">
                <VStack
                    w="100%"
                    alignItems="center">

                    <Box
                        px={24}
                        h="fit-content"
                        flexDirection="column"
                        display="flex"
                        justifyContent="space-around"
                        bg={"rgba(21, 34, 57, 0.8)"}
                        pb={8}
                        pt={24}
                        borderWidth="0.9px"
                        borderColor="#253350"
                        borderRadius={["lg", "lg", "lg", 0]}
                        shadow="md"
                        maxW={["md", "md", "xl", "100%"]}
                        w="100%"
                        sx={{
                            backdropFilter: "blur(15px)",
                        }}
                    >
                        {!status &&
                            <Center>
                                {/* <Spinner /> */}
                                <AnimatedSpinner />
                            </Center>

                        }
                        {status !== "true" ? (
                            renderStatusContent()
                        ) : (
                            <>
                                {!loading && invoice && (
                                    <>
                                        <Stack
                                            justifyContent={'space-between'}
                                            direction={["column", "column", 'column', 'row']}
                                            w="100%"
                                            pt={5}

                                            spacing={[0, 0, 0, 10]}

                                        >

                                            <VStack w='100%'>


                                                <Center>
                                                    <VStack>
                                                        {logo && <   Box
                                                            as="img"
                                                            src={logo}
                                                            h="60px"
                                                            w="60px"
                                                            alt="logo"
                                                        />}

                                                        {name && (
                                                            <Heading>{name}</Heading>
                                                        )}

                                                        {!name && (
                                                            <Text
                                                                fontSize={"lg"}
                                                                textAlign={"left"}>Invoice details
                                                            </Text>
                                                        )}



                                                    </VStack>
                                                </Center>



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
                                                                        section.values.map((value: any, i: number) => (
                                                                            <Box w="100%" key={i}
                                                                                fontSize={index === 4 ? "xs" : "normal"}
                                                                            >
                                                                                <Text>{value}</Text>
                                                                            </Box>
                                                                        ))
                                                                    }

                                                                    {index === 3 && (
                                                                        <Box bg="blackAlpha.200"
                                                                            py={1}
                                                                            px={3}
                                                                        >
                                                                            {invoice.metadata.acceptWrapped && (
                                                                                <>
                                                                                    <Checkbox

                                                                                        isDisabled={true}
                                                                                        isChecked={true}
                                                                                        fontSize={"xs"}
                                                                                    />
                                                                                    <Box
                                                                                        color={"gray.700"}
                                                                                    >

                                                                                        <Box
                                                                                            pr={1}
                                                                                            fontWeight={"semibold"}
                                                                                            as='span'>
                                                                                            Wrapped Asset from other chains are accepted.

                                                                                        </Box>
                                                                                    </Box>
                                                                                </>
                                                                            )}
                                                                            <HStack
                                                                                pb={4}
                                                                                py={2}
                                                                                alignItems={"center"}
                                                                                fontSize={"xs"}
                                                                            >

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


                                                    {/* //items */}


                                                    {invoice.metadata.invoiceItems && invoice.metadata.invoiceItems.map((item: InvoiceItem, index: number) => (
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
                                                                {invoice.metadata.invoiceTotal}
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
                                                                fontWeight={"regular"}
                                                                fontSize={'md'}
                                                            >
                                                                ${invoice.metadata.invoiceTotal}
                                                            </Box>
                                                        </HStack>
                                                        <HStack
                                                            fontSize={"sm"}
                                                            alignItems={"flex-start"}
                                                            justifyContent={"space-between"}>

                                                            <Box
                                                                fontWeight={"regular"}
                                                            >
                                                                currentValue
                                                            </Box>

                                                            <Box
                                                                fontWeight={"bold"}
                                                                fontSize={'md'}
                                                            >
                                                                {invoice.metadata.invoiceTotal}        {invoice.metadata.invoiceToken.split("(")[0].trim()}
                                                            </Box>
                                                        </HStack>
                                                    </Box>
                                                </Box>

                                                <Box
                                                    w="100%"
                                                    py={12}>
                                                    <Button
                                                        as="a"
                                                        isDisabled={!IRef}
                                                        href={`/pay?ref=${invoice.id}`}
                                                        w="100%"
                                                        h="50px"
                                                        colorScheme="green">
                                                        Proceed to Pay
                                                    </Button>
                                                </Box>
                                            </VStack>

                                        </Stack>
                                    </>
                                )}
                            </>
                        )}
                    </Box>




                </VStack>
            </Center>
        </Box >
    );

};

export default PaymentPage;
