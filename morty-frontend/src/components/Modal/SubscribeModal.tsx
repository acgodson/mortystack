import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Box,
    VStack,
    Text,
    Center,
    Flex,
    Stack,
    Alert,
    AlertDescription,
    AlertIcon,
    HStack
} from '@chakra-ui/react';
import AModalLayout from '@/layout/ActionModal';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet';
import { useTransaction } from '@/contexts/TransactionContext';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';



interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}


const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {

    const { providers, activeAddress } = useWallet()
    const { appID, isSubscribing, hasError, fetchingBal, Subscribe, toggleProvider } = useTransaction()
    const { selectedProvider }: any = useWeb3AuthProvider()


    const ModalBody = () => (
        <VStack

            w="100%"
            position={"relative"}
            justifyContent={"center"}
            alignItems={"center"}   >

            <Box p={6} maxW="xl" mx="auto">
                <Text fontSize="2xl"
                    textAlign={"center"}
                    fontWeight="bold" mb={4}>
                    Let's Get You Started
                </Text>
                <Flex mb={4}>
                    <Box
                        // border={"1px solid #3182ce"}
                        background="linear-gradient(to right,#a6a6ee,white, white,white)"
                        color="#182942"
                        p={4}
                        borderRadius="md"
                        mr={4}
                        boxShadow={"lg"}
                        flexBasis="50%"
                        textAlign="right"
                        fontWeight={'extrabold'}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        fontSize={"2xl"}
                    >
                        <Text textAlign={"right"}>  30 Days</Text>
                    </Box>
                    <Box
                        boxShadow={"lg"}
                        bg="blackAlpha.300"
                        color="whiteAlpha.600"
                        p={4}
                        borderRadius="md"
                        flexBasis="50%"
                        textAlign="center"
                        fontSize={"2xl"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}

                    >
                        $0.00
                    </Box>
                </Flex>
                <br />
                <Text
                    color={"#a6a6ee"}
                    fontSize="lg" mb={4}>
                    Choose Provider
                </Text>


                {
                    hasError && (
                        <Alert mb={3} status='error'>
                            <AlertIcon />
                            <AlertDescription
                                fontSize={"sm"}
                            >{hasError} </AlertDescription>
                        </Alert>
                    )
                }


                <Stack direction="column" spacing={4}>
                    <VStack
                        as='button'
                        opacity={0.5}
                        border="0.5px solid #a6a6ee"
                        bg={selectedProvider === 0 ? "#4e4fdf" : "blackAlpha.200"}

                        _hover={{
                            bg: selectedProvider === 0 ? "#4e4fdf" : "blackAlpha.200"
                        }}
                        p={4}
                        borderRadius="md"
                        spacing={2}
                        align="start"
                        // onClick={() => toggleProvider(0)}
                        textAlign={"left"}
                    >
                        <Text
                            color={selectedProvider !== 0 ? "#a6a6ee" : "color"}
                            fontWeight="bold">Default Provider (Disabled)</Text>
                        <Text fontSize={"xs"} opacity={0.7}
                            maxW={"80%"}
                        >
                            Use your default web3auth self-custodial address attached to your
                            email key share.
                        </Text>
                    </VStack>
                    <VStack
                        as='button'
                        border="0.5px solid #a6a6ee"
                        bg={selectedProvider === 1 ?
                            "#222a70" :

                            "blackAlpha.200"}
                        _hover={{
                            bg: selectedProvider === 1 ? "#222a70" : "blackAlpha.200"
                        }}
                        p={4}
                        borderRadius="md"
                        spacing={2}
                        align="start"
                        textAlign={"left"}
                        onClick={() => toggleProvider(1)}
                    >
                        <Text fontWeight="bold"
                            color={selectedProvider !== 1 ? "#a6a6ee" : "color"}
                        >External Provider (Recommended)</Text>
                        <Text
                            maxW={"80%"}
                            fontSize={"xs"} opacity={0.7}>
                            Connect with your Algo wallet, sign transactions, and be in complete
                            control of your keys.
                        </Text>
                    </VStack>
                </Stack>

                <Center my={8}>

                    {
                        selectedProvider === 1 ?
                            activeAddress && (
                                <Button
                                    isDisabled={hasError ? hasError.length > 2 : false}
                                    isLoading={fetchingBal || isSubscribing}
                                    bg="#4e4fdf"
                                    color="white"
                                    size="lg"
                                    onClick={() => Subscribe(algosdk.decodeAddress(activeAddress!).publicKey,
                                        [{
                                            appIndex: appID,
                                            name: algosdk.decodeAddress(activeAddress!).publicKey
                                        }]
                                    )}
                                >
                                    Subscribe Now
                                </Button>
                            ) : selectedProvider === 0 && (
                                <Button
                                    isDisabled={hasError ? hasError.length > 2 : false}
                                    isLoading={fetchingBal || isSubscribing}
                                    bg="#4e4fdf"
                                    color="white"
                                    size="lg"
                                    onClick={() => Subscribe(algosdk.decodeAddress(activeAddress!).publicKey,
                                        [{
                                            appIndex: appID,
                                            name: algosdk.decodeAddress(activeAddress!).publicKey
                                        }]
                                    )}
                                >
                                    Subscribe Now
                                </Button>
                            )
                    }




                    {selectedProvider === 1 && !activeAddress && (
                        <VStack w="100%‰">
                            <Text fontSize={"sm"}>Connect your wallet</Text>
                            <HStack spacing={10}>
                                {providers?.map((provider, index) => (

                                    <Button
                                        h="45px"
                                        bg={index === 0 ? "black" : "#ffee55"}
                                        color={index === 0 ? "white" : "black"}
                                        px={5}
                                        leftIcon={<Box
                                            width={30}
                                            height={30}
                                            alt={`${provider.metadata.name} icon`}
                                            src={provider.metadata.icon}
                                            as="img" />}
                                        key={provider.metadata.id}
                                        type="button" onClick={provider.connect} disabled={provider.isConnected}>
                                        Connect {provider.metadata.name}
                                    </Button>
                                ))
                                }
                            </HStack>
                        </VStack>

                    )}


                </Center>
            </Box >

        </VStack >
    )



    return (

        <AModalLayout
            isOpen={isOpen}
            onClose={onClose}
            title={'Subscription'}
            size={"fit-content"}
            body={<ModalBody />}
        />
    );
};


export default SubscribeModal;
