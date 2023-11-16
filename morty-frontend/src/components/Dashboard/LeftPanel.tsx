



import { useSignInModal } from '@/contexts/ModalContext/useModalContext';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { Box, VStack, Text, Button } from '@chakra-ui/react'
import { useWallet } from '@txnlab/use-wallet';
import { FaChartBar, FaFlask } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import CreateButton from '../Invoice/CreateButton';
import { useTransaction } from '@/contexts/TransactionContext';
import { useState, useEffect } from 'react';



export default function SidePanel() {
    const { web3AuthAccount, organizations, status, invoices }: any = useWeb3AuthProvider()
    const { setPage, page } = useTransaction()
    const { openModal }: any = useSignInModal();
    const { activeAddress } = useWallet();

    const [currentStep, setCurrentStep] = useState<number>(0);
    useEffect(() => {
        return setCurrentStep(
            !status || status === "0" ? 0 :
                status > 0 ?
                    organizations && organizations.length < 1 ? 1 :
                        2 : 0);
    }, [status, organizations, setCurrentStep])



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
                            colorScheme='transaprent'
                            leftIcon={<FaChartBar />}
                            color={page === 0 ? "#3951a1" : 'white'}
                            fontSize={"sm"}
                            onClick={() => setPage(0)}
                        >
                            <Text pl={3}>
                                Invoices
                            </Text>
                        </Button>
                        <br />
                        <br />
                        <Button

                            colorScheme='transaprent'
                            leftIcon={<MdFlashOn />}
                            color={page === 1 ? "#3951a1" : 'white'}
                            fontSize={"sm"}
                            onClick={() => setPage(1)}
                        >
                            <Text pl={3}>
                                Transactions

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



                        {activeAddress && web3AuthAccount && currentStep > 1 && (
                            <>
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
                                        color={"white"}
                                        leftIcon={<FaFlask />}
                                        colorScheme="blue"
                                        isDisabled={true}
                                        w="100%"
                                        bg={!web3AuthAccount ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)"}
                                        _hover={{
                                            bg: !web3AuthAccount ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)",
                                        }}
                                    >
                                        Dispenser
                                    </Button>
                                </Box>
                            </>
                        )}


                    </Box>


                </Box>

            </VStack >
        </>
    )
}
