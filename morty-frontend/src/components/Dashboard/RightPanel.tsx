import React, { useEffect, useState } from 'react';
import { Box, Text, HStack, Button, VStack, Switch, useClipboard, useToast } from '@chakra-ui/react';
import { useTransaction } from '@/contexts/TransactionContext';
import TransactionContentLayout from './invoiceDetail';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { FaLink, FaShare, FaShareAlt } from 'react-icons/fa';
import { useWallet } from '@txnlab/use-wallet';

const RightPanel = () => {
    const { selectedTransaction, page }: any = useTransaction();
    const { web3AuthAccount, organizations, status, invoices }: any = useWeb3AuthProvider()
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [data, setData] = useState<any | null>(null)
    const { activeAddress } = useWallet()
    const { onCopy } = useClipboard(invoices && selectedTransaction ? "https://mortystack.xyz/checkout?ref=" + invoices[selectedTransaction - 1].id : "null")
    const org = organizations ? organizations : []
    useEffect(() => {
        return setCurrentStep(
            status ? status === 0 ? 0 :
                status === 1 ?
                    org.length < 1 ? 1 :
                        2 : 0 : 0);
    }, [status, org, setCurrentStep])
    const [invoice, setInvoice] = useState<any | null>(null)
    const toast = useToast()


    useEffect(() => {
        if (invoices && !invoice) {
            setData(invoices)
            console.log("invoices", invoices)
        }
    }, [invoices, invoice])


    return (
        <>

            {page === 0 && (<>
                {web3AuthAccount && selectedTransaction && data && (
                    <Box
                        mt={20}
                        py={12}
                        position="fixed"
                        right={[0, 0, "20"]}
                        top="0"
                        w="500px"
                        bg="#0f182a"
                        minH="100vh"
                        px={4}
                        overflowY="auto"
                        display={['none', 'none', "none", 'block']}

                    >
                        <HStack
                            w="100%"
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Box
                                bg={!selectedTransaction ? "#111e34" : "transparent"}
                            >
                                <Text
                                    visibility={!selectedTransaction ? "hidden" : "visible"}
                                    opacity={selectedTransaction ? 1 : 0.1}
                                    fontWeight="bold">Billed: $ {invoices[selectedTransaction - 1].metadata.invoiceTotal}</Text>
                            </Box>
                            <Box>
                                <VStack>
                                    {/* <Text mt={2}>{selectedTransaction - 1}</Text> */}

                                    <HStack
                                        bg={!selectedTransaction ? "#111e34" : "transparent"}
                                        h="20px"
                                        justifyContent={"center"}
                                        color="gray"
                                        display={"flex"}
                                        alignItems={"center"}
                                        fontSize={"xs"}

                                    >
                                        <Text
                                            visibility={!selectedTransaction ? "hidden" : "visible"}
                                            mt={0}>Accept Wrapped</Text>
                                        <Switch
                                            visibility={!selectedTransaction ? "hidden" : "visible"}
                                            isChecked={true}
                                            // isDisabled={true}
                                            readOnly={true}
                                            size="md" colorScheme='purple' />
                                    </HStack>
                                </VStack>

                            </Box>



                        </HStack >
                        <HStack
                            mt={4}
                            py={3}
                            bg="#111e34"
                            borderRadius={"12px"}
                            pl={3}
                        >
                            {/* <Button
                            isDisabled={true}
                            bg={!selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                            _hover={{
                                bg: !selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                            }}
                            minW="110px"
                        >
                            {selectedTransaction ? "Withdraw" : ""}
                        </Button> */}
                            <Button
                                bg={!selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                                _hover={{
                                    bg: !selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                                }}
                                minW="90px"
                            >
                                {selectedTransaction ? "Delete Invoice" : ""}
                            </Button>
                            <Button
                                bg='#182942'
                                color="white"
                                minW="90px"
                                onClick={() => {
                                    onCopy();
                                    toast({
                                        status: "info",
                                        description: "copied to clipboard",
                                        position: "top-right"
                                    })

                                }}
                                isDisabled={!selectedTransaction}
                                fontWeight={"light"}
                                leftIcon={<FaLink />}
                            >
                                {selectedTransaction ? "Copy Link" : ""}
                            </Button>

                        </HStack>

                        <Box
                            border="solid 0.9px #253350"
                            mt={4}
                            bg={selectedTransaction ? "#253350" : "#132036"}
                            borderRadius={"12px"}
                            px={4}
                            py={6}
                            h="100%"
                            minH={"400px"}
                        >
                            <TransactionContentLayout invoice={invoices && invoices.length > 0 ? invoices[selectedTransaction - 1] : null} />
                        </Box>

                    </Box >
                )}

                {currentStep < 3 && !selectedTransaction && activeAddress && (
                    <>
                        <Box
                            opacity={0.4}
                            mt={20}
                            py={12}
                            position="fixed"
                            right={[0, 0, "20"]}
                            top="0"
                            w="500px"
                            bg="#0f182a"
                            minH="100vh"
                            px={4}
                            overflowY="auto"
                            display={['none', 'none', "none", 'block']}
                            as="img"
                            src={invoices ? "income.svg" : "/setup.svg"}
                        />
                    </>
                )}

                {!web3AuthAccount && !selectedTransaction && (
                    <Box
                        mt={20}
                        py={12}
                        position="fixed"
                        right={[0, 0, "20"]}
                        top="0"
                        w="500px"
                        bg="#0f182a"
                        minH="100vh"
                        px={4}
                        overflowY="auto"
                        display={['none', 'none', "none", 'block']}

                    >
                        <HStack
                            w="100%"
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Box
                                bg={!selectedTransaction ? "#111e34" : "transparent"}
                            >
                                <Text
                                    visibility={!selectedTransaction ? "hidden" : "visible"}
                                    opacity={selectedTransaction ? 1 : 0.1}
                                    fontWeight="bold">Balance: $0.00</Text>
                            </Box>
                            <Box>
                                <VStack>
                                    <Text mt={2}>{selectedTransaction}</Text>

                                    <HStack
                                        bg={!selectedTransaction ? "#111e34" : "transparent"}
                                        h="20px"
                                        justifyContent={"center"}
                                        color="gray"
                                        display={"flex"}
                                        alignItems={"center"}
                                        fontSize={"xs"}

                                    >
                                        <Text
                                            visibility={!selectedTransaction ? "hidden" : "visible"}
                                            mt={0}>Accept Wrapped</Text>
                                        <Switch
                                            visibility={!selectedTransaction ? "hidden" : "visible"}
                                            isChecked={true}
                                            // isDisabled={true}
                                            readOnly={true}
                                            size="md" colorScheme='purple' />
                                    </HStack>
                                </VStack>

                            </Box>



                        </HStack >
                        <HStack
                            mt={4}
                            py={3}
                            bg="#111e34"
                            borderRadius={"12px"}
                            pl={3}
                        >
                            <Button
                                bg={!selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                                _hover={{
                                    bg: !selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                                }}
                                minW="110px"
                            >
                                {selectedTransaction ? "Claim" : ""}
                            </Button>
                            <Button
                                bg={!selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                                _hover={{
                                    bg: !selectedTransaction ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                                }}
                                minW="90px"
                            >
                                {selectedTransaction ? "Claim" : ""}
                            </Button>
                        </HStack>

                        <Box
                            border="solid 0.9px #253350"
                            mt={4}
                            bg={selectedTransaction ? "#253350" : "#132036"}
                            borderRadius={"12px"}
                            px={4}
                            py={6}
                            h="100%"
                            minH={"400px"}
                        >
                            <TransactionContentLayout invoice={invoices && invoices.length > 0 ? invoices[selectedTransaction - 1] : null} />
                        </Box>

                    </Box >
                )}
            </>)}

        </>
    );
};

export default RightPanel;
