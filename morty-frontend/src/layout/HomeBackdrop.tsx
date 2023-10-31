
import Lottie from "lottie-react";
import galaxyAnimation from "../components/Animations/galaxy.json";
import { Box } from "@chakra-ui/react";

export const HomeBackDrop = () => {
    return (
        <>

            <Box minH="100vh"
                h="100%"
                position={"absolute"}
                zIndex="0"

            >


                {/* lottie-animation */}
                <Box>
                    <Box
                        position={"fixed"}
                    > <Lottie animationData={galaxyAnimation} loop={true} /></Box>
                </Box>

            </Box>
            <Box
                bg="#0c162c"
                zIndex={0}
                minH="45vh"
                position="fixed"
                bottom={0}
                w="100%"

            />


        </>
    )
}