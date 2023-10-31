
import { Box, HStack } from '@chakra-ui/react'


export default function Dashboardlayout({ children }: any) {
    return (
        <Box color="white" h="100%" minH="100vh" pt={[4, 4, 0]}
            px={[0, 0, 12]}
            w="100%"
            bg="#101827"
        >
            <HStack w="100%"
                justifyContent={"left"}
                pt={[1, 1, 8]}
                h="100%"
            >
                {children}

            </HStack>
        </Box>
    )
}
