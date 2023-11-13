import { ChainId, ethers_contracts } from "@certusone/wormhole-sdk";
import { useCallback } from "react";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { DataWrapper } from "@/utils/wormhole/helpers";
import {
    isValidEthereumAddress,
    ethTokenToParsedTokenAccount,
    getEthereumToken,
} from "@/utils/wormhole/ethereum";
import TokenPicker, { BasicAccountRender } from "./TokenPicker";






type EthereumSourceTokenSelectorProps = {
    value: ParsedTokenAccount | null;
    onChange: (newValue: ParsedTokenAccount | null) => void;
    tokenAccounts: DataWrapper<ParsedTokenAccount[]> | undefined;
    disabled: boolean;
    resetAccounts: (() => void) | undefined;
    chainId: ChainId;
    nft?: boolean;
    mintkey?: string
};

export default function EvmTokenPicker(
    props: EthereumSourceTokenSelectorProps
) {
    const {
        value,
        onChange,
        tokenAccounts,
        disabled,
        resetAccounts,
        chainId,
        nft,
    } = props;
    const { provider, signerAddress } = useEthereumProvider();
    const { isReady } = useIsWalletReady(chainId);
    const { sourceParsedTokenAccount }: any = useWormholeContext()
    const selectedTokenAccount: undefined = sourceParsedTokenAccount

    const shouldDisplayBalance = useCallback(
        (tokenAccount: any) => {
            const selectedMintMatch =
                selectedTokenAccount &&
                //@ts-ignore
                selectedTokenAccount.mintKey.toLowerCase() ===
                tokenAccount.mintKey.toLowerCase();

            return !!(
                tokenAccount.isNativeAsset || //The native asset amount isn't taken from covalent, so can be trusted.
                (selectedMintMatch)
            );
        },
        [selectedTokenAccount]
    );

    const getAddress: (
        address: string,
        tokenId?: string
    ) => Promise<any> = useCallback(
        async (address: string, tokenId?: string) => {
            if (provider && signerAddress && isReady) {
                try {
                    const tokenAccount = await (getEthereumToken(address, provider));
                    if (!tokenAccount) {
                        return Promise.reject("Could not find the specified token.");
                    }
                    else {
                        return ethTokenToParsedTokenAccount(
                            tokenAccount as ethers_contracts.TokenImplementation,
                            signerAddress
                        );
                    }
                } catch (e) {
                    return Promise.reject("Unable to retrive the specific token.");
                }
            } else {
                return Promise.reject({ error: "Wallet is not connected." });
            }
        },
        [isReady, nft, provider, signerAddress]
    );

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

    const RenderComp = useCallback(
        ({ account }: { account: any }) => {
            return BasicAccountRender(account, shouldDisplayBalance);
        },
        [nft, shouldDisplayBalance]
    );

    return (
        <TokenPicker
            value={value}
            options={tokenAccounts?.data || []}
            RenderOption={RenderComp}
            useTokenId={nft}
            onChange={onChangeWrapper}
            isValidAddress={isValidEthereumAddress}
            getAddress={getAddress}
            disabled={disabled}
            resetAccounts={resetAccounts}
            error={""}
            showLoader={tokenAccounts?.isFetching}
            nft={nft || false}
            chainId={chainId}
            mintkey={props.mintkey}
        />
    );
}
