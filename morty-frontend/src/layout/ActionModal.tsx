import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Select,
    Input,
    Box,
    Center,
    FormLabel,
    HStack
} from '@chakra-ui/react';



interface AModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string,
    size?: any
    body: any,
    footer?: any
}



// Create New Invoice


// activeStep === 2 ? "100vh" : "fit-content"}



const AModalLayout: React.FC<AModalProps> = ({ isOpen, onClose, title, size, body, footer }) => {
    return (
        <Modal
        trapFocus={false}
        isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent

                pt={24} borderRadius="md" >

                <ModalHeader
                    zIndex={"tooltip"}
                    w="100%"
                    position='fixed'
                    bg="rgba(45, 55, 72, 0.6)"

                    sx={{
                        backdropFilter: "blur(15px) saturate(120%)",
                    }}
                    borderBottom="1px dashed white"
                >
                    {title}
                </ModalHeader>

                <ModalCloseButton
                    position='fixed'
                    zIndex={999999}
                    size={"lg"}
                    mr={8}
                    bg="#182942"
                    mt={24} />


                <ModalBody w="100%"
                    pt={12}
                    bg="#182942"
                    position='relative'
                    overflowY={"auto"}
                    minH={size}
                >
                    <Box p={6}
                    >
                        <Center>
                            {body}
                        </Center>
                    </Box>
                </ModalBody>

                <ModalFooter
                    bg="rgba(45, 55, 72, 0.5)"
                    sx={{
                        backdropFilter: "blur(15px) saturate(120%)",
                    }}
                    zIndex="tooltip"
                    w="100%" position="fixed"
                    bottom={0}
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    p={6}>
                    <HStack w="100%"
                        px={3}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        {footer}
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default AModalLayout;
