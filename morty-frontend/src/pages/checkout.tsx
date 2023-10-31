import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Input, Button, Text, Center, IconButton, VStack, Spinner } from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import algosdk from "algosdk";


//for testing purposes only
const algodToken = {
    "X-Indexer-API-Token": process.env.ALGO_API_KEY!,
};
const algodServer = process.env.ALGO_INDEXER_URL;
const algodPort = "";
const indexerClient = new algosdk.Indexer(algodToken, algodServer, algodPort);

// use the indexer to query if an asset exists


const PaymentPage: React.FC = () => {
    const router = useRouter();
    const { ref } = router.query;
    const [amount, setAmount] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchTxn() {
        try {
            const response = await axios.post("/api/decrypt-ref", { ref });
            if (response) {
                setStatus(response.data.status)
                //valiidate data the valid link by quering intial state in blockchain
                setLoading(false)
            }
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (ref && ref.length > 0) {
            // Fetch decrypted values based on the ID from the API endpoint
            fetchTxn()
        } else {
            // No ID parameter in the URL, handle accordingly
            setStatus(null);
        }
    }, [ref]);

    const renderStatusContent = () => {
        switch (status) {
            case "not-found":
                return (
                    <VStack align={"center"}>
                        <FaExclamationCircle size={48} color="red" />
                        <Text mt="4" fontWeight="bold">
                            Invalid URL
                        </Text>
                    </VStack>
                );
            case "expired":
                return (
                    <VStack align={"center"}>
                        <FaExclamationCircle size={48} color="orange" />
                        <Text mt="4" fontWeight="bold">
                            Transaction has Expired
                        </Text>
                    </VStack>
                );
            case "valid":
                return (
                    <VStack align={"center"}>
                        <FaCheckCircle size={48} color="green" />
                        <Text mt="4" fontWeight="bold">
                            Transaction Completed
                        </Text>
                        <Button mt="4" colorScheme="teal" onClick={() => copyReference()}>
                            Copy Reference
                        </Button>
                    </VStack>
                );
            default:
                return null;
        }
    };

    const copyReference = () => {
        // Logic to copy reference to clipboard
        // Implement as needed
    };

    return (
        <Box>
            <Center h="100vh">
                <VStack alignItems={"center"} >
                    <Box>
                        <Box
                            position={"absolute"}
                            marginTop={"16px"}
                            h="50px"
                            w='50px'
                            bg="red"
                            rounded={"full"}

                        />
                    </Box>
                    <Box
                        px={24}
                        h="300px"
                        flexDirection={"column"}
                        display={"flex"}
                        justifyContent={"space-around"}
                        bg={"rgba(21, 34, 57, 0.8)"}
                        py="4" borderWidth="0.9px"
                        borderColor={"#253350"}
                        borderRadius="lg"
                        shadow="md"
                        maxW={["md", "md", "lg"]}
                        w="100%"
                        sx={{
                            backdropFilter: "blur(15px)",
                        }}
                    >
                        {status ? (
                            renderStatusContent()
                        ) : (
                            !loading && (
                                <>
                                    <Text
                                        color={"whiteAlpha.800"}
                                        textAlign={"center"} letterSpacing={"2px"} fontSize={["md", "md", "3xl"]} fontWeight={"semibold"} mb="4">
                                        Boost your Business with Morty
                                    </Text>
                                    <Button
                                        fontSize={["md", "md", "xl"]}
                                        h="50px" colorScheme="blue" onClick={() => router.push("/")}>
                                        Take me Home
                                    </Button>
                                    <Spinner />
                                </>
                            )
                        )}
                    </Box>
                </VStack>
            </Center>
        </Box>

    );
};

export default PaymentPage;
