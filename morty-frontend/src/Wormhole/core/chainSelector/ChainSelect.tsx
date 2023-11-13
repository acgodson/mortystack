import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    HStack,
    Box,
    Text,
} from "@chakra-ui/react";


const ChainSelect = ({ value, onChange, chains, onMaxClick, isDisabled, ...props }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    // Create a ref to store the selected chain ID

    const handleClose = () => {
        setIsOpen(false);
    };


    const handleSelect = (selectedValue: any) => {

        onChange(selectedValue);
        handleClose();
    };

    return (
        <>
            {value && (
                <>
                
                    <Button
                        color="white"
                        bg="blackAlpha.600"
                        _hover={{
                            bg: "blackAlpha.600"
                        }}
                        _active={{
                            bg: "blackAlpha.600"
                        }}
                        _focus={{
                            bg: "blackAlpha.600"
                        }}
                        w={["100%", "100%", "200px"]}

                        leftIcon={<img src={
                            value ?
                                chains.filter((c: any) => c.id === value)[0].logo : ""} alt={chains.filter((c: any) => c.id === value)[0].name} style={{ height: "25px", width: "auto" }} />}
                        isDisabled={isDisabled}
                        onClick={() => setIsOpen(true)}>
                        {chains.filter((c: any) => c.id === value)[0].name}
                    </Button>
                </>
            )}



            <Modal isOpen={isDisabled ? false : isOpen} onClose={handleClose} size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalBody bg="gray.800">
                        {chains.map((chain: any) => (
                            <Box
                                key={chain.id}
                                p={2}
                                // _hover={{ bg: "gray.200" }}
                                onClick={() => handleSelect(chain.id)}
                                cursor="pointer"
                            >
                                <HStack>
                                    <img src={chain.logo} alt={chain.name} style={{ width: "25px", height: "auto" }} />
                                    <Text>{chain.name}</Text>
                                </HStack>
                            </Box>
                        ))}
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
};

export default ChainSelect;
