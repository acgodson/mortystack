import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, Text, ModalContent, Center, Heading, } from '@chakra-ui/react';
import { Box } from "@chakra-ui/react"
import Spinner from '../Spinner';
import { usePay } from '../../hooks/usePay';
import { mortyFontStyles } from '../../utils/helpers';
import { SentPaymentMessage } from '../Icons/sent';
export interface PayModalProps {
    open?: boolean;
    onClose?: () => void;
}

export function PayModal({ onClose, open }: PayModalProps) {
    const { countdown, status, txn, connected, verifierStatus, reference }: any = usePay();

    const [timer, setTimer] = useState(countdown);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (countdown > 0) {
            setTimer(countdown);
        } else {
            setIsProcessing(false);
        }

        if (verifierStatus) {
            // alert("yes")
        } else {
            setIsProcessing(false);
        }
    }, [countdown, verifierStatus, txn]);

    // useEffect(() => {
    //     if (reference) {
    //         alert(reference)
    //         return
    //     }
    // }, [reference])




    return (
        <Modal isOpen={open!} onClose={onClose!}
            size="lg"

            closeOnOverlayClick={false}>


            <ModalOverlay
                opacity={1}
                backgroundColor={"white"}
            />

            <ModalOverlay
            />

            <ModalContent
                css={mortyFontStyles}
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
                p={4}

            >
                <Center>
                    <Spinner />
                </Center>


                {!verifierStatus && true && <SentPaymentMessage />}

                {verifierStatus && (
                    <Box>
                        {/* Show after successful confirmation */}
                    </Box>
                )}
                <Center pb={3}>
                    <Box
                        color={"#253238"}
                        fontWeight={"bold"}
                    >
                        <Box css={mortyFontStyles}
                            textAlign={"center"}
                        >
                            {reference && "ref: " && reference}
                            <Heading
                                color="red"
                            >{timer}</Heading>
                            {!reference && <Text>Verifying Box reference...</Text>}
                            {reference && countdown > 170 && <Text>Verified, waiting for Payment Page...</Text>}
                            {reference && countdown < 240 && <Text>Payment is still processing...</Text>}

                            {/* {reference && !isProcessing && <Text>Payment is successful, waiting for recipient's confirmation...</Text>} */}

                        </Box>

                    </Box>
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