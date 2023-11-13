import {
    CHAIN_ID_ALGORAND,
    ChainId,
    getEmitterAddressAlgorand,
    getEmitterAddressEth,
    isEVMChain,
    parseSequenceFromLogAlgorand,
    parseSequenceFromLogEth,
    transferFromAlgorand,
    transferFromEth,
    transferFromEthNative,
    uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import algosdk from "algosdk";
import { Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { signSendAndConfirmAlgorand } from "@/utils/wormhole/algorand";
import {
    ALGORAND_BRIDGE_ID,
    ALGORAND_HOST,
    ALGORAND_TOKEN_BRIDGE_ID,
    getBridgeAddressForChain,
    getTokenBridgeAddressForChain,

} from "@/utils/wormhole/consts";
import useTransferTargetAddressHex from "./useTransferTargetAddress";
import { getSignedVAAWithRetry } from "@/Wormhole/vaa/vaa";
import { Alert } from "@chakra-ui/react";
import parseError from "@/utils/wormhole/parseError";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";





async function fetchSignedVAA(
    chainId: ChainId,
    emitterAddress: string,
    sequence: string,
    enqueueSnackbar: any,
    setSignedVAAHex: any,
    setIsVAAPending: any
) {


    enqueueSnackbar(null, {
        content: <Alert status="info">Fetching VAA</Alert>,
    });
    const { vaaBytes, isPending } = await getSignedVAAWithRetry(
        chainId,
        emitterAddress,
        sequence
    );

    if (vaaBytes !== undefined) {
        setSignedVAAHex(uint8ArrayToHex(vaaBytes));
        setIsVAAPending(false);
        enqueueSnackbar(null, {
            content: <Alert status="success">Fetched Signed VAA</Alert>,
        });
    } else if (isPending) {
        setIsVAAPending(isPending);
        enqueueSnackbar(null, {
            content: <Alert status="warning">VAA is Pending</Alert>,
        });
    } else {
        throw new Error("Error retrieving VAA info");
    }
}

function handleError(e: any, enqueueSnackbar: any,
    setIsSending: any,
    setIsVAAPending: any
) {

    console.error(e);
    enqueueSnackbar(null, {
        content: <Alert status="error">{parseError(e)}</Alert>,
    });
    setIsSending(false);
    setIsVAAPending(false);
}

async function algo(
    enqueueSnackbar: any,
    senderAddr: string,
    tokenAddress: string,
    decimals: number,
    amount: string,
    recipientChain: ChainId,
    recipientAddress: Uint8Array,
    chainId: ChainId,
    setIsSending: any,
    setTransferTx: any,
    setSignedVAAHex: any,
    setIsVAAPending: any
) {


    setIsSending(true);
    try {
        const baseAmountParsed = parseUnits(amount, decimals);
        const feeParsed = parseUnits("0", decimals);
        const transferAmountParsed = baseAmountParsed.add(feeParsed);

        const algodClient = new algosdk.Algodv2(
            ALGORAND_HOST.algodToken,
            ALGORAND_HOST.algodServer,
            ALGORAND_HOST.algodPort
        );
        const txs = await transferFromAlgorand(
            //@ts-ignore
            algodClient,
            ALGORAND_TOKEN_BRIDGE_ID,
            ALGORAND_BRIDGE_ID,
            senderAddr,
            BigInt(tokenAddress),
            transferAmountParsed.toBigInt(),
            uint8ArrayToHex(recipientAddress),
            recipientChain,
            feeParsed.toBigInt(),
        );
        const result = await signSendAndConfirmAlgorand(algodClient, txs);
        const sequence = parseSequenceFromLogAlgorand(result);

        setTransferTx({
            id: txs[txs.length - 1].tx.txID(),
            block: result["confirmed-round"],
        }
        );
        enqueueSnackbar(null, {
            content: <Alert status="success">Transaction confirmed</Alert>,
        });
        const emitterAddress = getEmitterAddressAlgorand(ALGORAND_TOKEN_BRIDGE_ID);
        await fetchSignedVAA(
            chainId,
            emitterAddress,
            sequence,
            enqueueSnackbar,
            setSignedVAAHex,
            setIsVAAPending
        );
    } catch (e) {
        handleError(e, enqueueSnackbar, setIsSending, setIsVAAPending
        );
    }
}



async function evm(
    enqueueSnackbar: any,
    signer: Signer,
    tokenAddress: string,
    decimals: number,
    amount: string,
    recipientChain: ChainId,
    recipientAddress: Uint8Array,
    isNative: boolean,
    chainId: ChainId,
    setIsSending: any,
    setTransferTx: any,
    setSignedVAAHex: any,
    setIsVAAPending: any
) {

    setIsSending(true);
    try {
        const baseAmountParsed = parseUnits(amount, decimals);
        const feeParsed = parseUnits("0", decimals);
        const transferAmountParsed = baseAmountParsed.add(feeParsed);

        const receipt = isNative
            ? await transferFromEthNative(
                getTokenBridgeAddressForChain(chainId),
                signer,
                transferAmountParsed,
                recipientChain,
                recipientAddress,
                feeParsed,
            )
            : await transferFromEth(
                getTokenBridgeAddressForChain(chainId),
                signer,
                tokenAddress,
                transferAmountParsed,
                recipientChain,
                recipientAddress,
                feeParsed
            );
        setTransferTx({ id: receipt.transactionHash, block: receipt.blockNumber })

        enqueueSnackbar(null, {
            content: <Alert status="success">Transaction confirmed</Alert>,
        });
        const sequence = parseSequenceFromLogEth(
            receipt,
            getBridgeAddressForChain(chainId)
        );
        const emitterAddress = getEmitterAddressEth(
            getTokenBridgeAddressForChain(chainId)
        );
        await fetchSignedVAA(
            chainId,
            emitterAddress,
            sequence,
            enqueueSnackbar,
            setSignedVAAHex,
            setIsVAAPending
        );
    } catch (e) {
        handleError(e, enqueueSnackbar, setIsSending,
            setIsVAAPending);
    }
}



export function useHandleTransfer(
    { sourceChain,
        originChain,
        originAsset,
        amount,
        targetChain,
        isSending,
        sourceParsedTokenAccount,
        setIsSending,
        setTransferTx,
        setSignedVAAHex,
        setIsVAAPending

    }: any
) {

    const { enqueueSnackbar } = useSnackbar();


    const targetAddress = useTransferTargetAddressHex();
    const isTargetComplete = false; //move to state
    const isSendComplete = false;
    const { signer } = useEthereumProvider();
    const { account: algoAccounts } = useRelayContext();
    const decimals = sourceParsedTokenAccount?.decimals;
    const isNative = sourceParsedTokenAccount?.isNativeAsset || false;
    const disabled = isSending || isSendComplete;
    const sourceAsset = originAsset.originAsset || undefined;

    const handleTransferClick = useCallback(() => {
        // TODO: we should separate state for transaction vs fetching vaa

        console.log("source asset for sending", {
            signer,
            sourceAsset,
            decimals,
            amount,
            targetChain,
            targetAddress,
            isNative,
            sourceChain
        })


        if (
            isEVMChain(sourceChain) &&
            !!signer &&
            sourceAsset &&
            decimals !== undefined &&
            targetAddress

        ) {

            evm(
                enqueueSnackbar,
                signer,
                sourceAsset,
                decimals,
                amount,
                targetChain,
                targetAddress,
                isNative,
                sourceChain as ChainId,
                setIsSending,
                setTransferTx,
                setSignedVAAHex,
                setIsVAAPending
            );
        } else if (
            sourceChain === CHAIN_ID_ALGORAND &&
            algoAccounts &&
            !!sourceAsset &&
            decimals !== undefined &&
            !!targetAddress
        ) {



            // algo(
            //     enqueueSnackbar,
            //     algoAccounts.addr,
            //     sourceAsset,
            //     decimals,
            //     amount,
            //     targetChain,
            //     targetAddress,
            //     sourceChain,
            // );
        }
    }, [
        enqueueSnackbar,
        sourceChain,
        signer,
        sourceAsset,
        amount,
        decimals,
        targetChain,
        targetAddress,
        sourceAsset,
        originChain,
        isNative,
        algoAccounts,
    ]);
    return {
        handleClick: handleTransferClick,
        disabled,
        showLoader: isSending,
    }

}
