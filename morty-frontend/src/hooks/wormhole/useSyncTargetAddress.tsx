import { useEffect } from "react";
import {
    CHAIN_ID_ALGORAND,
    isEVMChain,
    uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { decodeAddress } from "algosdk";
import { arrayify, zeroPad } from "@ethersproject/bytes";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";



function useSyncTargetAddress(shouldFire: boolean) {

    const { targetChain, setTargetAddressHex }: any = useWormholeContext()

    const { signerAddress } = useEthereumProvider();
    const { account: algoAccount } = useRelayContext();

    useEffect(() => {

        if (shouldFire) {
            console.log(shouldFire, targetChain);
            let cancelled = false;
            if (isEVMChain(targetChain) && signerAddress) {
                setTargetAddressHex(
                    uint8ArrayToHex(zeroPad(arrayify(signerAddress), 32))
                )
            }
            else if (targetChain === CHAIN_ID_ALGORAND && algoAccount) {
                setTargetAddressHex(
                    uint8ArrayToHex(decodeAddress(algoAccount!.addr).publicKey))
                return () => {
                    cancelled = true;
                };
            }
        }
    });

}

export default useSyncTargetAddress;
