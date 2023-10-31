
import Lottie from "lottie-react";
import galaxyAnimation from "../components/Animations/galaxy.json";
import { Box } from "@chakra-ui/react";

export const BackDrop = () => {
    return (
        <>

            <Box
                bg="#09162e"
                zIndex={0}
                minH="100vH"
                position="fixed"
                bottom={0}
                w="100%"

            />


        </>
    )
}