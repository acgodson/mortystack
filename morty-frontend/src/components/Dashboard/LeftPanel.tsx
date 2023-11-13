



import { useSignInModal } from '@/contexts/ModalContext/useModalContext';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { Box, VStack, Text, Button } from '@chakra-ui/react'
import { useWallet } from '@txnlab/use-wallet';
import { useEffect, useState } from 'react';
import { FaChartBar, FaFlask } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import CreateButton from '../Invoice/CreateButton';



export default function SidePanel() {
    const { user, web3AuthAccount, logout, web3AuthProfile }: any = useWeb3AuthProvider()
    const { openModal }: any = useSignInModal();
    const { activeAddress } = useWallet()

    const connectAlgoWallet = () => {
        if (!web3AuthAccount) {
            return;
        }
    }
    return (
        <>
            <VStack
                color={"white"}
                h="100vh"
                position={"fixed"}
                maxW={"250px"}
                // display={['none', 'none', 'inherit']}
                w="100%"
                pt={28}
                pb={4}
                top={0}
            >
                <Box>
                    <Box
                        rounded={"full"}
                        opacity={"0.6"}
                        borderLeftRadius={"12px"}
                        mt="12px"
                        left={"3px"}
                        zIndex={"12px"}
                        position={"absolute"}
                        bg="#51936e"
                        h="100px"
                        w="100px"
                    />
                </Box>

                <Box
                    borderRadius={"12px"}
                    w="100%"
                    h="100%"
                    bg="rgba(21, 34, 57, 0.6)"
                    border="solid 0.9px #253350"
                    sx={{
                        backdropFilter: "blur(15px) saturate(120%)",
                    }}
                    py={8}
                    px={[2, 2, 6]}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    zIndex={2}
                >
                    <Box>
                        <Button
                            color={'white'}
                            leftIcon={<FaChartBar />}
                            colorScheme='transparent'
                            fontSize={"sm"}
                        >
                            <Text pl={3}>
                                {/* Strategies */}
                                Invoices
                            </Text>
                        </Button>
                        <br />
                        <br />
                        <Button
                            color={'white'}
                            leftIcon={<MdFlashOn />}
                            colorScheme='transparent'
                            fontSize={"sm"}
                        >
                            <Text pl={3}>
                                Integrations

                            </Text>
                        </Button>
                    </Box>



                    {/* Action buttons */}
                    <Box>

                        {!web3AuthAccount && (
                            <Box
                                py={6}
                                bg="#182942"
                                sx={{
                                    backdropFilter: " saturate(140%)",
                                }}
                                textAlign={"center"}
                                px={2}
                                display={"flex"}
                                flexDirection={"column"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                borderRadius={"15px"}
                            >


                                <Text
                                    fontSize={"md"}
                                    fontWeight={"bold"}
                                >Get Started By Connecting your Wallet</Text>
                                <Text
                                    fontSize={"xs"}
                                    color={"whiteAlpha.600"}
                                    py={2}
                                >Discover new limits and more features by connecting your algo wallet.</Text>


                                <VStack>

                                    <Button
                                        onClick={openModal}
                                        colorScheme="blue"
                                    >
                                        Login    </Button>
                                </VStack>
                            </Box>
                        )}


                        <CreateButton 
                        isCurrent={true}

                            isTab={true}
                        />

                        <Box

                            border="solid 0.9px #253350"
                            bg="rgba(11 3 46, 0.9)"
                            sx={{
                                backdropFilter: "blur(15px) saturate(120%)",
                            }}
                            cursor="pointer"
                            px={4}
                            py={6}
                            borderRadius={"12px"}
                            w="100%"
                            color={"whiteAlpha.700"}
                            mb={8}
                        >
                            <Button
                                leftIcon={<FaFlask />}
                                colorScheme="blue"
                                isDisabled={!web3AuthAccount}
                                w="100%"
                                bg={!web3AuthAccount ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)"}
                                _hover={{
                                    bg: !web3AuthAccount ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)",
                                }}
                            >
                                Dispenser
                            </Button>
                        </Box>
                    </Box>




                </Box>

            </VStack>
        </>
    )
}
