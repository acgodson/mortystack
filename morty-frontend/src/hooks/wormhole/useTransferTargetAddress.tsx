import { useMemo } from "react";

import { hexToUint8Array } from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";


export default function useTransferTargetAddressHex() {
    const { targetAddressHex }: any = useWormholeContext()

    const targetAddress = useMemo(
        () => (targetAddressHex ? hexToUint8Array(targetAddressHex) : undefined),
        [targetAddressHex]
    );
    return targetAddress;
}
