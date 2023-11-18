import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import { getShopsByOid } from "@/libs/shops";
import {
  Box,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CreateShopButton from "./CreateShopButton";

interface Shop {
  description: string;
  name: string;
  oid: string;
  products: string[];
}

const HomePage: React.FC = () => {
  const toast = useToast();

  const { organizations }: any = useWeb3AuthProvider();
  const [shops, setShops] = useState<Shop[]>([]);

  const [host, setHost] = useState("");

  useEffect(() => {
    let hostname = window.location.hostname;
    const hostnameParts = (hostname + "").split(".");
    let mainDomain = hostnameParts[hostnameParts.length - 1];
    const port = window.location.port;
    const newHost = port ? `.${mainDomain}:${port}` : `.${mainDomain}`;
    setHost(newHost);
  }, []);

  useEffect(() => {
    // get shop by OID
    const myCallback = (error: string, shops?: any[]) => {
      if (error) {
        toast({
          status: "error",
          description: error,
        });
      } else {
        setShops(shops || []);
      }
    };

    organizations && getShopsByOid(organizations[0]?.oid, myCallback);
  }, [organizations && organizations[0]]);

  return (
    <Box pt={32} px={[3, 3, 3, 20]}>
      {/* Top Banner */}
      <Stack
        direction={[
          "column-reverse",
          "column-reverse",
          "column-reverse",
          "row",
        ]}
        mb={5}
        w="100%"
        justifyContent={["center", "center", "center", "space-around"]}
        h={["fit-content", "fit-content", "fit-content", "300px"]}
        spacing={[0, 0, 0, 8]}
        bg="#132036"
        mt={[12, 12, 12, 0]}
        pb={[12, 12, 12, 18]}
        pt={[0, 0, 0, 18]}
        color="white"
      >
        <Center>
          <Box
            pt={[0, 0, 0, 8]}
            h="100%"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            px={3}
          >
            <Box h="100%" fontSize={["md", "md", "md", "2xl"]}>
              <Box fontWeight={"semibold"} as="h1">
                Keep the income flowing!
              </Box>

              <br />
              <Text fontSize={["sm", "sm", "sm", "md"]}>
                Host your website for free with Morty and start accepting
                payments in form of Assets.
              </Text>
            </Box>
          </Box>
        </Center>

        <Box>
          <Box h="250px" as="img" src="/oShop.svg" />
        </Box>
      </Stack>

      {/* Shop Grid */}
      <SimpleGrid columns={[1, 2, 3]} spacing={4} p={4}>
        <Flex
          as="button"
          maxW="250px"
          h={["fit-content", "fit-content", "fit-content", "250"]}
          align="center"
          justify="center"
          bg="#182942"
          p={8}
          borderRadius="md"
        >
          <Box>
            <CreateShopButton setShops={setShops} />
          </Box>
        </Flex>

        {shops.map(({ name, description }, i) => {
          return (
            <Flex
              key={i}
              as="a"
              href={`${
                process.env.NODE_ENV === "production"
                  ? `https://${name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                  : `http://${name}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
              }`}
              target="_blank"
              maxW="250px"
              h={["fit-content", "fit-content", "fit-content", "250"]}
              bg="#182942"
              alignItems={"center"}
              justifyContent={"center"}
              p={8}
              borderRadius="md"
            >
              <VStack align="center">
                <Heading as="h2" fontSize="xl" mb={2}>
                  {name}
                </Heading>
                <Text textAlign="center">{description}</Text>
              </VStack>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;
