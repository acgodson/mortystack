import { useState, useEffect } from 'react';
import { Box, Center, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';

const SwapComponent: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState('WBTC');
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        // Fetch and set the user's balance from the connected wallet (Metamask or similar)
        // Replace the following line with the actual logic to fetch the balance from the connected wallet.
        // For demonstration purposes, it's set to 0 by default.
        setBalance(0);
    }, [isConnected]);

    const handleConnectWallet = () => {
        // Implement logic to connect the wallet here
        // For example, using Metamask or any other web3 provider
        // After connecting, setIsConnected(true);
    };

    const handleSwap = () => {
        // Implement logic to initiate the swap here
        // Use 'selectedToken' and 'amount' states for the selected token and amount to be transferred
    };


    return (
        <Center h="100vh">



            <Box

                sx={{
                    bg: "blue"
                }}
                maxW="md" p="8" borderWidth="1px" borderRadius="lg" boxShadow="lg">
                {isConnected ? (
                    <>
                        <Box textAlign="left" mb="4">
                            Balance: {balance.toFixed(2)}
                        </Box>
                        <FormControl mb="4">
                            <FormLabel>Select EVM Token</FormLabel>
                            <Select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
                                <option value="WBTC">WBTC</option>
                            </Select>
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel>Amount to Transfer</FormLabel>
                            <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </FormControl>
                        <Button colorScheme="teal" onClick={handleSwap}>
                            Submit Transaction
                        </Button>
                    </>
                ) : (
                    <>
                        <Box textAlign="left" mb="4">
                            Connect Metamask
                        </Box>
                        <Button colorScheme="teal" rightIcon={<FaEthereum />} onClick={handleConnectWallet}>
                            Connect Metamask
                        </Button>
                    </>
                )}
            </Box>
        </Center>
    );
};

export default SwapComponent;
