import { useCallback, useEffect, useState } from "react";
import { Center, Text } from "@chakra-ui/react"
import { ChainId } from "@certusone/wormhole-sdk";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import ToggleConnectedButton from "./ToggleConnectedButton";




const EthereumSignerKey = ({ chainId }: { chainId: ChainId }) => {
    const { disconnect, signerAddress, providerError } = useEthereumProvider();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = useCallback(() => {
        setIsDialogOpen(true);
    }, [setIsDialogOpen]);

    const closeDialog = useCallback(() => {
        if (isDialogOpen) setIsDialogOpen(false);
    }, [setIsDialogOpen]);



    return (
        <Center w="100%">
            <ToggleConnectedButton
                disconnect={disconnect}
                connected={!!signerAddress}
                pk={signerAddress || ""}
            />



            {providerError ? (
                <Text variant="body2" color="red">
                    provider error {providerError}
                </Text>
            ) : ""}
        </Center>
    );
};

export default EthereumSignerKey;
