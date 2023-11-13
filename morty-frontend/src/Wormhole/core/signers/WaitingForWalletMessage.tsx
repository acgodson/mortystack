
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { Box } from "@chakra-ui/react";



export const WAITING_FOR_WALLET_AND_CONF =
    "Waiting for wallet approval (likely in a popup) and confirmation...";

export default function WaitingForWalletMessage() {

    const { redeemTx, isRedeeming, targetChain, isApproving, transferTx, isSending }: any = useWormholeContext()

    const showWarning =
        isApproving || (isSending && !transferTx) || (isRedeeming && !redeemTx);
    return showWarning ? (
        <Box>
            {WAITING_FOR_WALLET_AND_CONF}{" "}
            
        </Box>
    ) : null;
}
