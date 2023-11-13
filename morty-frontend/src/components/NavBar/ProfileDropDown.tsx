import { shortenAddress } from "@/Wormhole/core/tokenSelector/TokenPicker";
import { useTransaction } from "@/contexts/TransactionContext";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import { ALGORAND_HOST } from "@/utils/wormhole/consts";
import { Popover, Box, Text, PopoverTrigger, Button, Avatar, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Divider, Center, HStack, useClipboard, useToast } from "@chakra-ui/react";
import { Algodv2 } from "algosdk";
import { link } from "fs";
import { useEffect, useState } from "react";

type providers = "PERA" | "Wallet_Connect";
type LinkedWallet = {
    addr: string | null,
    provider: providers,
    minBal: any
}
const algodClient = new Algodv2(
    ALGORAND_HOST.algodToken,
    ALGORAND_HOST.algodServer,
    ALGORAND_HOST.algodPort
);

const CustomDropdownButton = (
    {
        id,
        email,
        joined,
        address,
        balance,
        onClick,
        linked,
        disconnect,
        connect
    }: {
        id: string,
        email: string,
        joined: string,
        address: string,
        balance: number,
        onClick: () => void
        linked: LinkedWallet,
        disconnect(): void
        connect(): void
    }
) => {



    const { onCopy, value, setValue, hasCopied } = useClipboard("");
    const { web3AuthBalance }: any = useWeb3AuthProvider()
    const [linkedBal, setLinkedBal] = useState<number | null>(null)
    const [defBal, setDefBal] = useState<number | null>(null)
    const toast = useToast()

    function copyAddress(address: string) {
        setValue(address)
        if (value === address) {
            onCopy()
            toast({
                status: 'success',
                title: 'address copied',
                position: 'top'
            })
        }
    }

    async function updateLinkedBal() {
        if (!linked.addr) {
            return;
        }
        const result = await algodClient.accountInformation(linked.addr).do();
        const formattedAmount = Math.floor(result.amount / 1e6);
        setLinkedBal(formattedAmount)
    }


    useEffect(() => {
        if (linked.addr && !linkedBal) {
            updateLinkedBal()
        }
    }, [linked.addr, linkedBal])



    return (
        <Popover placement="bottom-start">
            <PopoverTrigger>
                <Button
                    borderRadius={'25px'}
                    px={5}
                    py={6}
                    bg="blue.900"
                    leftIcon={<Avatar name="User Name" src="user-avatar-url.jpg" size="sm" mr={2} />}
                    size="sm" variant="ghost">

                    <Text>{email}</Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Profile Info</PopoverHeader>
                <PopoverBody>
                    <Box fontSize="xs">
                        <Text py={1}>Id:

                            <span style={{
                                cursor: "pointer",
                                color: "lightblue",
                                textDecoration: "underline",
                                marginLeft: "5px",
                                fontSize: "11px"
                            }}>
                                {id}
                            </span>

                        </Text>
                        <Text py={1}>Email: {email}</Text>
                        <Text py={1}>Joined: {joined}</Text>

                        <Box
                            alignItems={"center"}
                            justifyContent={'space-between'}
                            display={"flex"}>Address:

                            <Box
                                cursor={"pointer"}
                                px={3}
                                py={1}
                                fontSize={"12px"}
                                borderRadius={"12px"}
                                bg="blue.800">   {address}</Box>
                            <Box fontSize={'xs'} fontWeight={"bold"}>
                                mBal:
                                <Box as="span" color={"yellow"}> {web3AuthBalance}</Box>

                            </Box>
                        </Box>
                        <Divider py={2} mx={2} />

                        <Box
                            pt={3}
                            alignItems={"center"}
                            justifyContent={'space-between'}
                            display={"flex"}>Linked Wallet::

                            {linked.addr && (
                                <>
                                    <Box
                                        as='button'
                                        px={3}
                                        py={1}
                                        fontSize={"12px"}
                                        borderRadius={"12px"}
                                        onClick={linked.addr ? () => copyAddress(linked.addr!) : () => { }}
                                        bg="blue.800">   {shortenAddress(linked.addr)}</Box>
                                    <Box fontSize={'xs'}

                                        fontWeight={"bold"}>
                                        mBal: <Box as="span" color={"yellow"}> {linkedBal}</Box>
                                    </Box>
                                </>
                            )}


                        </Box>

                        <Center>
                            <HStack alignItems={'center'} spacing={3} justifyContent={'center'}>
                                <Button
                                    border={'0.4px solid gray'}
                                    mt={8}
                                    h='30px'
                                    colorScheme={linked.addr ? "red" : "blue"}
                                    onClick={!linked.addr ? connect : disconnect}
                                >
                                    {!linked.addr ? 'Link Wallet' : 'Unlink Wallet'
                                    }

                                </Button>
                                <Button
                                    border={'0.4px solid gray'}
                                    mt={8}
                                    h='30px'
                                    onClick={onClick}
                                >Log Out</Button>
                            </HStack>
                        </Center>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover >
    );
};

export default CustomDropdownButton;
