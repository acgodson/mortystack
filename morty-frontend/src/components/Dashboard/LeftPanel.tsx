



import { Box, VStack, Text, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { FaChartBar } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';


export default function SidePanel() {
    const [isSignedIn, setIsSignedIn] = useState(false);


    return (
        <>
            <VStack
                h="100vh"
                position={"fixed"}
                maxW={"250px"}
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
                            leftIcon={<MdFlashOn />}
                            colorScheme='transparent'
                            fontSize={"sm"}
                        >
                            <Text pl={3}>
                                Integrations

                            </Text>
                        </Button>
                    </Box>

                    {!isSignedIn && (
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
                            >Discover new possibilities and more features by connecting your wallet.</Text>

                            <Box>
                                <Button colorScheme="blue">Login</Button>
                            </Box>
                        </Box>
                    )}

                </Box>

            </VStack>
        </>
    )
}
