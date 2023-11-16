import React from "react";
import Lottie from "lottie-react";
import { SpinnerRender } from "./SpinnerRenderer";
import { Box } from "@chakra-ui/react"


const AnimatedSpinner = () => {

    return (
        <SpinnerRender>
            {({ widget } : any) => (
                <Box>
                    {widget}
                </Box>
            )}
        </SpinnerRender>
    );
};

export default AnimatedSpinner;
