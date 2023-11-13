import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FaDollarSign, FaChartLine, FaWallet } from 'react-icons/fa';
import { useTransaction } from '@/contexts/TransactionContext';

const TransactionContentLayout = ({ tokenAMount, currentWorth, txnStatus }: any) => {

    const { selectedTransaction }: any = useTransaction();

    const amount = selectedTransaction ? tokenAMount : ""
    const worth = selectedTransaction ? currentWorth : ""
    const status = selectedTransaction ? txnStatus : ""


    return (
        <Box p={4} h="100%"
            bg={selectedTransaction ? "#242f49" : "#182942"}
            borderRadius="lg"
            border={selectedTransaction ? "solid 0.9px gray" : "none"}
        >
            {selectedTransaction && (
                <Flex
                    opacity={selectedTransaction ? 1 : 0.2}
                    color="white"
                    justifyContent="space-between" mb={4}>
                    <Box>
                        <FaDollarSign size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            Amount
                        </Text>
                        <Text color="gray.600">${amount}</Text>
                    </Box>
                    <Box>
                        <FaChartLine size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            Value
                        </Text>
                        <Text color="gray.600">${worth}</Text>
                    </Box>
                    <Box>
                        <FaWallet size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            Status
                        </Text>
                        <Text color="gray.600">{status} GMX</Text>
                    </Box>
                </Flex>
            )}

            <Box
                w="100%"
                h="200px"
            />

        </Box>
    );
};

export default TransactionContentLayout;
