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
                px={32}
                mt={[8, 8, 16]} py={3}>


                {features.map((feature: any, index: number) => (
                    <Flex
                        // w="100%"
                        key={index}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        direction={{ base: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                        width="100%"
                        mb={8}
                    >
                        <Box width={{ base: '100%', md: '50%' }} pr={{ md: index % 2 === 0 ? 4 : 0 }}>
                            <Heading
                                fontSize={["lg", "lg", "4xl"]}
                                color="lightpink" letterSpacing={"1.3px"} fontWeight="semibold" mb={1}>
                                {feature.title}
                            </Heading>
                            <Text mb={4}
                                fontSize={["md", "md", "2xl"]}
                            >{feature.subtitle.length > 1 ? feature.subtitle :
                                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, nihil. Sed ut omnis consequatur ab molestiae fugit esse ratione voluptatem ex mollitia. Impedit delectus laboriosam repudiandae cupiditate quos! Accusantium, veniam?"
                                }</Text>
                            {index === 0 && (
                                <PaymentMethods />
                            )}
                            {index === 1 && (
                                <>
                                    <Stack spacing={3} direction={["column", "column", "row"]} textAlign="left" justify={"flex-start"} w="100%" maxW="300px">
                                        <Box bg="#152036" px={4} py={3} borderRadius="8px">
                                            <Text fontSize={"lg"} fontWeight={"semibold"}>Value Tokens</Text>
                                            <Text color="whiteAlpha.800" fontSize={"xs"}>Reward customers with exclusive or redeemable tokens for successful purchase.</Text>
                                        </Box>

                                        <Box bg="#152036" px={4} py={3} borderRadius="8px">
                                            <Text fontSize={"lg"} fontWeight={"semibold"}>Receipts</Text>
                                            <Text color="whiteAlpha.800" fontSize={"xs"}>Reward customers with exclusive or redeemable tokens for successful purchase.</Text>
                                        </Box>
                                    </Stack>
                                </>
                            )}

                        </Box>

                        <Box
                            border={"solid 0.9px #253350"}
                            maxW="40%"
                            h="500px"
                            borderRadius={["15px", "15px", "25px"]}
                            width={{ base: '100%', md: '50%', lg: "100%" }} bg="#152036">
                            {/* <Image src={feature.image} alt={feature.title} /> */}
                        </Box>



                    </Flex>
                ))}


                <Box right={0}
                    py={12}
                    borderBottom={"1px solid white"}
                    position={"absolute"} w="100%"
                    maxW={"60%"}

                >

                </Box>
            </Box >

        </>




    );
};

export default FeaturesComponent;
