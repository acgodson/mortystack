

//user can select a Token from his account or search for the token

import { fetchSingleMetadata } from "@/hooks/wormhole/useAlgoMetadata";
import { ALGORAND_HOST } from "@/utils/wormhole/consts";
import { Algodv2 } from "algosdk";


export async function lookupAlgoToken(address: string) {
    if (!address) {
        return Promise.reject("Wallet not connected");
    }
    const algodClient = new Algodv2(
        ALGORAND_HOST.algodToken,
        ALGORAND_HOST.algodServer,
        ALGORAND_HOST.algodPort
    );

    const list = await fetchSingleMetadata(address, algodClient)
    if (list) {
        console.log(list)
    }

    return [1]
}



