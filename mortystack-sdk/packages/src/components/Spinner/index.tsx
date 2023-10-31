import React from "react";
import Lottie from "lottie-react";
import { SpinnerRender } from "./SpinnerRender";
import { Box } from "@chakra-ui/react"


const Spinner = () => {

    return (
        <SpinnerRender>
            {({ widget }) => (
                <Box>
                    {widget}
                </Box>
            )}
        </SpinnerRender>
    );
};

export default Spinner;
