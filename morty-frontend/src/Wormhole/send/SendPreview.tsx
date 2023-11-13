import { Box, Text } from "@chakra-ui/react";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { ShowTx } from "@/Wormhole/core";




export default function SendPreview() {

    const { sourceChain, transferTx }: any = useWormholeContext()

    const explainerString = "The tokens have entered the bridge!";

    return (
        <Box
            px={3}
        >
            {transferTx && (
                <Text variant="subtitle2">
                    {explainerString}
                </Text>

            )}
            {transferTx ? <ShowTx chainId={sourceChain} tx={transferTx} /> : null}
        </Box>
    );
}
