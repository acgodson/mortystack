
import { useSignInModal } from "@/contexts/ModalContext/useModalContext";
import { useTabs } from "@/contexts/TabContext/TabsContext";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import { Box, HStack, Text, Heading, Button, TabList, Tab, Flex, Stack, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaHamburger } from "react-icons/fa";
import ProfileDropdownButton from "./ProfileDropDown";
import { MdClose, MdMenu } from "react-icons/md";
import { shortenAddress } from "@/Wormhole/core/tokenSelector/TokenPicker";
import { getAuth } from "firebase/auth";
import { useTransaction } from "@/contexts/TransactionContext";
import { useWallet } from "@txnlab/use-wallet";

function getJoinedDate(date: string) {
    const dateObject = new Date(date);
    const month = dateObject.toLocaleString('default', { month: 'long' }); // Full month name
    const year = dateObject.getFullYear();
    const formattedDate = `${month} ${year}`;
    return formattedDate
}


export default function NavigationBar() {
    const auth = getAuth()
    const joined = auth.currentUser?.metadata.creationTime || " "
    const { activeTab }: any = useTabs();
    const { isModalOpen, openModal, closeModal }: any = useSignInModal();
    const { user, web3AuthAccount, logout, web3AuthProfile, setInvoices, setSelectedProvider, setRefs, setStatus }: any = useWeb3AuthProvider()
    const { activeAddress, providers, getAccountInfo } = useWallet()
    const [profile, setProfile] = useState<any | null>(null)
    const [isMenuOpen, setMenuOpen] = useState(false)
    const isHome = activeTab === 0 ? true : false
    const [connectedProvider, setConnectedProvider] = useState<any | null>(null)
    const menuList = [
        "Home", "Dashboard", "Shops"
    ]



    const handleLoginClick = () => {
        openModal()
    }

    const toggleMenu = () => setMenuOpen(!isMenuOpen)

    useEffect(() => {
        if (activeAddress && !connectedProvider) {
            setConnectedProvider(providers?.filter((x) => x.isActive === true)[0])
        }
    }, [providers, activeAddress])



    return (
        <Box>

            {/* overlay */}
            <Box
                h={[
                    isMenuOpen ? "100vh" : "100px",
                    isMenuOpen ? "100vh" : "100px",
                    "100px"]}
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
                bg={["rgba(21, 34, 57, 0.8)", 'rgba(21, 34, 57, 0.8)', "transparent"]}
                py={[0, 0, 8]}
                pb={[1, 1, 4]}
                px={[0, 0, 0, 16]}>
                <Stack
                    direction={[
                        "column",
                        "column",
                        "row"
                    ]}
                    border={["none", "none", "solid 0.9px #253350"]}
                    bg={"rgba(21, 34, 57, 0.8)"}

                    sx={{
                        backdropFilter: "blur(15px)",
                    }}
                    w="100%"
                    h="60px"
                    borderRadius={[0, 0, 0, "10px"]}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    py={[1, 1, 8]}
                    boxShadow={0}
                    // boxShadow={!isHome ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : 0}
                    px={[0, 0, 12]}

                >
                    {/* logo */}
                    <Flex
                        px={[6, 6, 0]}
                        py={[0, 0, 0]}
                        alignItems={'center'}
                        justifyContent={"space-between"}
                        w={['100%', '100%', 'fit-content']}
                    >

                        <Box>
                            <HStack>
                                <Box
                                    h="35px"
                                    w="auto"
                                    as="img"
                                    src="/icons/mortyIcon.png"
                                    pr={0.6}
                                />
                                <Heading
                                    fontFamily="CustomFontPlainRegular"
                                    color="white"
                                    fontSize={"2xl"} >
                                    Morty
                                </Heading>
                            </HStack>
                        </Box>

                        <Box
                            display={["block", "block", "none"]}
                        >
                            <IconButton aria-label={"menu"}
                                icon={isMenuOpen ? <MdClose /> : <MdMenu />}
                                onClick={toggleMenu}
                            />

                        </Box>

                    </Flex>


                    <Flex
                        display={[isMenuOpen ? "flex" : "none", "flex"]}
                        justifyContent={"center"}
                        w={["100%", "100%", 'fit-content']}
                        bg={["rgba(21, 34, 57, 0.8)", "rgba(21, 34, 57, 0.8)", "transparent"]}
                        sx={{
                            backdropFilter: "blur(15px)",
                        }}
                        direction={['column', 'column', 'row']}
                        alignItems={"center"} >
                        <TabList
                            display={"flex"}
                            flexDirection={['column', 'column', 'row']}
                        >
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
                            href="https://docs.mortystack.xyz/docs"
                            fontSize={"16px"}>Docs</Button>

                    </Flex>



                    <Flex
                        justifyContent={["center", "center", "flex-end"]}
                        py={[2, 2, 0]}
                        mt={[-2, -2, 0]}
                        w={["100%", "100%", "fit-content"]}
                        bg={"rgba(21, 34, 57, 0.8)"}
                        sx={{
                            backdropFilter: "blur(15px)",
                        }}
                    >
                        {
                            !web3AuthAccount && (
                                <Button
                                    isDisabled={isModalOpen}
                                    onClick={handleLoginClick}
                                >Login</Button>
                            )
                        }

                        {
                            web3AuthAccount &&
                            <ProfileDropdownButton
                                id={user.id}
                                email={user.email}
                                joined={joined != "" ? getJoinedDate(joined.toString()) : joined}
                                address={web3AuthAccount.addr || ""}
                                balance={0}
                                onClick={logout}
                                linked={{
                                    addr: activeAddress ? activeAddress : null,
                                    provider: "PERA",
                                    minBal: 0 //later
                                }}
                                disconnect={connectedProvider ? () => {
                                    // setInvoices(null);
                                    setRefs(null);
                                    setStatus(null)
                                    setSelectedProvider(0);
                                    connectedProvider.disconnect();
                                    localStorage.removeItem("morty-invoices")

                                } : () => { }}
                                connect={connectedProvider && connectedProvider.connect}
                            />
                        }

                    </Flex>


                </Stack>
            </Box >




        </Box >
    );
}