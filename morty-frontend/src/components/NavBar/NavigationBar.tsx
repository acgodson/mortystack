import { useTabs } from "@/context/TabsContext";
import { Box, HStack, Text, Heading, Button, TabList, Tab, Flex } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";



export default function NavigationBar() {

    const { activeTab }: any = useTabs();
    const isHome = activeTab === 0 ? true : false
    const menuList = [
        "Home", "Dashboard", "Shops"
    ]
    return (
        <Box>



            {/* overlay */}
            <Box
                h="100px"
                w="100%"
                zIndex={"tooltip"}
                top={0}
                bg="rgba(16, 24 ,39, 0.7)"
                position={"fixed"}
                sx={{
                    backdropFilter: "blur(15px)",
                }}
            />


            <Box
                w="100%"
                position={"fixed"}
                zIndex={"tooltip"}
                bg="transparent"
                py={[0, 0, 8]}
                pb={[1, 1, 4]}
                px={[0, 0, 16]}>
                <HStack
                    border={"solid 0.9px #253350"}
                    // border={isHome ? "none" : "solid 0.9px #253350"}
                    bg={"rgba(21, 34, 57, 0.8)"}
                    // bg={isHome ? "rgba(64, 4, 83, 0.3)" : "rgba(21, 34, 57, 0.8)"}
                    w="100%"
                    h="60px"
                    borderRadius={"10px"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    py={[1, 1, 8]}
                    boxShadow={0}
                    // boxShadow={!isHome ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : 0}
                    px={[3, 3, 12]}
                    sx={{
                        backdropFilter: "blur(15px)",
                    }}


                >
                    <Box
                    >


                        <HStack>
                            {/* <Box
                                as="img"
                                src="/algo.svg"
                            /> */}
                            <svg
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                fill='white'
                                viewBox="0 0 113 113.4"
                            >
                                <title>algorand-algo-logo</title>
                                <polygon
                                    points="19.6 113.4 36 85 52.4 56.7 68.7 28.3 71.4 23.8 72.6 28.3 77.6 47 72 56.7 55.6 85 39.3 113.4 58.9 113.4 75.3 85 83.8 70.3 87.8 85 95.4 113.4 113 113.4 105.4 85 97.8 56.7 95.8 49.4 108 28.3 90.2 28.3 89.6 26.2 83.4 3 82.6 0 65.5 0 65.1 0.6 49.1 28.3 32.7 56.7 16.4 85 0 113.4 19.6 113.4"
                                />
                            </svg>

                            <Heading
                                // opacity={}
                                color="white"
                                fontSize={"2xl"} >
                                Morty<Box as="span" sx={{
                                    color: "whiteAlpha.600"
                                }}>Stack</Box>
                            </Heading>
                        </HStack>
                    </Box>

                    <Flex alignItems={"center"} >
                        <TabList>
                            {menuList.map((menu: string, index: number) => (
                                <Tab
                                    key={index}
                                    color={activeTab === index ? "#0e76fd" : "white"}
                                >{menu}</Tab>

                            ))}
                        </TabList>
                        <Button
                            _hover={{
                                bg: "transparent",
                                color: "white"
                            }}
                            fontWeight={"normal"}
                            bg="transparent"
                            color="white"
                            as="a"
                            rightIcon={<FaExternalLinkAlt />}
                            target="_blank"
                            href="https://developer.mortystack.com/docs"
                            fontSize={"16px"}>Docs</Button>

                    </Flex>

                    <Box>
                        <Button>Login</Button>
                    </Box>
                </HStack>
            </Box >
        </Box>
    );
}