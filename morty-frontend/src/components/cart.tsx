import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { FaChartBar } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";

export default function Cart() {
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

          <Box>
            <Box
              py={6}
              bg="#182942"
              sx={{
                backdropFilter: " saturate(140%)",
              }}
              textAlign={"center"}
              px={2}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius={"15px"}
            >
              <Text fontSize={"md"} fontWeight={"bold"}>
                Get Started By Connecting your Wallet
              </Text>
              <Text fontSize={"xs"} color={"whiteAlpha.600"} py={2}>
                Discover new limits and more features by connecting your algo
                wallet.
              </Text>
              <VStack>
                <Button colorScheme="blue">Login </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </VStack>
    </>
  );
}
