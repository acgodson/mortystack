import React, { useState } from 'react';
import { Box, Text, HStack, Button, VStack, Switch } from '@chakra-ui/react';
import { useTransaction } from '@/context/TransactionContext';
import TransactionContentLayout from './TransactionContent';

const RightPanel = () => {
    const { selectedStrategy }: any = useTransaction();

    return (
        <>
            <Box
                mt={20}
                py={12}
                position="fixed"
                right={"20"}
                top="0"
                w="500px"
                bg="#0f182a"
                minH="100vh"
                px={4}
                overflowY="auto"

            >
                <HStack
                    w="100%"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Box
                        bg={!selectedStrategy ? "#111e34" : "transparent"}
                    >
                        <Text
                            visibility={!selectedStrategy ? "hidden" : "visible"}
                            opacity={selectedStrategy ? 1 : 0.1}
                            fontWeight="bold">Balance: $0.00</Text>
                    </Box>
                    <Box>
                        <VStack>
                            <Text mt={2}>{selectedStrategy}</Text>

                            <HStack
                                bg={!selectedStrategy ? "#111e34" : "transparent"}
                                h="20px"
                                justifyContent={"center"}
                                color="gray"
                                display={"flex"}
                                alignItems={"center"}
                                fontSize={"xs"}

                            >
                                <Text
                                    visibility={!selectedStrategy ? "hidden" : "visible"}
                                    mt={0}>Opted Insurance</Text>
                                <Switch
                                    visibility={!selectedStrategy ? "hidden" : "visible"}
                                    isChecked={false}
                                    isDisabled={true}
                                    readOnly={true}
                                    size="md" colorScheme='red' />
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
                        bg={!selectedStrategy ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                        _hover={{
                            bg: !selectedStrategy ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                        }}
                        minW="110px"
                    >
                        {selectedStrategy ? "Withdraw" : ""}
                    </Button>
                    <Button
                        bg={!selectedStrategy ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)"}
                        _hover={{
                            bg: !selectedStrategy ? "#182942" : "linear-gradient(to right, #243c81, #3951a2)",
                        }}
                        minW="90px"
                    >
                        {selectedStrategy ? "Claim" : ""}
                    </Button>
                </HStack>

                <Box
                    border="solid 0.9px #253350"
                    mt={4}
                    bg={selectedStrategy ? "#253350" : "#132036"}
                    borderRadius={"12px"}
                    px={4}
                    py={6}
                    h="100%"
                    minH={"400px"}
                >
                    <TransactionContentLayout />
                </Box>

            </Box >
        </>
    );
};

export default RightPanel;
