
import { Button, Modal, Text, ModalContent, ModalFooter, Box, ModalBody, Center, ModalOverlay, Flex } from "@chakra-ui/react";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";

import { MdArrowDownward } from "react-icons/md";
import { SmartAddress } from "@/Wormhole/core";
import { useTransaction } from "@/contexts/TransactionContext";



function SendConfirmationContent({
    open,
    onClose,
    onClick,
}: {
    open: boolean;
    onClose: () => void;
    onClick: () => void;
}) {

    const { sourceChain, amount, targetChain, targetAsset, sourceParsedTokenAccount }: any = useWormholeContext()


    const sendConfirmationContent = (
        <>
            <ModalOverlay />
            <ModalContent bg="gray.800">
                <ModalBody bg="gray.800">
                    <Text
                        color="blue.200"
                        pt={4}
                        pb={2}
                        fontSize={"md"}

                        variant="subtitle1" style={{ marginBottom: 0 }}>
                        You are about to perform this transfer:
                    </Text>
                    <Box
                        py={3}
                        bg="blackAlpha.300"
                        textAlign="center"
                    >

                        <Flex justifyContent={"center"} textAlign={"center"}>
                            <Text>  {amount} </Text>&nbsp;
                            <SmartAddress
                                variant="h6"
                                chainId={sourceChain}
                                parsedTokenAccount={sourceParsedTokenAccount}
                                isAsset
                            />
                        </Flex>

                        <Center py={3} style={{ paddingTop: 4 }}>
                            <MdArrowDownward fontSize="inherit" />
                        </Center>
                        <Box>
                            <Text variant="caption">
                                Seller
                            </Text>
                        </Box>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button

                        colorScheme="green"
                        onClick={onClick}
                        size={"medium"}
                        h="45px"
                        px={4}
                    >
                        {"Confirm"}
                    </Button>
                </ModalFooter>

            </ModalContent>

        </>
    );

    return sendConfirmationContent;
}

export default function SendConfirmationDialog({
    open,
    onClick,
    onClose,
}: {
    open: boolean;
    onClick: () => void;
    onClose: () => void;
}) {
    return (
        <Modal isOpen={open} onClose={onClose}>
            <SendConfirmationContent
                open={open}
                onClose={onClose}
                onClick={onClick}
            />
        </Modal>
    );
}
