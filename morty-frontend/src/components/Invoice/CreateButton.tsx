import React, { useEffect, useState } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import InvoiceModal from "../Modal/CreateInvoiceModal";




const CreateButton = (

    { isCurrent, isTab }: {
        isCurrent?: boolean, isTab?: boolean
    }) => {

    const isDisabled = !isCurrent;
    const { isOpen, onOpen, onClose } = useDisclosure()



    return (

        <>
            <Box
                w={isTab ? "100%" : "300px"}
                pl={isTab ? 0 : 3}
                pr={isTab ? 0 : 9}
                py={6}>
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
                        isDisabled={isDisabled}
                        w="100%"
                        bg={isDisabled ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)"}
                        _hover={{
                            bg: isDisabled ? "#03000f" : "linear-gradient(to right, #243c81, #3951a2)",
                        }}
                        onClick={onOpen}
                    >
                        Create Invoice

                    </Button>
                </Box>
            </Box >



            <InvoiceModal isOpen={isOpen} onClose={onClose} />
        </>


    );
};

export default CreateButton;

