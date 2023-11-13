import {
    CHAIN_ID_ALGORAND,
    ChainId,
    isEVMChain,
} from "@certusone/wormhole-sdk";
import { hexStripZeros, hexlify } from "@ethersproject/bytes";
import { useCallback, useMemo } from "react";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { CLUSTER, getEvmChainId } from "@/utils/wormhole/consts";
import { METAMASK_CHAIN_PARAMETERS, EVM_RPC_MAP } from "@/utils/wormhole/metamaskChainParameters";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";




const createWalletStatus = (
    isReady: boolean,
    statusMessage: string = "",
    forceNetworkSwitch: () => void,
    walletAddress?: string
) => ({
    isReady,
    statusMessage,
    forceNetworkSwitch,
    walletAddress,
});

function useIsWalletReady(
    chainId: ChainId,
    enableNetworkAutoswitch: boolean = true
): {
    isReady: boolean;
    statusMessage: string;
    walletAddress?: string;
    forceNetworkSwitch: () => void;
} {
    const autoSwitch = enableNetworkAutoswitch;
    const {
        provider,
        signerAddress,
        chainId: evmChainId,
        connectType,
        disconnect,
    } = useEthereumProvider();
    const hasEthInfo = !!provider && !!signerAddress;
    const correctEvmNetwork = getEvmChainId(chainId);
    const hasCorrectEvmNetwork = evmChainId === correctEvmNetwork;
    const { account: algorandAccounts } = useRelayContext();
    const algoPK = algorandAccounts?.addr;


    const forceNetworkSwitch = useCallback(async () => {
        if (provider && correctEvmNetwork) {
            if (!isEVMChain(chainId)) {
                return;
            }
            try {
                await provider.send("wallet_switchEthereumChain", [
                    { chainId: hexStripZeros(hexlify(correctEvmNetwork)) },
                ]);
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    const addChainParameter =
                        METAMASK_CHAIN_PARAMETERS[correctEvmNetwork];
                    if (addChainParameter !== undefined) {
                        try {
                            await provider.send("wallet_addEthereumChain", [
                                addChainParameter,
                            ]);
                        } catch (addError) {
                            console.error(addError);
                        }
                    }
                }
            }
        }
    }, [provider, correctEvmNetwork, chainId, connectType, disconnect]);

    return useMemo(() => {

        if (chainId === CHAIN_ID_ALGORAND && algoPK) {
            return createWalletStatus(true, undefined, forceNetworkSwitch, algoPK);
        }

        if (isEVMChain(chainId) && hasEthInfo && signerAddress) {
            if (hasCorrectEvmNetwork) {
                return createWalletStatus(
                    true,
                    undefined,
                    forceNetworkSwitch,
                    signerAddress
                );
            } else {
                if (provider && correctEvmNetwork && autoSwitch) {
                    forceNetworkSwitch();
                }
                return createWalletStatus(
                    false,
                    `Wallet is not connected to ${CLUSTER}. Expected Chain ID: ${correctEvmNetwork}`,
                    forceNetworkSwitch,
                    undefined
                );
            }
        }

        return createWalletStatus(
            false,
            "Wallet not connected",
            forceNetworkSwitch,
            undefined
        );
    }, [
        chainId,
        autoSwitch,
        forceNetworkSwitch,
        hasEthInfo,
        correctEvmNetwork,
        hasCorrectEvmNetwork,
        provider,
        signerAddress,
        algoPK,
    ]);
}

export default useIsWalletReady;
