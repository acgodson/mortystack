
import { Box, Heading, VStack, Divider, Text, Stack, Button } from '@chakra-ui/react'
import { FaExternalLinkAlt } from 'react-icons/fa'


export default function HeroTitle({ title, subtitle }: any) {
    return (
        <>
            <Stack h="90vh"
                // borderBottom={"2px solid white"}
                px={[3, 3, 3, 32]}
                direction={["column", "column", "column", "row"]}
                justifyContent={"center"}
                alignItems={"center"}>
                <Box w="100%"

                    h={["fit-content", "fit-content", "fit-content", "100%"]}
                    display={"flex"}
                    flexDirection={["column-reverse", 'column-reverse', 'column-reverse', 'column']}
                    justifyContent={["space-around", "space-around", "space-around", "space-evenly"]}
                >
                    <Heading
                        textAlign={["left", "left", "center", "left"]}
                        fontSize={["2xl", "2xl", "4xl", "6xl"]}
                        letterSpacing={"1.8px"}
                        // fontWeight={400}
                        fontFamily={"CustomFontRegular"}
                        maxW={["100%", "100%", "100%", "75%"]}> {title}</Heading>
                    <Box>
                        <Box
                            h={["30px", "30px", "45px"]}
                            w="auto"
                            as="img"
                            src="/icons/mortystack-white.png"
                            pr={0.6}
                        />
                    </Box>
                </Box>


                <Box
                    fontSize={["md", "md", "lg", "2xl"]}
                    px={[0, 0, 0, 3]}
                    maxW={"400px"}
                    textAlign={["left", "left", "center", "center"]}
                >
                    <Text
                        pb={3}
                        color={"#a6a6ee"}
                    > {subtitle} </Text>
                    <Button
                        h={["45px", "45px", "50px"]}
                        as="a"
                        href="https://docs.mortystack.xyz/"
                        rightIcon={<FaExternalLinkAlt />}
                    >Documentation</Button>

                </Box>

                {/*                 
                <Box
                    fontSize={["md", "md", "lg", "2xl"]}
                    px={[0, 0, 0, 3]}
                    maxW={"400px"}
                    textAlign={["left", "left", "center", "center"]}
                >
                    <Text
                        pb={3}
                        color={"whiteAlpha.600"}
                    > {subtitle} </Text>
                    <Button
                        h={["45px", "45px", "50px"]}
                        rightIcon={<FaExternalLinkAlt />}
                    >Documentation</Button>

                </Box> */}

            </Stack>
            <Box left={0} position={"absolute"} w="100%">
                <Divider
                    color={"white"}
                    fontWeight={"bold"}
                    width={"60%"} />
            </Box>

        </>
    )
}
