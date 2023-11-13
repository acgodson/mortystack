import { useState } from "react";
import {
  ChainId,
  CHAIN_ID_ETH,
  CHAIN_ID_ALGORAND,
} from "@certusone/wormhole-sdk";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { DataWrapper } from "@/utils/wormhole/helpers";

export interface Transaction {
  id: string;
  block: number;
}

const LAST_STEP = 3;

type Steps = 0 | 1 | 2 | 3;

export type ForeignAssetInfo = {
  doesExist: boolean;
  address: string | null;
};

export interface TransferState {
  activeStep: Steps;
  sourceChain: ChainId;
  isSourceAssetWormholeWrapped: boolean | undefined;
  originChain: ChainId | undefined;
  originAsset: string | undefined;
  sourceWalletAddress: string | undefined;
  sourceParsedTokenAccount: ParsedTokenAccount | undefined;
  sourceParsedTokenAccounts: DataWrapper<ParsedTokenAccount[]>;
  amount: string;
  targetChain: ChainId;
  targetAddressHex: string | undefined;
  targetAsset: DataWrapper<ForeignAssetInfo>;
  targetParsedTokenAccount: ParsedTokenAccount | undefined;
  transferTx: Transaction | undefined;
  signedVAAHex: string | undefined;
  isSending: boolean;
  isVAAPending: boolean;
  isRedeeming: boolean;
  redeemTx: Transaction | undefined;
  isApproving: boolean;
  isRecovery: boolean;
  gasPrice: number | undefined;
  useRelayer: boolean;
  relayerFee: string | undefined;
}

export function useAttest() {
  const [activeStep, setActiveStep] = useState<Steps>(0);
  const [sourceChain, setSourceChain] = useState<ChainId>(CHAIN_ID_ETH);
  const [sourceAsset, setSourceAsset] = useState<string>();
  const [targetChain, setTargetChain] = useState<ChainId>(CHAIN_ID_ALGORAND);
  const [attestTx, setAttestTx] = useState<Transaction | undefined>();
  const [signedVAAHex, setSignedVAAHex] = useState<string | undefined>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createTx, setCreateTx] = useState<Transaction | undefined>();

  const incrementStep = () => {
    if (activeStep < LAST_STEP) {
      setActiveStep((prevStep) => (prevStep + 1) as Steps);
    }
  };

  const decrementStep = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => (prevStep - 1) as Steps);
    }
  };

  const resetState = () => {
    setActiveStep(0);
    setSourceChain(CHAIN_ID_ETH);
    setSourceAsset("");
    setTargetChain(CHAIN_ID_ALGORAND);
    setAttestTx(undefined);
    setSignedVAAHex(undefined);
    setIsSending(false);
    setIsCreating(false);
    setCreateTx(undefined);
  };

  return {
    activeStep,
    incrementStep,
    decrementStep,
    setStep: setActiveStep,
    sourceChain,
    setSourceChain,
    sourceAsset,
    setSourceAsset,
    targetChain,
    setTargetChain,
    attestTx,
    setAttestTx,
    signedVAAHex,
    setSignedVAAHex,
    isSending,
    setIsSending,
    isCreating,
    setIsCreating,
    createTx,
    setCreateTx,
    resetState,
  };
}
