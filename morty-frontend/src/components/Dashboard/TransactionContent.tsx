import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FaDollarSign, FaChartLine, FaWallet } from 'react-icons/fa';
import { useTransaction } from '@/context/TransactionContext';

const TransactionContentLayout = ({ amountInvested, currentWorth, gmxPosition }: any) => {

    const { selectedStrategy }: any = useTransaction();

    const amount = selectedStrategy ? amountInvested : ""
    const worth = selectedStrategy ? currentWorth : ""
    const position = selectedStrategy ? gmxPosition : ""


    return (
        <Box p={4} h="100%"
            bg={selectedStrategy ? "#242f49" : "#182942"}
            borderRadius="lg"
            border={selectedStrategy ? "solid 0.9px gray" : "none"}
        >
            {selectedStrategy && (
                <Flex
                    opacity={selectedStrategy ? 1 : 0.2}
                    color="white"
                    justifyContent="space-between" mb={4}>
                    <Box>
                        <FaDollarSign size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            Amount Invested
                        </Text>
                        <Text color="gray.600">${amount}</Text>
                    </Box>
                    <Box>
                        <FaChartLine size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            Current Worth
                        </Text>
                        <Text color="gray.600">${worth}</Text>
                    </Box>
                    <Box>
                        <FaWallet size={24} color="#4A5568" />
                        <Text fontSize="xs" fontWeight="bold" mt={2}>
                            GMX Position
                        </Text>
                        <Text color="gray.600">{position} GMX</Text>
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
