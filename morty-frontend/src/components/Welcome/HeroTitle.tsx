
import { Box, Heading, VStack, Divider, Text, Stack, Button } from '@chakra-ui/react'
import { FaExternalLinkAlt } from 'react-icons/fa'


export default function HeroTitle({ title, subtitle }: any) {
    return (
        <>
            <Stack h="80vh"
                // borderBottom={"2px solid white"}
                px={32}
                direction={["column", "column", "row"]}
                justifyContent={"center"}
                alignItems={"center"}>
                <Box>
                    <Heading
                        fontSize={["lg", "lg", "6xl"]}
                        letterSpacing={"1.8px"}
                        maxW={["100%", "100%", "60%"]}> {title}</Heading>
                </Box>
                <Box
                    fontSize={["md", "md", "2xl"]}
                    px={3}
                    maxW={"400px"}
                    textAlign={"center"}
                >
                    <Text
                        pb={3}
                        color={"whiteAlpha.600"}
                    > {subtitle} </Text>
                    <Button
                        h={["45px", "45px", "50px"]}
                        rightIcon={<FaExternalLinkAlt />}
                    >Documentation</Button>

                </Box>

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
