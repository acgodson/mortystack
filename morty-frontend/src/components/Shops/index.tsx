// components/HomePage.js

import { Box, Center, Flex, HStack, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

// const shops = [
//     { id: 1, name: 'Shop 1' },
//     { id: 2, name: 'Shop 2' },
//     // Add more shops as needed
// ];

const HomePage = () => {
    return (
        <Box pt={32} px={[3, 3, 3, 20]}>
            {/* Top Banner */}
            <Stack
                direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
                mb={5}
                w="100%"
                justifyContent={["center", "center", "center", "space-around"]}
                h={["fit-content", "fit-content", "fit-content", "300px"]}
                spacing={[0, 0, 0, 8]}
                bg="#132036"
                mt={[12, 12, 12, 0]}
                pb={[12, 12, 12, 18]}
                pt={[0, 0, 0, 18]}
                color="white">

                <Center >
                    <Box
                        pt={[0, 0, 0, 8]}
                        h="100%"
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        px={3}>
                        <Box
                            h="100%"
                            fontSize={["md", "md", "md", "2xl"]}
                        >
                            <Box
                                fontWeight={"semibold"}
                                as="h1" >
                                Keep the income flowing!
                            </Box>


                            <br />
                            <Text fontSize={["sm", "sm", "sm", "md"]}>
                                Host your website for free with Morty and start accepting tokens.</Text>
                        </Box>
                    </Box>
                </Center>


                <Box>
                    <Box
                        h="250px"
                        as="img" src="/oShop.svg" />
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
                        <Text
                            fontWeight={"bold"}
                            fontSize="3xl">+</Text>
                        <Text
                            color={"whiteAlpha.200"}
                            fontWeight={"bold"}
                            fontSize="md">Create New Shop</Text>
                    </Box>

                </Flex>

                {/* <Box
                    key={shop.id}
                    bg="white"
                    p={4}
                    w="100%"
                    maxW="5˝00px"
                    borderRadius="md"
                    boxShadow="md"
                >
                    <Heading as="h2" fontSize="xl" mb={2}>
                        {shop.name}
                    </Heading>
                    {/* Add more details or links for each shop as needed */}
                {/* <Text>Shop Description or Additional Information</Text>
                </Box>  */}


            </SimpleGrid >
        </Box >
    );
};

export default HomePage;
