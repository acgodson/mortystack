import { useReducer, useState } from "react";
import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";

import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { StateSafeWormholeWrappedInfo } from "@/hooks/wormhole/useCheckIfWormholeWrapped";
import { getEmptyDataWrapper, DataWrapper } from "@/utils/wormhole/helpers";

export interface Transaction {
  id: string;
  block: number;
}

export type ForeignAssetInfo = {
  doesExist: boolean;
  address: string | null;
};

const LAST_STEP = 3;

type Steps = 0 | 1 | 2 | 3;

interface State {
  activeStep: Steps;
}

type Action =
  | { type: "INCREMENT_STEP" }
  | { type: "DECREMENT_STEP" }
  | { type: "SET_STEP"; payload: Steps };

export function useTransfer() {
  const initialState: State = {
    activeStep: 0,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "INCREMENT_STEP":
        return {
          ...state,
          activeStep:
            state.activeStep < LAST_STEP
              ? ((state.activeStep + 1) as Steps)
              : state.activeStep,
        };
      case "DECREMENT_STEP":
        return {
          ...state,
          activeStep:
            state.activeStep > 0
              ? ((state.activeStep - 1) as Steps)
              : state.activeStep,
        };
      case "SET_STEP":
        return { ...state, activeStep: action.payload };
      default:
        return state;
    }
  };

  const [activeStep, setActiveStep] = useState<Steps>(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [originChain, setOriginChain] = useState<ChainId>();
  const [originAsset, setOriginAsset] = useState<string | undefined>();
  const [sourceChain, setSourceChain] = useState<ChainId>();
  const [balanceConfirmed, setBalanceConfirmed] = useState<boolean | null>(
    null
  );
  const [isSourceAssetWormholeWrapped, setIsSourceAssetWormholeWrapped] =
    useState<boolean | undefined>();
  const [sourceWalletAddress, setSourceWalletAddress] = useState<
    string | undefined
  >();
  const [sourceParsedTokenAccount, setSourceParsedTokenAccount] = useState<
    ParsedTokenAccount | undefined
  >();

  const [sourceParsedTokenAccounts, setSourceParsedTokenAccounts] =
    useState<DataWrapper<ParsedTokenAccount[]>>();
  const [amount, setAmount] = useState<string>("");
  const [targetAddressHex, setTargetAddressHex] = useState<
    string | undefined
  >();
  const [targetAsset, setTargetAsset] =
    useState<DataWrapper<ForeignAssetInfo>>();
  const [targetChain, setTargetChain] = useState<ChainId>(CHAIN_ID_ALGORAND);
  const [targetParsedTokenAccount, setTargetParsedTokenAccount] = useState<
    ParsedTokenAccount | undefined
  >();
  const [transferTx, setTransferTx] = useState<Transaction | undefined>();
  const [signedVAAHex, setSignedVAAHex] = useState<string | undefined>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVAAPending, setIsVAAPending] = useState<boolean>(false);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [redeemTx, setRedeemTx] = useState<Transaction | undefined>();
  const [isRecovery, setIsRecovery] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState(false);
  const [gasPrice, setGasPrice] = useState<number | undefined>();
  const [isValidating, setIsValidating] = useState(true);
  const [sourceWormholeWrappedInfo, setSourceWormholeWrappedInfo] = useState<
    StateSafeWormholeWrappedInfo | undefined
  >();
  const incrementStep = () => {
    dispatch({ type: "INCREMENT_STEP" });
  };

  const decrementStep = () => {
    dispatch({ type: "DECREMENT_STEP" });
  };

  const setStep = (step: Steps) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const reset = () => {
    setActiveStep(0);
    setSourceChain(undefined);
    setOriginChain(undefined);
    setIsSourceAssetWormholeWrapped(undefined);
    setOriginAsset(undefined);
    setSourceWalletAddress(undefined);
    setSourceParsedTokenAccounts(getEmptyDataWrapper());
    setAmount("");
    setSourceParsedTokenAccount(undefined);
    setTargetAddressHex(undefined);
    setTargetChain(CHAIN_ID_ALGORAND);
    setTargetAsset(getEmptyDataWrapper());
    setTargetParsedTokenAccount(undefined);
    setTransferTx(undefined);
    setIsVAAPending(false);
    setIsSending(false);
    setIsRedeeming(false);
    setIsApproving(false);
    setRedeemTx(undefined);
    setGasPrice(undefined);
  };

  return {
    incrementStep,
    decrementStep,
    setStep,
    activeStep,
    sourceChain,
    isSourceAssetWormholeWrapped,
    originChain,
    originAsset,
    sourceWalletAddress,
    sourceParsedTokenAccount,
    sourceParsedTokenAccounts,
    amount,
    targetChain,
    targetAddressHex,
    targetAsset,
    targetParsedTokenAccount,
    transferTx,
    signedVAAHex,
    isSending,
    isVAAPending,
    isRedeeming,
    redeemTx,
    isApproving,
    isRecovery,
    gasPrice,
    sourceWormholeWrappedInfo,
    balanceConfirmed,
    setIsValidating,
    setActiveStep,
    setOriginChain,
    setSourceChain,
    setIsSourceAssetWormholeWrapped,
    setOriginAsset,
    setSourceWalletAddress,
    setSourceParsedTokenAccount,
    setAmount,
    setSourceParsedTokenAccounts,
    setTargetAddressHex,
    setTargetChain,
    setTargetAsset,
    setTargetParsedTokenAccount,
    setTransferTx,
    setIsVAAPending,
    setSignedVAAHex,
    setIsSending,
    setIsRedeeming,
    setIsApproving,
    setRedeemTx,
    setGasPrice,
    reset,
    setSourceWormholeWrappedInfo,
    setBalanceConfirmed,
    isValidating,
  };
}
