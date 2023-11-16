import { Box, HStack } from "@chakra-ui/react";

export default function ShopLayout({ children }: any) {
  return (
    <Box color="white" w="100%" bg="#101827">
      <HStack
        gap={8}
        px={[0, 0, 12]}
        alignItems={"start"}
        h="100vh"
        overflowY={"scroll"}
      >
        {children}
      </HStack>
    </Box>
  );
}
