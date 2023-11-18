import React, { useRef } from 'react';
import {
    Box,
    Heading,
    Select,
    HStack,
    Text
} from '@chakra-ui/react';


const HowItWorks = () => {
    const containerRef: any = useRef(null);

    const options = ['Morty Button', 'Morty Invoice', 'Morty-fy (Shops)'];

    const handleOptionChange = (index: number) => {
        const scrollWidth = containerRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        const offset = (scrollWidth - containerWidth) / 2;
        const gridItems = document.getElementsByClassName('grid-item');
        const optionElement: any = gridItems[index];

        if (optionElement) {
            const optionOffset = optionElement.offsetLeft - offset;
            containerRef.current.scrollTo({ left: optionOffset, behavior: 'smooth' });
        }
    };

    const images = [
        "/card.svg", "/bro.svg", "/oShop.svg"
    ]

    return (
        <Box py={10} w="100%">

            <Box pl={[3, 3, 3, 32]} maxW={["100%", "100%", "30%"]}>
                <Heading
                    letterSpacing={"1px"}
                    fontSize={["lg", "lg", "3xl", "5xl"]}
                    fontWeight={"semibold"}
                    textAlign="left" mb={8}>

                    <Box as="span" sx={{
                        color: "#659df6"
                    }}>
                        Beginner-friendly <br />
                    </Box>

                    Options to Choose from
                </Heading>
                <Select
                    py={[3, 3, 3, 5]}
                    mb={4}
                    onChange={(e: any) => handleOptionChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select an Option
                    </option>
                    {options.map((option, index) => (
                        <option key={option} value={index}>
                            {option}
                        </option>
                    ))}
                </Select>
            </Box>

            <Box

                w="100%"
                ref={containerRef}
                overflowX="auto"
                overflowY="hidden"
            // whiteSpace="nowrap"
            >
                <HStack
                    w="100%"
                    marginLeft={24}
                    paddingLeft={12}
                    spacing={8}>
                    {options.map((option, index) => (
                        <Box
                            border="1px solid #4f4fde"
                            background="#132036"
                            key={option}
                            // as="img"
                            bg={`url(${images[index]})`}
                            bgRepeat={"no-repeat"}
                            bgPosition={"center"}
                            bgSize={"cover"}
                            h={["250px", "250px", "500px"]}
                            w={["100%", "100%", "500px"]}
                            borderRadius="md"
                            p={6}
                        >
                            <Text
                                fontWeight={"bold"}
                                fontSize={"xl"}
                                textAlign={"center"}
                            >{option}</Text>

                            <Box

                                w="250px" />
                            {/* ... */}
                        </Box>
                    ))}
                </HStack>
            </Box >
        </Box >
    );
};

export default HowItWorks;
