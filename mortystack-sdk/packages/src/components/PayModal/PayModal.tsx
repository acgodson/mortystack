import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Center, } from '@chakra-ui/react';
import { Box } from "@chakra-ui/react"
import Spinner from '../Spinner';
import { usePay } from '../../hooks/usePay';
export interface PayModalProps {
    open: boolean;
    onClose: () => void;
}

export function PayModal({ onClose, open }: PayModalProps) {
    const [titleId, setTitleId] = useState('')
    const { sendPayment, connected } = usePay()



    return (
        <Modal isOpen={open} onClose={onClose}
            size="md">

            {/* overlay to block the view on the existing website */}
            <ModalOverlay
                opacity={1}
                backgroundColor={"white"}
            />

            {/* an overlay to creating a modal background over the block and differntiate the content from surrounding */}
            <ModalOverlay
            />


            <ModalContent
                position={"absolute"}
                bgColor={"white"}
                top={0}
                w="fit-content"
                h="fit-content"
                bottom={0}
                display={"flex"}
                justifyContent={"center"}
                alignContent={"center"}
                flexDirection={"column"}
                p={8}

            >
                <Center>
                    <Spinner />
                </Center>




            </ModalContent>


        </Modal>
    );
}


//   <ModalHeader>{titleId}</ModalHeader>
//             <Box
//                 w="100%"

//                 position={"fixed"}
//                 right={32}
//                 color={"white"}>

//                 <ModalCloseButton
//                     size={"2xl"}
//                 />
//             </Box>
//             <ModalBody>
//                 {/* Payment Page Component, would fit in here as a content */}
//             </ModalBody>