import { Link } from "@chakra-ui/next-js";
import { Box, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
    const twitterLink = "https://twitter.com/mortystack";
    const youtubeLink = "https://www.youtube.com/mortystack";
    const githubLink = "https://github.com/mortystack";
    const documentationLink = "https://developer.mortstack.com/docs";

    return (
        <Box

            mt={24}
            bg="gray.800" color="white" py={8}>
            <Flex justify="space-around" align="center" direction={{ base: "column", md: "column", xl: "row" }}>
                <Box px={3}>

                    <br />

                    <Box
                        maxW="500px"
                        w="100%"
                        textAlign={"center"}
                        fontSize="md" mt={2}>
                        Thank you for visiting our website. We invite you to explore MortyStack and share it with your  friends.
                        <Box as="span">
                            [business/founder/freelancer]
                        </Box>

                        <br />
                        <br />
                        <Divider />

                        <br />
                        <br />

                        <Text
                            textAlign={"center"}
                            fontWeight={"bold"}
                            fontSize="sm">Made with ❤️  🇳🇬 & 🇬🇧</Text>

                        <span style={{
                            fontSize: "12px"
                        }}>
                            MortyStack was inspired after <a href=""
                                style={{
                                    color: "lightblue"
                                }}

                            >Morty Wallet's </a> pursuit to integrate blockchain Assets into everyday use. The mortystack MVP was kickstarted during the <a href=""
                                style={{
                                    color: "lightblue"
                                }}
                            >
                                Build-a-Bull hackathon.
                            </a>

                        </span>

                    </Box>
                </Box>

                <Flex
                    bg="blue.400"
                    borderRadius={"15px"}
                    cursor={"pointer"}
                    _hover={{
                        bg: "blue.400"
                    }}
                    px={3}
                    mt={{ base: 4, md: 4, lg: 0 }} align="center">

                    <IconButton
                        as="a"
                        href={twitterLink}
                        target="_blank"
                        aria-label="Twitter"
                        icon={<FaTwitter />}
                        variant="ghost"
                        color="lighblue"
                        fontSize="24px"
                        _hover={{ color: "blue.400" }}
                    />
                    <Text
                        color={"white"}
                        fontWeight={"bold"}
                        fontSize={"sm"}
                        ml={2}>Leave a Comment</Text>
                </Flex>


                <Flex mt={{ base: 4, md: 4, lg: 0 }} align="center">
                    <Link href={youtubeLink} target="_blank" _hover={{ textDecor: "none" }}>
                        <IconButton
                            aria-label="YouTube"
                            icon={<FaYoutube />}
                            variant="ghost"
                            color="white"
                            fontSize="24px"
                            _hover={{ color: "red.400" }}
                        />
                    </Link>
                    <Link href={githubLink} target="_blank" ml={4} _hover={{ textDecor: "none" }}>
                        <IconButton
                            aria-label="GitHub"
                            icon={<FaGithub />}
                            variant="ghost"
                            color="white"
                            fontSize="24px"
                            _hover={{ color: "gray.400" }}
                        />
                    </Link>
                    <Link href={documentationLink} target="_blank" ml={4} _hover={{ textDecor: "none" }}>
                        <Text fontSize="sm" _hover={{ color: "lightblue" }}>
                            Documentation
                        </Text>
                    </Link>
                </Flex>

            </Flex >
        </Box >
    );
};

export default Footer;
