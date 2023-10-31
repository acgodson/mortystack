import React, { useRef } from 'react';
import {
    Box,
    Flex,
    Heading,
    Select,
    SimpleGrid,
    Text,
    HStack,
} from '@chakra-ui/react';


const HowItWorks = () => {
    const containerRef: any = useRef(null);

    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

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

    return (
        <Box py={10} w="100%">

            <Box pl={32} maxW="30%">
                <Heading
                    letterSpacing={"1px"}
                    fontSize={"5xl"}
                    fontWeight={"semibold"}
                    textAlign="left" mb={8}>

                    <span style={{
                        color: "#659df6"
                    }}>
                        Beginner-friendly <br />
                    </span>

                    Options to Choose from
                </Heading>
                <Select
                    py={5}
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
                // ml={32}
                // pr={32}
                w="100%"
                ref={containerRef}
                overflowX="auto"
                overflowY="hidden"
            // whiteSpace="nowrap"
            >
                <HStack
                    w="100%"
                    marginLeft={64}
                    paddingLeft={12}
                    spacing={8}>
                    {options.map((option, index) => (
                        <Box
                            // marginLeft={32}
                            key={option}
                            className="grid-item" // Assign a unique class name to your grid items
                            // direction="column"
                            // align="center"
                            // justify="center"
                            bg="#152037"
                            h="500px"
                            w="500px"
                            borderRadius="md"
                            p={6}
                        >
                            {/* ... */}
                        </Box>
                    ))}
                </HStack>
            </Box>
        </Box >
    );
};

export default HowItWorks;
