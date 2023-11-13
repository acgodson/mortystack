import React from 'react';
import { Box, Divider, Flex, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react';
import PaymentMethods from './PaymentMethods';

const FeaturesComponent = ({ features }: any) => {
    return (
        <>
            <Box
                bg="#0f1728"
                position={"relative"}
                w="100%"
                left={0}
                mx={0}
                px={[3, 3, 3, 32]}
                mt={[8, 8, 8, 16]} py={3}>


                {features.map((feature: any, index: number) => (
                    <Stack
                        // w="100%"
                        key={index}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        direction={{ base: 'column-reverse', lg: index % 2 === 0 ? 'row' : 'row-reverse', md: 'column-reverse' }}
                        width="100%"
                        mb={8}
                        display={"flex"}
                        spacing={"lg"}

                    >
                        <Box width={{ base: '100%', md: "100%", lg: '50%' }}
                            pt={[8, 8, 8, 0]}
                            pr={{ lg: index % 2 === 0 ? 4 : 0 }}>
                            <Heading
                                fontSize={["lg", "lg", "4xl"]}
                                fontFamily={"CustomFontPlainRegular"}
                                color="#a6a6ee"
                                letterSpacing={"1.3px"} fontWeight="semibold" mb={1}>
                                {feature.title}
                            </Heading>
                            <Text mb={4}
                                color="#a6a6bb" fontSize={["md", "md", "xl"]}
                            >{feature.subtitle.length > 1 ? feature.subtitle :
                                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, nihil. Sed ut omnis consequatur ab molestiae fugit esse ratione voluptatem ex mollitia. Impedit delectus laboriosam repudiandae cupiditate quos! Accusantium, veniam?"
                                }</Text>
                            {index === 0 && (
                                <PaymentMethods />
                            )}
                            {index === 1 && (
                                <>
                                    <Stack

                                        spacing={3} direction={["column", "column", "row"]} textAlign="left" justify={"flex-start"} w="100%">
                                        <Box bg="#152036" px={4} py={3} borderRadius="8px">
                                            <Text fontSize={["lg", "lg", "lg", "xl"]}
                                                color="#4f4fde"
                                                fontWeight={"semibold"}>Value Tokens</Text>
                                            <Text color="whiteAlpha.800" fontSize={["xs", "xs", "xs", "md"]}>Reward customers with exclusive or redeemable tokens for successful purchase.</Text>
                                        </Box>

                                        <Box bg="#152036" px={4} py={3} borderRadius="8px">
                                            <Text
                                                color="#4f4fde"
                                                fontSize={["lg", "lg", "lg", "xl"]} fontWeight={"semibold"}>Receipts</Text>
                                            <Text color="whiteAlpha.800" fontSize={["xs", "xs", "xs", "md"]}>Reward customers with exclusive or redeemable tokens for successful purchase.</Text>
                                        </Box>
                                    </Stack>
                                </>
                            )}

                        </Box>

                        <Box
                            mb={[24, 24, 64, 0]}
                            border={"solid 0.9px #253350"}
                            maxW={["100%", "100%", "100%", "40%"]}
                            h={['250px', "250px", "250px", "fit-content"]}
                            borderRadius={["15px", "15px", "25px"]}
                            width={{ base: '100%', md: '100%', lg: "100%" }}
                            cursor={"pointer"}
                            _hover={{
                                bg: "#152036"
                            }}
                            bg="#152036">
                            {/* <Image src={feature.image} alt={feature.title} /> */}

                            <Box h="100%"
                                w="auto"

                            >
                                <Box
                                    as="img"
                                    src={feature.image}
                                />

                            </Box>

                        </Box>



                    </Stack>
                ))}


                <Box right={0}
                    py={12}
                    borderBottom={"1px solid #262f3c"}
                    position={"absolute"} w="100%"
                    maxW={"60%"}

                />


            </Box >

        </>




    );
};

export default FeaturesComponent;
