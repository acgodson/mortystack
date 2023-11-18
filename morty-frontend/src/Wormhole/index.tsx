import React, { useEffect, useState } from "react";
import { CHAIN_ID_ALGORAND, CHAIN_ID_ETH, CHAIN_ID_POLYGON, ChainId, getForeignAssetAlgorand, getForeignAssetEth, getOriginalAssetAlgorand, tryHexToNativeAssetString, tryUint8ArrayToNative } from "@certusone/wormhole-sdk";
import { Container, Box, VStack, Center } from "@chakra-ui/react";
import algosdk, { Algodv2 } from "algosdk";
import { formatUnits } from "@ethersproject/units";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { Provider, useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { ALGORAND_HOST, ALGORAND_TOKEN_BRIDGE_ID, CHAINS_BY_ID, WETH_DECIMALS, getTokenBridgeAddressForChain } from "@/utils/wormhole/consts"
import { errorDataWrapper, receiveDataWrapper } from "@/utils/wormhole/helpers";
import { algorandOriginAsset, evmOriginAsset } from "@/Wormhole/core/";
import { fetchSingleMetadata } from "@/hooks/wormhole/useAlgoMetadata";
import { ParsedTokenAccount, createParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";
import Source from "./source/source";
import SourcePreview from "./source/SourcePreview";
import Target from "./target/Target";
import TargetPreview from "./target/TargetPreview";
import Send from "./send/Send";
import SendPreview from "./send/SendPreview";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";
import { Invoice } from "@/utils/types";
import AnimatedSpinner from "@/components/Animations/AnimatedSpinner";
import { extractToken, getEquivalentAmount } from "@/utils/helpers";
import { getTokenEquivalent } from "@/utils/wormhole/algorand";
import { ethers, providers, utils } from "ethers";


const algodClient = new Algodv2(
  ALGORAND_HOST.algodToken,
  ALGORAND_HOST.algodServer,
  ALGORAND_HOST.algodPort
);



function TransferBridge(
  { tokenAmount,
    invoice }: {
      tokenAmount: string
      amount: string
      invoice: Invoice
    }
) {

  const { provider, signerAddress } = useEthereumProvider()
  const { isRedeeming,
    balanceConfrimed,
    setBalanceConfirmed,
    balance,
    setIsValidating, isValidating, sourceChain,
    targetAsset, setTargetAsset, sourceParsedTokenAccount,
    isSendComplete, isSending, setSourceChain,
    setTargetChain, activeStep, isRedeemComplete,
    originAsset, setOriginAsset,
    setTargetParsedTokenAccount, setSourceParsedTokenAccount }: any = useWormholeContext()

  const pathSourceChain = CHAIN_ID_ETH
  const pathTargetChain = CHAIN_ID_ALGORAND;

  const [amount, setAmount] = useState<string | null>(null)

  const preventNavigation = (isSending || isSendComplete || isRedeeming) && !isRedeemComplete;
  const [parsedToken, setParsedToken] = useState<any | null>(null)
  const [name, setName] = useState<string | null>(null)




  useEffect(() => {
    console.log("taaaags", parsedToken)
    if (parsedToken && !originAsset) {
      const x = getOriginAsset()
      console.log(x)
    }
  }, [
    originAsset,
    parsedToken
  ])




  async function prepareToken() {
    if (!tokenAmount || !signerAddress) {
      return
    }
    const assetID = extractToken(invoice.metadata.invoiceToken)
    const assetInfo = await algodClient.getAssetByID(Number(assetID)).do();
    const metadata = {
      tokenName: assetInfo.params.name,
      symbol: assetInfo.params["unit-name"],
      decimals: assetInfo.params.decimals,
    };
    const ParsedToken = createParsedTokenAccount(
      signerAddress,
      assetID!,
      tokenAmount,
      metadata.decimals,
      parseFloat(formatUnits(tokenAmount, metadata.decimals)),
      formatUnits(tokenAmount, metadata.decimals).toString(),
      metadata.symbol,
      metadata.tokenName,
      undefined,
      false
    );
    setParsedToken(ParsedToken)
    return ParsedToken
  }

  async function getPrice() {
    if (!parsedToken) {
      return
    }
    let headersList = {
      "Content-Type": "application/json"
    }
    let bodyContent = JSON.stringify({
      "symbol": parsedToken.symbol === "WMATIC" ? "MATIC" : parsedToken.symbol === "WETH" ? "ETH"
        : parsedToken.symbol === "WALGO" ? "ALGO" : parsedToken.symbol
    });
    let response = await fetch("api/fetch-price", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });
    let data = await response.json();
    if (data.usdPrice) {
      const equiv = getEquivalentAmount(data.usdPrice, parseInt(tokenAmount), 2)
      setAmount(equiv.toString())
      setIsValidating(false)
    }
  }

  const fetchOrgmetadata = async () => {

    if (!invoice.metadata.organization) {
      return
    }

    let headersList = {
      "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
      "oid": invoice.metadata.organization,
    });

    let response = await fetch("/api/fetch-org-by-id", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data: any = await response.json();
    if (data.success) {

      setName(data.info.name.toUpperCase())
    }
  }

  useEffect(() => {
    if (!name && invoice) {
      fetchOrgmetadata()
    }
  }, [name])

  // useEffect(() => {
  //   if (amount) {
  //     alert(amount)
  //   }
  // }, [amount])



  useEffect(() => {
    if (sourceParsedTokenAccount && amount) {
      const sufficient = sourceParsedTokenAccount.uiAmount > parseInt(amount);
      console.log("mr suffificent", sufficient, sourceParsedTokenAccount.uiAmount, amount)
      setBalanceConfirmed(sufficient)
    }
  }, [sourceParsedTokenAccount, amount])



  useEffect(() => {
    if (tokenAmount && signerAddress && invoice && !parsedToken) {
      prepareToken()
    }
  }, [tokenAmount, signerAddress, invoice, parsedToken])

  useEffect(() => {
    if (tokenAmount && parsedToken && isValidating && !amount) {
      getPrice()

    }
  }, [tokenAmount, isValidating, parsedToken])





  useEffect(() => {
    try {
      const sourceChain: ChainId =
        CHAINS_BY_ID[pathSourceChain as ChainId]?.id;
      const targetChain: ChainId =
        CHAINS_BY_ID[pathTargetChain as ChainId]?.id;

      if (sourceChain === targetChain) {
        return;
      }

      if (sourceChain) {
        setSourceChain(sourceChain);
      }
      if (targetChain) {
        setTargetChain(targetChain);
      }
    } catch (e) {
      console.error("Invalid params specified.");
    }


  }, [pathSourceChain, pathTargetChain])



  useEffect(() => {
    if (preventNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [preventNavigation]);

  const [lastSuccessfulArgs, setLastSuccessfulArgs] = useState<{
    isSourceAssetWormholeWrapped: boolean | undefined;
    originChain: ChainId | undefined;
    originAsset: string | undefined;
    targetChain: ChainId;
    nft?: boolean;
    tokenId?: string;
  } | null>(null);

  const [fetchingTarget, setFetchingTarget] = useState(false)
  const [targetInfo, setTargetInfo] = useState<any | undefined>()
  const { account } = useRelayContext()
  const [verifying, setVerifying] = useState<boolean | null>(null)

  const [paymentToken, setPaymentToken] = useState<string | null>(null)


  async function createParsedTokenAccountDynamic(
    publicKey: string,
    mintKey: string,
    amount: string,
    decimals: number,
    isWrapped: boolean,
    provider: any
  ): Promise<ParsedTokenAccount> {
    const balance = await getBalance(provider, mintKey);
    const symbol = await getSymbol(provider, mintKey);

    return {
      publicKey: publicKey,
      mintKey: mintKey,
      amount,
      decimals,
      uiAmount: parseInt(balance),
      uiAmountString: balance,
      symbol: isWrapped ? symbol : '', // Include symbol only for wrapped tokens
      name: isWrapped ? undefined : symbol, // Include name only for native tokens
      logo: undefined, // Include logo if available
      isNativeAsset: !isWrapped,
    };
  }

  async function getBalance(provider: providers.Provider, address: string): Promise<string> {
    const balanceBN = await provider.getBalance(address);
    return utils.formatUnits(balanceBN, 18); // Assuming 18 decimal places for ETH, adjust accordingly
  }

  async function getSymbol(provider: providers.Provider, address: string): Promise<string> {
    const contract = new ethers.Contract(address, ['function symbol() view returns (string)'], provider);
    return contract.symbol();
  }


  async function getOriginAsset() {

    if (!signerAddress) {
      return
    }
    setVerifying(true)
    const wrappedInfo = await getOriginalAssetAlgorand(
      //@ts-ignore
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      parsedToken.mintKey
    );

    const { assetAddress, chainId, isWrapped } = wrappedInfo
    console.log("readable address in payers chain", tryUint8ArrayToNative(assetAddress, chainId))

    const addr = tryUint8ArrayToNative(assetAddress, chainId);

    if (chainId === sourceChain) {

      const result = receiveDataWrapper({
        doesExist:
          addr &&
            addr !== ethers.constants.AddressZero
            ? true
            : false,
        address: addr,
      });
      console.log("formatted result", result)

      const parsedAccount = await createParsedTokenAccountDynamic(
        signerAddress,
        result.data?.address!,
        tokenAmount,
        WETH_DECIMALS,
        isWrapped,
        provider
      );

      setSourceParsedTokenAccount(parsedAccount);
      setPaymentToken(result.data?.address!);

      if (result.data) {
        if (result.data.doesExist) {
          setVerifying(true);
        } else {
          setVerifying(false)
        }
      }
      return result;
    }

    const asset = await getForeignAssetEth(
      getTokenBridgeAddressForChain(sourceChain),
      provider!,
      chainId,
      assetAddress
    );

    const result = receiveDataWrapper({
      doesExist: asset && asset !== ethers.constants.AddressZero ? true : false,
      address: asset,
    });


    const parsedAccount = await createParsedTokenAccountDynamic(
      signerAddress,
      result.data?.address!,
      tokenAmount,
      WETH_DECIMALS,
      isWrapped,
      provider
    );

    console.log("parsed external account", parsedAccount)
    setSourceParsedTokenAccount(parsedAccount);
    setPaymentToken(result.data?.address!);

    if (result.data) {
      if (result.data.doesExist) {
        setVerifying(true);
      } else {
        setVerifying(false)
      }
    }
    return result
  }

  async function getTargetInfo() {
    const x: any = await algorandOriginAsset(parsedToken.mintKey)

    console.log(x)
    const wrappedInfo = await getOriginalAssetAlgorand(
      //@ts-ignore
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      parsedToken.mintKey
    );

    console.log("xxxxx", wrappedInfo)
    setTargetInfo(x)
    return x
  }

  useEffect(() => {
    console.log("taaaags", parsedToken)
    if (parsedToken && !originAsset) {
      const x = getOriginAsset()
      console.log(x)
    }
  }, [
    originAsset,
    parsedToken
  ])



  // useEffect(() => {
  //   if (pathTargetChain === CHAIN_ID_ALGORAND && originAsset && !targetAsset) {
  //     fetchAlgorandTargetAsset(
  //       pathSourceChain,
  //       originAsset.originAsset,
  //       originAsset.isSourceAssetWormholeWrapped,
  //       pathTargetChain
  //     )
  //   }
  // }, [originAsset, targetAsset, pathTargetChain, setTargetAsset])

  useEffect(() => {
    if (originAsset) {
      console.log("origin Asset", originAsset)
      console.log("target Asset", targetAsset)
      getTargetInfo()
    }
  }, [originAsset])


  // const lookupAlgoAddress = () => {
  //   const algodClient = new Algodv2(
  //     ALGORAND_HOST.algodToken,
  //     ALGORAND_HOST.algodServer,
  //     ALGORAND_HOST.algodPort
  //   );
  //   if (!account) {
  //     return
  //   }

  //   console.log(targetAsset);

  //   return fetchSingleMetadata(targetAsset, algodClient)
  //     .then(async (metadata) => {

  //       const accountInfo = await algodClient
  //         .accountInformation(invoice.metadata.signer)
  //         .do();

  //       let ParsedTargetAccounts = [];

  //       for (const asset of accountInfo.assets) {
  //         const assetId = asset["asset-id"];
  //         if (assetId.toString() === targetAsset) {

  //           const amount = asset.amount;
  //           const parsedAccount = createParsedTokenAccount(
  //             account!.addr,
  //             assetId.toString(),
  //             amount,
  //             metadata.decimals,
  //             parseFloat(formatUnits(amount, metadata.decimals)),
  //             formatUnits(amount, metadata.decimals).toString(),
  //             metadata.symbol,
  //             metadata.tokenName,
  //             undefined,
  //             false
  //           );
  //           ParsedTargetAccounts.push(parsedAccount)

  //         }
  //       }
  //       console.log("parsedd", ParsedTargetAccounts)
  //       setSourceParsedTokenAccount(ParsedTargetAccounts[0])
  //     })
  //     .catch(() => Promise.reject());
  // }

  return (


    <Container
      maxW={"500px"}
    >

      <Center>

        {amount ? (
          <VStack>

            <Box w="100%" flexShrink='0'>
              {activeStep === 0 ?
                <Source
                  name={name}
                  tokenAmount={amount}
                  paymentMethod={invoice.metadata.invoiceToken.toString()}
                  verifying={verifying}
                  paymentToken={paymentToken}
                /> : <SourcePreview />}
            </Box>

            <Box w="100%" flexShrink='0'>
              {activeStep === 1 ? <Target /> : <TargetPreview />}
            </Box>

            <Box
              w="100%"
              maxW={activeStep > 2 ? "400px" : "400px"}
            >
              {activeStep === 2 ? <Send /> : <SendPreview />}
            </Box>

          </VStack>
        ) :

          < Center>
            <AnimatedSpinner />
          </Center>

        }

      </Center>


    </Container >



  );
}

export default TransferBridge;

