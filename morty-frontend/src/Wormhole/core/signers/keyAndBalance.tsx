import {
    ChainId,
    CHAIN_ID_ALGORAND,
    isEVMChain,
} from "@certusone/wormhole-sdk";

import AlgorandWalletKey from "./AlgorandWalletKey";
import EthereumSignerKey from "./EthereumSignerKey";


export function KeyAndBalance({ chainId }: { chainId: ChainId }) {
    if (isEVMChain(chainId)) {
        return <EthereumSignerKey chainId={chainId} />;
    }

    if (chainId === CHAIN_ID_ALGORAND) {
        return <AlgorandWalletKey />;
    }

    return null;
}


