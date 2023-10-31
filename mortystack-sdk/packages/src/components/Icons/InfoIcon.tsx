import React from 'react';
import { Box } from "@chakra-ui/react"

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <Box
            w="auto"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="11" fill="blue" strokeWidth="2" />
                <text x="12" y="16" fontSize="14" fill='white' color='white' textAnchor="middle">?</text>
            </svg>
        </Box>
    );
};

export default InfoIcon;
