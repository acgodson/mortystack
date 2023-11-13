import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ChainId,
    CHAIN_ID_ALGORAND,
    CHAIN_ID_BSC,
    CHAIN_ID_CELO,
    CHAIN_ID_ETH,
    CHAIN_ID_FANTOM,
    CHAIN_ID_POLYGON,
    ethers_contracts,
    isEVMChain,
} from "@certusone/wormhole-sdk";
import axios from "axios";
import { ethers } from "ethers";
import { Algodv2 } from "algosdk";
import { formatUnits } from "ethers/lib/utils";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import {
    ALGORAND_HOST,
    COVALENT_GET_TOKENS_URL,
    BLOCKSCOUT_GET_TOKENS_URL,
    WBNB_ADDRESS,
    WBNB_DECIMALS,
    CELO_ADDRESS,
    CELO_DECIMALS,
    WETH_ADDRESS,
    WETH_DECIMALS,
    WFTM_ADDRESS,
    WFTM_DECIMALS,
    WMATIC_ADDRESS,
    WMATIC_DECIMALS,
    getDefaultNativeCurrencyAddressEvm,
    ALGO_DECIMALS,
} from "@/utils/wormhole/consts"
import { useEthereumProvider, Provider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import { fetchSingleMetadata } from "./useAlgoMetadata";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";


const bnbIcon = "../icons/bnb.svg";
const celoIcon = "../icons/celo.svg";
const ethIcon = "../icons/eth.svg";
const fantomIcon = "../icons/fantom.svg";
const polygonIcon = "../icons/polygon.svg";




export function createParsedTokenAccount(
    publicKey: string,
    mintKey: string,
    amount: string,
    decimals: number,
    uiAmount: number,
    uiAmountString: string,
    symbol?: string,
    name?: string,
    logo?: string,
    isNativeAsset?: boolean
): ParsedTokenAccount {
    return {
        publicKey: publicKey,
        mintKey: mintKey,
        amount,
        decimals,
        uiAmount,
        uiAmountString,
        symbol,
        name,
        logo,
        isNativeAsset,
    };
}


const createParsedTokenAccountFromCovalent = (
    walletAddress: string,
    covalent: CovalentData
): ParsedTokenAccount => {
    return {
        publicKey: walletAddress,
        mintKey: covalent.contract_address,
        amount: covalent.balance,
        decimals: covalent.contract_decimals,
        uiAmount: Number(formatUnits(covalent.balance, covalent.contract_decimals)),
        uiAmountString: formatUnits(covalent.balance, covalent.contract_decimals),
        symbol: covalent.contract_ticker_symbol,
        name: covalent.contract_name,
        logo: covalent.logo_url,
    };
};


const createNativeEthParsedTokenAccount = (
    provider: Provider,
    signerAddress: string | undefined
) => {
    return !(provider && signerAddress)
        ? Promise.reject()
        : provider.getBalance(signerAddress).then((balanceInWei) => {
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            return createParsedTokenAccount(
                signerAddress, //public key
                WETH_ADDRESS, //Mint key, On the other side this will be WETH, so this is hopefully a white lie.
                balanceInWei.toString(), //amount, in wei
                WETH_DECIMALS, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
                parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                balanceInEth.toString(), //This is the actual display field, which has full precision.
                "ETH", //A white lie for display purposes
                "Ethereum", //A white lie for display purposes
                ethIcon,
                true //isNativeAsset
            );
        });
};



const createNativeBscParsedTokenAccount = (
    provider: Provider,
    signerAddress: string | undefined
) => {
    return !(provider && signerAddress)
        ? Promise.reject()
        : provider.getBalance(signerAddress).then((balanceInWei) => {
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            return createParsedTokenAccount(
                signerAddress, //public key
                WBNB_ADDRESS, //Mint key, On the other side this will be WBNB, so this is hopefully a white lie.
                balanceInWei.toString(), //amount, in wei
                WBNB_DECIMALS, //Luckily both BNB and WBNB have 18 decimals, so this should not be an issue.
                parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                balanceInEth.toString(), //This is the actual display field, which has full precision.
                "BNB", //A white lie for display purposes
                "Binance Coin", //A white lie for display purposes
                bnbIcon,
                true //isNativeAsset
            );
        });
};

const createNativePolygonParsedTokenAccount = (
    provider: Provider,
    signerAddress: string | undefined
) => {
    return !(provider && signerAddress)
        ? Promise.reject()
        : provider.getBalance(signerAddress).then((balanceInWei) => {
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            return createParsedTokenAccount(
                signerAddress, //public key
                WMATIC_ADDRESS, //Mint key, On the other side this will be WMATIC, so this is hopefully a white lie.
                balanceInWei.toString(), //amount, in wei
                WMATIC_DECIMALS, //Luckily both MATIC and WMATIC have 18 decimals, so this should not be an issue.
                parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                balanceInEth.toString(), //This is the actual display field, which has full precision.
                "MATIC", //A white lie for display purposes
                "Matic", //A white lie for display purposes
                polygonIcon,
                true //isNativeAsset
            );
        });
};



const createNativeFantomParsedTokenAccount = (
    provider: Provider,
    signerAddress: string | undefined
) => {
    return !(provider && signerAddress)
        ? Promise.reject()
        : provider.getBalance(signerAddress).then((balanceInWei) => {
            const balanceInEth = ethers.utils.formatEther(balanceInWei);
            return createParsedTokenAccount(
                signerAddress, //public key
                WFTM_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
                balanceInWei.toString(), //amount, in wei
                WFTM_DECIMALS,
                parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                balanceInEth.toString(), //This is the actual display field, which has full precision.
                "FTM", //A white lie for display purposes
                "Fantom", //A white lie for display purposes
                fantomIcon,
                true //isNativeAsset
            );
        });
};




const createNativeCeloParsedTokenAccount = (
    provider: Provider,
    signerAddress: string | undefined
) => {
    // Celo has a "native asset" ERC-20
    // https://docs.celo.org/developer-guide/celo-for-eth-devs
    return !(provider && signerAddress)
        ? Promise.reject()
        : ethers_contracts.TokenImplementation__factory.connect(
            CELO_ADDRESS,
            provider
        )
            .balanceOf(signerAddress)
            .then((balance) => {
                const balanceInEth = ethers.utils.formatUnits(balance, CELO_DECIMALS);
                return createParsedTokenAccount(
                    signerAddress, //public key
                    CELO_ADDRESS, //Mint key, On the other side this will be wavax, so this is hopefully a white lie.
                    balance.toString(), //amount, in wei
                    CELO_DECIMALS,
                    parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                    balanceInEth.toString(), //This is the actual display field, which has full precision.
                    "CELO", //A white lie for display purposes
                    "CELO", //A white lie for display purposes
                    celoIcon,
                    false //isNativeAsset
                );
            });
};



export type CovalentData = {
    contract_decimals: number;
    contract_ticker_symbol: string;
    contract_name: string;
    contract_address: string;
    logo_url: string | undefined;
    balance: string;
    quote: number | undefined;
    quote_rate: number | undefined;
    nft_data?: CovalentNFTData[];
};

export type CovalentNFTExternalData = {
    animation_url: string | null;
    external_url: string | null;
    image: string;
    image_256: string;
    name: string;
    description: string;
};

export type CovalentNFTData = {
    token_id: string;
    token_balance: string;
    external_data: CovalentNFTExternalData;
    token_url: string;
};

const getEthereumAccountsCovalent = async (
    url: string,
    chainId: ChainId
): Promise<CovalentData[]> => {
    try {
        const output = [] as CovalentData[];
        const response = await axios.get(url);
        const tokens = response.data.data.items;

        if (tokens instanceof Array && tokens.length) {
            for (const item of tokens) {
                // TODO: filter?
                if (
                    item.contract_decimals !== undefined &&
                    item.contract_address &&
                    item.contract_address.toLowerCase() !==
                    getDefaultNativeCurrencyAddressEvm(chainId).toLowerCase() && // native balance comes from querying token bridge
                    item.balance &&
                    item.balance !== "0" &&
                    item.supports_erc?.includes("erc20")
                ) {
                    output.push({ ...item } as CovalentData);
                }
            }
        }

        return output;
    } catch (error) {
        return Promise.reject("Unable to retrieve your Ethereum Tokens.");
    }
};

export const getEthereumAccountsBlockscout = async (
    url: string,
    chainId: ChainId
): Promise<CovalentData[]> => {
    try {
        const output = [] as CovalentData[];
        const response = await axios.get(url);
        const tokens = response.data.result;

        if (tokens instanceof Array && tokens.length) {
            for (const item of tokens) {
                if (
                    item.decimals !== undefined &&
                    item.contractAddress &&
                    item.contractAddress.toLowerCase() !==
                    getDefaultNativeCurrencyAddressEvm(chainId).toLowerCase() && // native balance comes from querying token bridge
                    item.balance &&
                    item.balance !== "0" &&
                    item.type?.includes("ERC-20")
                ) {
                    output.push({
                        contract_decimals: item.decimals,
                        contract_address: item.contractAddress,
                        balance: item.balance,
                        contract_ticker_symbol: item.symbol,
                        contract_name: item.name,
                        logo_url: "",
                        quote: 0,
                        quote_rate: 0,
                    });
                }
            }
        }

        return output;
    } catch (error) {
        return Promise.reject("Unable to retrieve your Ethereum Tokens.");
    }
};


const getAlgorandParsedTokenAccounts = async (
    walletAddress: string,
    nft: boolean,
    setSourceParsedTokenAccounts: any
) => {

    // fetchSourceParsedTokenAccounts();
    try {
        const algodClient = new Algodv2(
            ALGORAND_HOST.algodToken,
            ALGORAND_HOST.algodServer,
            ALGORAND_HOST.algodPort
        );
        const accountInfo = await algodClient
            .accountInformation(walletAddress)
            .do();
        const parsedTokenAccounts: ParsedTokenAccount[] = [];
        for (const asset of accountInfo.assets) {
            const assetId = asset["asset-id"];
            const amount = asset.amount;
            const metadata = await fetchSingleMetadata(assetId, algodClient);
            const isNFT: boolean = amount === 1 && metadata.decimals === 0;
            if (((nft && isNFT) || (!nft && !isNFT)) && amount > 0) {
                parsedTokenAccounts.push(
                    createParsedTokenAccount(
                        walletAddress,
                        assetId.toString(),
                        amount,
                        metadata.decimals,
                        parseFloat(formatUnits(amount, metadata.decimals)),
                        formatUnits(amount, metadata.decimals).toString(),
                        metadata.symbol,
                        metadata.tokenName,
                        undefined,
                        false
                    )
                );
            }
        }

        // The ALGOs account is prepended for the non NFT case
        parsedTokenAccounts.unshift(
            createParsedTokenAccount(
                walletAddress, //publicKey
                "0", //asset ID
                accountInfo.amount, //amount
                ALGO_DECIMALS,
                parseFloat(formatUnits(accountInfo.amount, ALGO_DECIMALS)),
                formatUnits(accountInfo.amount, ALGO_DECIMALS).toString(),
                "ALGO",
                "Algo",
                undefined, //TODO logo
                true
            )
        );

        setSourceParsedTokenAccounts(parsedTokenAccounts);
    } catch (e) {
        console.error(e);

        console.log("Failed to load token metadata.")

    }
};



/**
 * Fetches the balance of an asset for the connected wallet
 * This should handle every type of chain in the future, but only reads the Transfer state.
 */
function useGetAvailableTokens(nft: boolean = false) {

    const { sourceChain, setAmount,
        setSourceParsedTokenAccount,
        setSourceWalletAddress,
        setSourceParsedTokenAccounts, sourceParsedTokenAccounts, sourceWalletAddress }: any = useWormholeContext()


    const tokenAccounts = sourceParsedTokenAccounts
    const lookupChain = sourceChain

    const { provider, signerAddress } = useEthereumProvider();
    const { account: algoAccounts } = useRelayContext();

    const [covalent, setCovalent] = useState<any>(undefined);
    const [covalentLoading, setCovalentLoading] = useState(false);
    const [covalentError, setCovalentError] = useState<string | undefined>(
        undefined
    );
    const [ethNativeAccount, setEthNativeAccount] = useState<any>(undefined);
    const [ethNativeAccountLoading, setEthNativeAccountLoading] = useState(false);
    const [ethNativeAccountError, setEthNativeAccountError] = useState<
        string | undefined
    >(undefined);



    const selectedSourceWalletAddress = sourceWalletAddress

    const currentSourceWalletAddress: string | undefined = isEVMChain(lookupChain)
        ? signerAddress
        : lookupChain === CHAIN_ID_ALGORAND
            ? algoAccounts?.addr
            : undefined;

    const resetSourceAccounts = useCallback(() => {

        setSourceWalletAddress(undefined)
        setSourceParsedTokenAccount(undefined)
        setSourceParsedTokenAccounts(undefined)
        setCovalent(undefined); //These need to be included in the reset because they have balances on them.
        setCovalentLoading(false);
        setCovalentError("");

        setEthNativeAccount(undefined);
        setEthNativeAccountLoading(false);
        setEthNativeAccountError("");
    }, [setCovalent,]);

    //TODO this useEffect could be somewhere else in the codebase
    //It resets the SourceParsedTokens accounts when the wallet changes
    useEffect(() => {
        if (
            selectedSourceWalletAddress !== undefined &&
            currentSourceWalletAddress !== undefined &&
            currentSourceWalletAddress !== selectedSourceWalletAddress
        ) {
            resetSourceAccounts();
            return;
        } else {
        }
    }, [
        selectedSourceWalletAddress,
        currentSourceWalletAddress,
        useWormholeContext, //test
        resetSourceAccounts,
    ]);


    //Ethereum native asset load
    useEffect(() => {
        let cancelled = false;
        if (
            signerAddress &&
            lookupChain === CHAIN_ID_ETH &&
            !ethNativeAccount
        ) {
            setEthNativeAccountLoading(true);
            createNativeEthParsedTokenAccount(provider, signerAddress).then(
                (result) => {
                    console.log("create native account returned with value", result);
                    if (!cancelled) {
                        setEthNativeAccount(result);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("");
                    }
                },
                (error) => {
                    if (!cancelled) {
                        setEthNativeAccount(undefined);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("Unable to retrieve your ETH balance.");
                    }
                }
            );
        }

        return () => {
            cancelled = true;
        };
    }, [lookupChain, provider, signerAddress, ethNativeAccount]);



    //Binance Smart Chain native asset load
    useEffect(() => {
        let cancelled = false;
        if (
            signerAddress &&
            lookupChain === CHAIN_ID_BSC &&
            !ethNativeAccount
        ) {
            setEthNativeAccountLoading(true);
            createNativeBscParsedTokenAccount(provider, signerAddress).then(
                (result) => {
                    console.log("create native account returned with value", result);
                    if (!cancelled) {
                        setEthNativeAccount(result);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("");
                    }
                },
                (error) => {
                    if (!cancelled) {
                        setEthNativeAccount(undefined);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("Unable to retrieve your BNB balance.");
                    }
                }
            );
        }

        return () => {
            cancelled = true;
        };
    }, [lookupChain, provider, signerAddress, ethNativeAccount]);

    //Polygon native asset load
    useEffect(() => {
        let cancelled = false;
        if (
            signerAddress &&
            lookupChain === CHAIN_ID_POLYGON &&
            !ethNativeAccount
        ) {
            setEthNativeAccountLoading(true);
            createNativePolygonParsedTokenAccount(provider, signerAddress).then(
                (result) => {
                    console.log("create native account returned with value", result);
                    if (!cancelled) {
                        setEthNativeAccount(result);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("");
                    }
                },
                (error) => {
                    if (!cancelled) {
                        setEthNativeAccount(undefined);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("Unable to retrieve your MATIC balance.");
                    }
                }
            );
        }

        return () => {
            cancelled = true;
        };
    }, [lookupChain, provider, signerAddress, ethNativeAccount]);


    useEffect(() => {
        let cancelled = false;
        if (
            signerAddress &&
            lookupChain === CHAIN_ID_FANTOM &&
            !ethNativeAccount
        ) {
            setEthNativeAccountLoading(true);
            createNativeFantomParsedTokenAccount(provider, signerAddress).then(
                (result) => {
                    console.log("create native account returned with value", result);
                    if (!cancelled) {
                        setEthNativeAccount(result);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("");
                    }
                },
                (error) => {
                    if (!cancelled) {
                        setEthNativeAccount(undefined);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("Unable to retrieve your Fantom balance.");
                    }
                }
            );
        }

        return () => {
            cancelled = true;
        };
    }, [lookupChain, provider, signerAddress, ethNativeAccount]);


    useEffect(() => {
        let cancelled = false;
        if (
            signerAddress &&
            lookupChain === CHAIN_ID_CELO &&
            !ethNativeAccount
        ) {
            setEthNativeAccountLoading(true);
            createNativeCeloParsedTokenAccount(provider, signerAddress).then(
                (result) => {
                    console.log("create native account returned with value", result);
                    if (!cancelled) {
                        setEthNativeAccount(result);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("");
                    }
                },
                (error) => {
                    if (!cancelled) {
                        setEthNativeAccount(undefined);
                        setEthNativeAccountLoading(false);
                        setEthNativeAccountError("Unable to retrieve your Celo balance.");
                    }
                }
            );
        }

        return () => {
            cancelled = true;
        };
    }, [lookupChain, provider, signerAddress, ethNativeAccount]);


    //Ethereum covalent or blockscout accounts load
    useEffect(() => {

        let cancelled = false;
        const walletAddress = signerAddress;
        if (walletAddress && isEVMChain(lookupChain) && !covalent) {
            //@ts-ignore
            let url = COVALENT_GET_TOKENS_URL(lookupChain, walletAddress, nft);
            let getAccounts;
            if (url) {
                getAccounts = getEthereumAccountsCovalent;
            } else {
                //@ts-ignore
                url = BLOCKSCOUT_GET_TOKENS_URL(lookupChain, walletAddress);
                getAccounts = getEthereumAccountsBlockscout;
            }
            if (!url) {
                return;
            }
            //TODO less cancel
            !cancelled && setCovalentLoading(true);
            !cancelled &&

                // fetchSourceParsedTokenAccounts()

                getAccounts(url, lookupChain as ChainId).then(
                    (accounts) => {
                        !cancelled && setCovalentLoading(false);
                        !cancelled && setCovalentError(undefined);
                        !cancelled && setCovalent(accounts);
                        !cancelled &&
                            setSourceParsedTokenAccounts(
                                accounts.map((x) =>
                                    createParsedTokenAccountFromCovalent(walletAddress, x)
                                )
                            )
                    },
                    () => {
                        console.log("Cannot load your Ethereum tokens at the moment.")
                        !cancelled &&

                            !cancelled &&
                            setCovalentError("Cannot load your Ethereum tokens at the moment.");
                        !cancelled && setCovalentLoading(false);
                    }
                );

            return () => {
                cancelled = true;
            };
        }
    }, [lookupChain, provider, signerAddress, nft, covalent]);


    //Algorand accounts load
    useEffect(() => {
        if (lookupChain === CHAIN_ID_ALGORAND && currentSourceWalletAddress) {
            if (
                !(tokenAccounts.data || tokenAccounts.isFetching || tokenAccounts.error)
            ) {
                getAlgorandParsedTokenAccounts(
                    currentSourceWalletAddress,
                    nft,
                    setSourceParsedTokenAccounts
                );
            }
        }

        return () => { };
    }, [lookupChain, currentSourceWalletAddress, tokenAccounts, nft]);




    const ethAccounts = useMemo(() => {
        const output = { ...tokenAccounts };
        output.data = output.data?.slice() || [];
        output.isFetching = output.isFetching || ethNativeAccountLoading;
        output.error = output.error || ethNativeAccountError;
        ethNativeAccount && output.data && output.data.unshift(ethNativeAccount);
        return output;
    }, [
        ethNativeAccount,
        ethNativeAccountLoading,
        ethNativeAccountError,
        tokenAccounts,
    ]);

    return isEVMChain(lookupChain)
        ? {
            tokenAccounts: ethAccounts,
            covalent: {
                data: covalent,
                isFetching: covalentLoading,
                error: covalentError,
                receivedAt: null, //TODO
            },
            resetAccounts: resetSourceAccounts,
        }

        : lookupChain === CHAIN_ID_ALGORAND
            ? {
                tokenAccounts,
                resetAccounts: resetSourceAccounts,
            }

            : undefined;
}

export default useGetAvailableTokens;
