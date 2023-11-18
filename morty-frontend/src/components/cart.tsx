import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useWallet } from "@txnlab/use-wallet";
import { FaChartBar } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";

export default function Cart() {
  const { activeAddress, providers } = useWallet();

  return (
    <>
      <VStack color={"white"} w="100%" pt={8} pb={8}>
        <Box
          borderRadius={"12px"}
          w="100%"
          h="100%"
          bg="rgba(21, 34, 57, 0.6)"
          border="solid 0.9px #253350"
          sx={{
            backdropFilter: "blur(15px) saturate(120%)",
          }}
          py={8}
          px={[2, 2, 6]}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          zIndex={2}
        >
          <Box>
            <Button
              color={"white"}
              leftIcon={<FaChartBar />}
              colorScheme="transparent"
              fontSize={"sm"}
            >
              <Text pl={3}>Invoices</Text>
            </Button>
            <br />
            <br />
            <Button
              color={"white"}
              leftIcon={<MdFlashOn />}
              colorScheme="transparent"
              fontSize={"sm"}
            >
              <Text pl={3}>Integrations</Text>
            </Button>
          </Box>

          <VStack
            borderRadius={"8px"}
            mt={5}
            padding={2}
            w="100%"
            spacing={5}
            bg="#182942"
            sx={{
              backdropFilter: " saturate(140%)",
            }}
          >
            <Text align="center">Admin Login</Text>
            {providers?.map((provider, index) => (
              <Button
                w="max-content"
                h="50px"
                bg={index === 0 ? "black" : "#ffee55"}
                color={index === 0 ? "white" : "black"}
                px={5}
                leftIcon={
                  <Box
                    width={30}
                    height={30}
                    alt={`${provider.metadata.name} icon`}
                    src={provider.metadata.icon}
                    as="img"
                  />
                }
                key={provider.metadata.id}
                type="button"
                onClick={() => {
                  if (!activeAddress) {
                    provider.connect();
                  }
                }}
                disabled={provider.isConnected}
              >
                Connect {provider.metadata.name}
              </Button>
            ))}
          </VStack>
        </Box>
      </VStack>
    </>
  );
}
