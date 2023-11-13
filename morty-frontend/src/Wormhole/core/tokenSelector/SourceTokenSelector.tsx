import { useCallback } from "react";
import { Input, Text, } from "@chakra-ui/react";
import {
    CHAIN_ID_ALGORAND,
    ChainId,
    isEVMChain,
} from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import useGetSourceParsedTokens from "@/hooks/wormhole/useGetSourceParsedTokenAccounts";
import useIsWalletReady from "@/hooks/wormhole/useIsWalletReady";
import AlgoTokenPicker from "./AlgoTokenPicker";
import EvmTokenPicker from "./EVMTokenPicker";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import RefreshButtonWrapper from "./RefreshButtonWrapper";
import { ethers } from "ethers";



type TokenSelectorProps = {
    disabled: boolean;
    nft?: boolean;
    token?: string;
};

export const TokenSelector = (props: TokenSelectorProps) => {
    const { disabled, nft } = props;

    const { sourceChain, setAmount,
        setSourceParsedTokenAccount,
        setSourceWalletAddress,
        sourceParsedTokenAccount, }: any = useWormholeContext()

    const lookupChain = sourceChain


    const walletIsReady = useIsWalletReady(lookupChain);

    const handleOnChange = useCallback(
        (newTokenAccount: ParsedTokenAccount | null) => {
            if (!newTokenAccount) {
                setSourceParsedTokenAccount(undefined);
                setSourceWalletAddress(undefined);
            } else if (newTokenAccount !== undefined && walletIsReady.walletAddress) {
                setSourceParsedTokenAccount(newTokenAccount);
                setSourceWalletAddress(walletIsReady.walletAddress);
            }
        },
        [
            walletIsReady,
            setSourceParsedTokenAccount,
            setSourceWalletAddress,
        ]
    );




    const maps = useGetSourceParsedTokens(nft);
    const resetAccountWrapper = maps?.resetAccounts || (() => { }); //This should never happen.




    //This is only for errors so bad that we shouldn't even mount the component
    const fatalError =
        !isEVMChain(lookupChain) &&
        maps?.tokenAccounts?.error; // EVM chains can proceed because they have advanced mode




    const content = fatalError ? (
        <RefreshButtonWrapper callback={resetAccountWrapper}>
            <Text>Error</Text>
        </RefreshButtonWrapper>
    )
        : isEVMChain(lookupChain) ? (
            <EvmTokenPicker
                value={sourceParsedTokenAccount || null}
                disabled={disabled}
                onChange={handleOnChange}
                tokenAccounts={maps?.tokenAccounts}
                resetAccounts={maps?.resetAccounts}
                chainId={lookupChain as ChainId}
                nft={nft}
                mintkey={props.token}
            />
        )
            : lookupChain === CHAIN_ID_ALGORAND ? (
                <AlgoTokenPicker
                    value={sourceParsedTokenAccount || null}
                    disabled={disabled}
                    onChange={handleOnChange}
                    resetAccounts={maps?.resetAccounts}
                    tokenAccounts={maps?.tokenAccounts}
                />
            )

                : (
                    <Input
                        variant="outlined"
                        placeholder="Asset"
                        w="full"
                        value={"Not Implemented"}
                        disabled={true}
                    />
                );

    return <div>{content}</div>;
};
