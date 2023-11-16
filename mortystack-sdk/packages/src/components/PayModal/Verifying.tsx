import React, { useEffect, useState } from 'react';
import { SentPaymentMessage } from '../Icons/sent';
import { Box, ChakraProvider, Text } from '@chakra-ui/react';
import { mortyFontStyles } from '../../utils/helpers';
import { usePay } from '../../hooks/usePay';

const VerifyPayment = ({ ref }: { ref: string }) => {
    const { countdown, verifierStatus, txn } = usePay()
    const [timer, setTimer] = useState(countdown);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (countdown > 0) {
            setTimer(countdown);
        } else {
            setIsProcessing(false);
        }

        if (verifierStatus) {
            // Use the transaction ID (txn) to fetch payment details and query for confirmation
            // You can update your UI or take further action based on the successful payment
        } else {
            setIsProcessing(false);
        }
    }, [countdown, verifierStatus, txn]);

    return (
        <ChakraProvider resetCSS={false}>
            <Box css={mortyFontStyles}>
                <Text>{timer}</Text>
                {isProcessing && <Text>Payment is still processing...</Text>}
                {!isProcessing && <Text>Payment is successful, waiting for recipient's confirmation...</Text>}
            </Box>

            {!verifierStatus && true && <SentPaymentMessage />}

            {verifierStatus && (
                <Box>
                    {/* Show after successful confirmation */}
                    {/* You can add more UI components or take actions based on successful payment */}
                </Box>
            )}
        </ChakraProvider>
    );
};

export default VerifyPayment;
