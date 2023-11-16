import React, { useEffect, useState } from 'react';
import { Box, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { FaDollarSign, FaChartLine, FaWallet, FaHourglass } from 'react-icons/fa';
import { useTransaction } from '@/contexts/TransactionContext';
import useCountdown from '@/hooks/useCountdown';



const TransactionContentLayout = ({ invoice }: any) => {

    const [page, setPage] = useState(0)
    const { selectedTransaction }: any = useTransaction();
    const hoursLeft = useCountdown({ startDate: invoice ? invoice.createdAt : 0 });

    const amount = selectedTransaction && invoice && invoice.invoice ? "" : ""
    const worth = selectedTransaction ? "" : "";
    const status = selectedTransaction ? "" : ""



    return (
        <>
            <Box p={4} h="100%"
                bg={selectedTransaction ? "#242f49" : "#182942"}
                borderRadius="lg"
                fontSize={"10px"}
                border={selectedTransaction ? "solid 0.9px gray" : "none"}
            >
                {selectedTransaction && invoice && (
                    <VStack
                        alignItems={"flex-start"}
                        w="100%"
                        opacity={selectedTransaction ? 1 : 0.2}
                        color="white"
                        justifyContent="space-between" mb={4}>

                        <HStack>
                            <Box>
                                <FaDollarSign size={24} color="#4A5568" />
                            </Box>


                            <Box>
                                <Text fontSize="xs" fontWeight="bold" mt={2}>
                                    Amount
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" mt={2}>
                                    {invoice.metadata.invoiceTotal}
                                </Text>


                            </Box>
                        </HStack>
                        <HStack>
                            <Box>
                                <FaChartLine size={24} color="#4A5568" />
                            </Box>
                            <Box>

                                <Text fontSize="xs" fontWeight="bold" mt={2}>
                                    Value
                                </Text>


                                <Text

                                    fontSize={"sm"}
                                    color="gray.600">{worth}</Text>
                                ###         {invoice.metadata.invoiceToken}


                            </Box>
                        </HStack>
                        <HStack>
                            <Box>
                                <FaHourglass size={24} color="#4A5568" />
                            </Box>

                            <Box
                                fontSize={"sm"}
                                color="yellow">
                                <Text fontSize="xs" fontWeight="bold" mt={2}>
                                    Status
                                </Text>

                                <Text
                                    fontSize="xs"
                                >{hoursLeft}</Text>
                            </Box>


                        </HStack>

                    </VStack>
                )}

                {!invoice && (
                    <Box
                        w="100%"
                        h="200px"
                    />
                )}



            </Box>


            <Box w="100%" py={8}>
                <HStack fontSize={"sm"}>

                    <Box color="gray">   Checkout url:</Box>
                    <Box
                        fontSize={"xs"}
                        textDecoration={"underline"}
                        color="white"
                    >
                        {invoice &&
                            <a href="#" target='_blank'>
                                https://mortystack.xyz/checkout?ref=${invoice.id}
                            </a>
                        }
                    </Box>
                </HStack>

            </Box>


        </>

    );
};

export default TransactionContentLayout;
