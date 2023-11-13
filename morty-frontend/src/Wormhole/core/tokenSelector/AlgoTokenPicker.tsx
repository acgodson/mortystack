import { useCallback } from "react";
import { ChainId, CHAIN_ID_ALGORAND } from "@certusone/wormhole-sdk";
import { formatUnits } from "@ethersproject/units";
import { Algodv2 } from "algosdk";
import { fetchSingleMetadata } from "@/hooks/wormhole/useAlgoMetadata";
import { createParsedTokenAccount } from "@/hooks/wormhole/useGetSourceParsedTokenAccounts";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import { ALGORAND_HOST } from "@/utils/wormhole/consts";
import TokenPicker, { BasicAccountRender } from "./TokenPicker";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { errorDataWrapper, DataWrapper } from "@/utils/wormhole/helpers";



// ParsedTokenAccount

type AlgoTokenPickerProps = {
    value: ParsedTokenAccount | null;
    onChange: (newValue: ParsedTokenAccount | null) => void;
    tokenAccounts?: DataWrapper<ParsedTokenAccount[]> | undefined;
    disabled: boolean;
    resetAccounts?: (() => void) | undefined;
    wallet?: any
};

export default function AlgoTokenPicker(props: AlgoTokenPickerProps) {
    const { value, onChange, disabled, tokenAccounts, resetAccounts } = props;
    const { walletAddress } = useIsWalletReady(CHAIN_ID_ALGORAND);

    const resetAccountWrapper = useCallback(() => {
        resetAccounts && resetAccounts();
    }, [resetAccounts]);
    const isLoading = tokenAccounts?.isFetching || false;

    const onChangeWrapper = useCallback(
        async (account: any | null) => {
            if (account === null) {
                onChange(null);
                return Promise.resolve();
            }
            onChange(account);
            return Promise.resolve();
        },
        [onChange]
    );

    const lookupAlgoAddress = useCallback(
        (lookupAsset: string) => {
            if (!walletAddress) {
                if (!props.wallet) {
                    return Promise.reject("Wallet not connected");
                }
            }


            const algodClient = new Algodv2(
                ALGORAND_HOST.algodToken,
                ALGORAND_HOST.algodServer,
                ALGORAND_HOST.algodPort
            );
            return fetchSingleMetadata(lookupAsset, algodClient)
                .then((metadata) => {
                    return algodClient
                        .accountInformation(walletAddress || props.wallet)
                        .do()
                        .then((accountInfo: any) => {
                            for (const asset of accountInfo.assets) {
                                const assetId = asset["asset-id"];
                                if (assetId.toString() === lookupAsset) {
                                    const amount = asset.amount;
                                    return createParsedTokenAccount(
                                        walletAddress || props.wallet,
                                        assetId.toString(),
                                        amount,
                                        metadata.decimals,
                                        parseFloat(formatUnits(amount, metadata.decimals)),
                                        formatUnits(amount, metadata.decimals).toString(),
                                        metadata.symbol,
                                        metadata.tokenName,
                                        undefined,
                                        false
                                    );
                                }
                            }
                            return Promise.reject();
                        })
                        .catch(() => Promise.reject());
                })
                .catch(() => Promise.reject());
        },
        [walletAddress]
    );

    const isSearchableAddress = useCallback(
        (address: string, chainId: ChainId) => {
            if (address.length === 0) {
                return false;
            }
            try {
                parseInt(address);
                return true;
            } catch (e) {
                return false;
            }
        },
        []
    );

    const RenderComp = useCallback(
        ({ account }: { account: any }) => {
            return BasicAccountRender(account);
        },
        []
    );

    return (
        <TokenPicker
            value={value || null}
            options={tokenAccounts?.data || []}
            RenderOption={RenderComp}
            onChange={onChangeWrapper}
            isValidAddress={isSearchableAddress}
            getAddress={lookupAlgoAddress}
            disabled={disabled}
            resetAccounts={resetAccountWrapper}
            error={""}
            showLoader={isLoading}
            nft={false}
            chainId={CHAIN_ID_ALGORAND}
            mintkey={value?.mintKey}
        />

       



    );
}
