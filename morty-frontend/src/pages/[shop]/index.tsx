import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Cart from "@/components/cart";
import ShopLayout from "@/layout/ShopLayout";
import { getShop } from "@/libs/shops";
import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export const getShopPromise = (shopId: string) => {
  return new Promise((resolve, reject) => {
    getShop(shopId, (error, shop) => {
      if (error) {
        reject(error);
      } else {
        resolve(shop);
      }
    });
  });
};

export const getServerSideProps: GetServerSideProps<{
  shop: any;
}> = async ({ req }) => {
  const subdomain = req.headers.host?.split(".")[0];

  if (typeof subdomain === "string") {
    try {
      const shop = await getShopPromise(subdomain);
      return {
        props: {
          shop,
        },
      };
    } catch (error) {
      return {
        notFound: true,
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

const HomePage = ({
  shop,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [shopState, setShopState] = useState(shop);
  const toast = useToast();

  return (
    <ShopLayout>
      <Box w="100%">
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
                  Welcome to {shop.name} shop
                </Box>

                <br />
                <Text fontSize={["sm", "sm", "sm", "md"]}>
                  {shopState?.description}
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
          {shopState?.products?.map((item: any, i: number) => (
            <Box
              key={i}
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
              <Text>{item.description}</Text>
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
