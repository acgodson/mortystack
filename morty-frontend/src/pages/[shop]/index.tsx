import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import {
  Box,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import ShopLayout from "@/layout/ShopLayout";
import Cart from "@/components/cart";

const items = [
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  { id: 2, name: "item 2" },
  // Add more items as needed
];

export const getServerSideProps: GetServerSideProps<{
  subdomain: String;
}> = async ({ req }) => {
  const subdomain = req.headers.host?.split(".")[0];

  const allowed = ["kelvx", "mercy", "grace"];

  if (!allowed.includes(subdomain || "")) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      subdomain: subdomain!,
    },
  };
};

const HomePage = ({
  subdomain,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <ShopLayout>
      <Box  w="100%">
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
                  Welcome to {subdomain} shop
                </Box>

                <br />
                <Text fontSize={["sm", "sm", "sm", "md"]}>
                  This will host the description of the shop.
                </Text>
              </Box>
            </Box>
          </Center>

          <Box>
            <Box h="250px" as="img" src="/oShop.svg" />
          </Box>
        </Stack>

        {/* Item Grid */}
        <SimpleGrid columns={[1, 2, 3]} spacing={4} p={4}>
          {items.map((item) => (
            <Box
              key={item.id}
              bg="black"
              p={4}
              w="100%"
              maxW="5˝00px"
              borderRadius="md"
              boxShadow="md"
            >
              <Heading as="h2" fontSize="xl" mb={2}>
                {item.name}
              </Heading>
              Add more details or links for each item as needed
              <Text>item Description or Additional Information</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* desktop */}
      <Box
        display={{ xl: "flex", base: "none" }}
        maxW={"250px"}
        w="100%"
        position={"sticky"}
        top={0}
        h="100vh"
        alignSelf={"flex-start"}
      >
        <Cart />
      </Box>
    </ShopLayout>
  );
};

export default HomePage;
