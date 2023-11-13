import React, { useEffect, useState } from 'react';
import { Stack, Heading, Input, Button, FormControl, FormLabel, Box, HStack, VStack, Divider, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, List, ListItem } from '@chakra-ui/react';
import { useTransaction } from '@/contexts/TransactionContext';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

const Description = ({ next, prev }: any) => {


    const [tokenView, setTokenView] = useState(false)
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [tokens, setTokens] = useState<any[] | null>(null);
    const {
        invoiceTitle,
        invoiceItems,
        invoiceToken,
        invoiceTotal,
        setInvoiceItems,
        setInvoiceTitle,
        setInvoiceToken,
        getAssetHoildings
    } = useTransaction();

    const [total, setTotal] = useState(0)
    const [title, setTitle] = useState("")
    const [token, setToken] = useState("")
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ])

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: InvoiceItem[keyof InvoiceItem]) => {
        const updatedItems: any[] = [...items];
        updatedItems[index][field] = value;
        updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
        setItems(updatedItems);
    };


    useEffect(() => {
        const sum = items.reduce((acc, item) => acc + item.amount, 0);
        setTotal(sum);
    }, [items]);



    const handleNextStep = () => {
        setInvoiceTitle(title)
        setInvoiceToken(token)
        setInvoiceItems(items)
        next();
    };

    const handlePrevStep = () => {
        setInvoiceTitle(title)
        setInvoiceToken(token)
        setInvoiceItems(items)
        prev();
    };

    useEffect(() => {
        setTitle(invoiceTitle),
            setItems(invoiceItems)
        setToken(invoiceToken)
        setTotal(invoiceTotal)

    }, [])





    const updateTokens = async () => {
        const x = getAssetHoildings();
        if (x) {
            console.log(await x)
            setTokens(await x)
        }
    }


    useEffect(() => {
        if (tokenView && !tokens) {
            updateTokens()
        }
    },)


    const handleTokenPick = () => {
        setTokenView(true)
        onOpen()
    }

    const handleClose = () => {
        setTokenView(false)
        onClose()
    }


    const handleSelect = (token: any) => {
        setToken(`${token.symbol} (` + token.mintKey + `)`)
        handleClose()
    }


    return (
        <Box>
            <VStack
                // pt={32}
                alignItems={"flex-start"}
            >
                <Stack w="100%" spacing={4}>

                    <FormControl display="flex" w="100%"
                        alignItems={"center"}
                        justifyContent={"space-between"}>
                        <Box
                            w='65%'
                        >
                            <FormLabel mt={4} fontSize={["md", "md", "lg", "2xl"]}>Invoice Title</FormLabel>
                            <Input
                                w="100%"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text" placeholder="Invoice Title" />
                            <br />
                        </Box>

                        <Box>
                            <FormLabel fontSize={["md", "md", "lg", "2xl"]} mt={4}> Token</FormLabel>
                            <Input
                                isReadOnly={true}
                                onClick={handleTokenPick}
                                w="100%"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                type="text" placeholder="Enter token ID" />
                        </Box>
                    </FormControl>

                    <Divider py={5} />


                    {items.map((item: any, index: number) => (
                        <HStack

                            alignItems={"center"}
                            key={index}>
                            <FormControl>
                                <FormLabel>Item Description</FormLabel>
                                <Input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Quantity</FormLabel>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Unit Price</FormLabel>
                                <Input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <Input type="text" value={item.amount.toFixed(2)} isReadOnly />
                            </FormControl>
                        </HStack>
                    ))}
                </Stack>
                <Button mt={4} colorScheme="blue" onClick={handleAddItem}>
                    Add Another Item
                </Button>

                <Divider />
            </VStack>
            <Heading size={"lg"} mt={5} textAlign={'right'}>
                SubTotal : {total}
            </Heading>

            <HStack
                py={12}
                w="100%"
                spacing={10}
                alignItems={"center"}
                pb={24}>

                <Button colorScheme="gray" variant="outline" onClick={handlePrevStep}>
                    Previous Step
                </Button>

                <Button colorScheme="green" onClick={handleNextStep}>
                    Continue
                </Button>

            </HStack>


            <Modal isOpen={tokenView} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent mt={32}>
                    <ModalHeader>Select Token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>



                            <List >

                                {!tokens && (
                                    <ListItem>
                                        Asset's found in your account would appear here
                                    </ListItem>
                                )}

                                {tokens && tokens.length > 0 && tokens.map((token, index) => (
                                    <ListItem w="100%" as="button"
                                        key={token.mintKey}
                                        p={4}
                                        _hover={{
                                            bg: "gray.800"
                                        }}
                                        onClick={() => handleSelect(token)}
                                    >
                                        <HStack

                                            px={3}
                                            justify={"space-between"}
                                            alignItems={"center"}>
                                            <Box>{token.symbol}</Box>
                                            <Box>{token.bal}</Box>
                                        </HStack>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </ModalBody>

                </ModalContent>
            </Modal>

        </Box>
    );
};

export default Description;
