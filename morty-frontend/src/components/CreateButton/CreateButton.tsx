import React, { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useSignInModal } from "@/context/useModalContext";
import CreateStrategyModal from "../Modal/CreateStrategyModal";



const CreateButton = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const isDisabled = isSignedIn ? false : true;
 
    const { isModalOpen, openModal, closeModal }: any = useSignInModal();


    return (

        <>
            <Box
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
                        onClick={() => openModal('Modal content goes here')}
                    >
                        Create Invoice
                        {/* Strategy */}
                    </Button>
                </Box>
            </Box>
            <CreateStrategyModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>


    );
};

export default CreateButton;

