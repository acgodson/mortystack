import React from 'react';
import { Box, Center, Text, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';



const featureData = [
    {
        color: 'red',
        caption: 'Feature 1',
        details: 'Integrate Morty once and let your customers pay your however they want.',
    },
    {
        color: 'green',
        caption: 'Feature 2: Insurance',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget risus porta, tincidunt turpis at, interdum nunc.',
    },

];


const AnimatedLandingPage: React.FC = () => {
    return (
        <Box height="100vh" width="100vw">
            <Flex direction="column" align="center" justify="center" height="100%" width="100%">
                <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{
                    delay: 1.5,
                    duration: 1.6
                }}>
                    <Text fontSize="3xl">Welcome to our Website</Text>
                    <Text fontSize="xl" fontWeight="bold">
                        Let's begin, shall we
                    </Text>
                </motion.div>
                <Box
                    w="100%"
                    position="absolute" top="30%" left="50%" transform="translate(-50%, -50%)">
                    <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 1.8 }}>
                        {/* Circle images */}
                        {/* Circle 1 */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, scale: 0 }} // Initial animation state
                            animate={{ opacity: 1, scale: 1 }} // Animation when in view
                            transition={{ delay: 1., duration: 1.8 }}
                        >
                            <Box
                                rounded={"full"}
                                mt={48}
                                h="250px"
                                w="250px" _hover={{
                                    cursor: 'pointer',

                                }}
                                sx={{ background: 'red', position: 'absolute', top: '10%', left: '10%', }}
                            >
                                {/* Interactive caption */}
                                <motion.div
                                    whileHover={{ opacity: 1 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '-40px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        textAlign: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {featureData[0].caption}
                                </motion.div>
                            </Box>
                        </motion.div>

                        {/* Circle 2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.6, duration: 1.8 }}
                        >
                            <Box
                                mt={48}
                                rounded={"full"}
                                h="80px"
                                sx={{ background: 'green', position: 'absolute', top: '10%', right: '10%', width: '80px' }}
                            />
                        </motion.div>

                        {/* Circle 3 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.6, duration: 1.8 }}
                        >
                            <Box
                                rounded={"full"}
                                mt={48}
                                h="70px"
                                sx={{ background: 'blue', position: 'absolute', bottom: '10%', left: '10%', width: '70px' }}
                            />
                        </motion.div>

                        {/* Circle 4 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.6, duration: 1.8 }}
                        >
                            <Box
                                rounded={"full"}
                                mt={48}
                                h="60px"
                                w="60px"
                                sx={{ background: 'orange', position: 'absolute', bottom: '10%', right: '10%', width: '60px' }}
                            />
                        </motion.div>

                    </motion.div>
                </Box>
            </Flex >
        </Box >
    );
};

export default AnimatedLandingPage;
