import React from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import CreateOrgModal from "../Modal/CreateOrgModal";




const AddOrgButton = ({ isCurrent }: { isCurrent: boolean }) => {
    // const { user, web3AuthAccount, logout, web3AuthProfile }: any = useWeb3AuthProvider()
    const isDisabled = !isCurrent;
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (

        <>
            <Box
                w="300px"
                pl={3}
                pr={9}
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
                        Add Organization

                    </Button>
                </Box>
            </Box>

            <CreateOrgModal isOpen={isOpen} onClose={onClose} />
        </>


    );
};

export default AddOrgButton;

