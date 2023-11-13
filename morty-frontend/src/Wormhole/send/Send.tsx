import { useCallback, useMemo, useState } from "react";
import { Alert, Box, Button, Checkbox, Divider, FormLabel, useColorMode } from "@chakra-ui/react";
import { ChainId, isEVMChain, } from "@certusone/wormhole-sdk";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import useAllowance from "@/hooks/wormhole/useAllowance";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import { useHandleTransfer } from "@/hooks/wormhole/useHandleTransfer";
import { CHAINS_BY_ID } from "@/utils/wormhole/consts";
import { ShowTx, TransactionProgress, KeyAndBalance, WaitingForWalletMessage } from "@/Wormhole/core";
import PendingVAAWarning from "../vaa/PendingVAAWarning";
import SendConfirmationDialog from "./SendConfirmationDialog";





function Send() {
    const { colorMode } = useColorMode();
    const { reset, sourceChain, sourceAsset, amount, sourceParsedTokenAccount,
        targetChain, originAsset, originChain,
        transferTx, isSending, isVAAPending, sourceWalletAddress, setIsSending,
        setTransferTx, setSignedVAAHex,
        setIsVAAPending
    }: any = useWormholeContext()

    const { handleClick, disabled, showLoader } = useHandleTransfer({
        sourceChain,
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
    }
    );
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const handleTransferClick = useCallback(() => {
        setIsConfirmOpen(true);
    }, []);
    const handleConfirmClick = useCallback(() => {
        handleClick();
        setIsConfirmOpen(false);
    }, [handleClick]);
    const handleConfirmClose = useCallback(() => {
        setIsConfirmOpen(false);
    }, []);
    const handleResetClick = useCallback(() => {
        reset();
    }, []);

    const sourceAmount = amount;
    const sourceDecimals = sourceParsedTokenAccount?.decimals;
    const sourceIsNative = sourceParsedTokenAccount?.isNativeAsset;
    const baseAmountParsed =
        sourceDecimals !== undefined &&
        sourceDecimals !== null &&
        sourceAmount &&
        parseUnits(sourceAmount, sourceDecimals);
    const feeParsed =
        sourceDecimals !== undefined
            ? parseUnits("0", sourceDecimals)
            : 0;
    const transferAmountParsed =
        baseAmountParsed && baseAmountParsed.add(feeParsed).toBigInt();
    const humanReadableTransferAmount =
        sourceDecimals !== undefined &&
        sourceDecimals !== null &&
        transferAmountParsed &&
        formatUnits(transferAmountParsed, sourceDecimals);
    const oneParsed =
        sourceDecimals !== undefined &&
        sourceDecimals !== null &&
        parseUnits("1", sourceDecimals).toBigInt();
    const isSendComplete = isSending;
    const error = "";
    const [allowanceError, setAllowanceError] = useState("");

    const { isReady, statusMessage, walletAddress } =
        useIsWalletReady(sourceChain);

    //The chain ID compare is handled implicitly, as the isWalletReady hook should report !isReady if the wallet is on the wrong chain.
    const isWrongWallet =
        sourceWalletAddress &&
        walletAddress &&
        sourceWalletAddress !== walletAddress;
    const [shouldApproveUnlimited, setShouldApproveUnlimited] = useState(false);
    const toggleShouldApproveUnlimited = useCallback(
        () => setShouldApproveUnlimited(!shouldApproveUnlimited),
        [shouldApproveUnlimited]
    );

    const {
        sufficientAllowance,
        isAllowanceFetching,
        isApproveProcessing,
        approveAmount,
    } = useAllowance(
        sourceChain,
        sourceAsset,
        transferAmountParsed || undefined,
        sourceIsNative
    );

    const approveButtonNeeded = isEVMChain(sourceChain) && !sufficientAllowance;
    const notOne = shouldApproveUnlimited || transferAmountParsed !== oneParsed;
    const isDisabled =
        !isReady ||
        isWrongWallet ||
        disabled ||
        isAllowanceFetching ||
        isApproveProcessing;
    const errorMessage = isWrongWallet
        ? "A different wallet is connected than in Step 1."
        : statusMessage || error || allowanceError || undefined;



    const approveExactAmount = useMemo(() => {
        return () => {
            setAllowanceError("");
            approveAmount(BigInt(transferAmountParsed)).then(
                () => {
                    setAllowanceError("");
                },
                (error) => setAllowanceError("Failed to approve the token transfer.")
            );
        };
    }, [approveAmount, transferAmountParsed]);
    const approveUnlimited = useMemo(() => {
        return () => {
            setAllowanceError("");
            approveAmount(ethers.constants.MaxUint256.toBigInt()).then(
                () => {
                    setAllowanceError("");
                },
                (error) => setAllowanceError("Failed to approve the token transfer.")
            );
        };
    }, [approveAmount]);

    return (
        <Box

            w="100%">

            <Box py={2}>
                <KeyAndBalance chainId={sourceChain} />
            </Box>


            <Divider />

            <Box
                pt={5}
                mt={3}
                mb={3}
                fontSize={"xs"}
                color="white"
            >
                This will initiate the transfer on {CHAINS_BY_ID[sourceChain as ChainId].name} and
                wait for finalization. Please do not close or navigate away from this Page
            </Box>



            {approveButtonNeeded ? (
                <Box w="100%">
                    <FormLabel
                        display="flex"
                        alignItems="center"
                        mb={2}
                    >
                        <Checkbox
                            checked={shouldApproveUnlimited}
                            onChange={toggleShouldApproveUnlimited}
                            color="primary"
                        />
                        <span> Approve Unlimited Tokens</span>
                    </FormLabel>

                    <Button
                        w="100%"
                        isDisabled={isDisabled}
                        onClick={
                            shouldApproveUnlimited ? approveUnlimited : approveExactAmount
                        }
                        isLoading={isAllowanceFetching || isApproveProcessing}
                        onError={() => errorMessage}
                    >
                        {"Approve " +
                            (shouldApproveUnlimited
                                ? "Unlimited"
                                : humanReadableTransferAmount
                                    ? humanReadableTransferAmount
                                    : sourceAmount) +
                            ` Token${notOne ? "s" : ""}`}
                    </Button>
                </Box>
            ) : (
                <Box w="100%">
                    <Button
                        w="100%"
                        isDisabled={isDisabled}
                        onClick={handleTransferClick}
                        isLoading={showLoader && !isVAAPending}
                        onError={() => errorMessage}
                    >
                        Transfer
                    </Button>
                    <SendConfirmationDialog
                        open={isConfirmOpen}
                        onClick={handleConfirmClick}
                        onClose={handleConfirmClose}
                    />
                </Box>
            )}

            <WaitingForWalletMessage />
            {transferTx ? <ShowTx chainId={sourceChain} tx={transferTx} /> : null}

            <br />
            <TransactionProgress
                chainId={sourceChain}
                tx={transferTx}
                isSendComplete={isVAAPending}
            />
            {isVAAPending ? (
                <>
                    <PendingVAAWarning sourceChain={sourceChain} />
                    <Button onClick={handleResetClick}>
                        Transfer More Tokens!
                    </Button>
                </>
            ) : null}
        </Box>
    );
}

export default Send;
