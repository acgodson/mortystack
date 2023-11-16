import React, { useEffect, useState } from "react";
import { CHAIN_ID_ALGORAND, CHAIN_ID_ETH, CHAIN_ID_POLYGON, ChainId, getForeignAssetAlgorand } from "@certusone/wormhole-sdk";
import { Container, Box, VStack, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepSeparator, Center } from "@chakra-ui/react";
import algosdk, { Algodv2 } from "algosdk";
import { formatUnits } from "@ethersproject/units";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";
import { ALGORAND_HOST, ALGORAND_TOKEN_BRIDGE_ID, CHAINS_BY_ID } from "@/utils/wormhole/consts"
import { errorDataWrapper } from "@/utils/wormhole/helpers";
import { algorandOriginAsset, evmOriginAsset } from "@/Wormhole/core/";
import { fetchSingleMetadata } from "@/hooks/wormhole/useAlgoMetadata";
import { createParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";

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
import { useAlgorandContext } from "@/contexts/WormholeContext/AlgorandWalletContext";


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
    balanceConfirmed, setBalanceConfirmed,
    setIsValidating, isValidating, sourceChain,
    targetAsset, setTargetAsset, sourceParsedTokenAccount,
    isSendComplete, isSending, setSourceChain,
    setTargetChain, activeStep, isRedeemComplete,
    originAsset, setOriginAsset,
    setTargetParsedTokenAccount }: any = useWormholeContext()

  const pathSourceChain = CHAIN_ID_POLYGON
  const pathTargetChain = CHAIN_ID_ALGORAND;

  const [amount, setAmount] = useState<string | null>(null)

  const preventNavigation = (isSending || isSendComplete || isRedeeming) && !isRedeemComplete;
  const [parsedToken, setParsedToken] = useState<any | null>(null)
  const [name, setName] = useState<string | null>(null)




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
      const sufficient = parsedToken.uiAmount >= equiv;

      setAmount(equiv.toString())
      console.log(equiv.toString())
      console.log(sufficient)
      setBalanceConfirmed(sufficient)
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




  useEffect(() => {
    if (tokenAmount && signerAddress && invoice && !parsedToken) {
      prepareToken()
    }
  }, [tokenAmount, signerAddress, invoice, parsedToken])

  useEffect(() => {
    if (tokenAmount && parsedToken && isValidating) {
      const { uiAmount } = parsedToken
      console.log(uiAmount)
      if (uiAmount) {
        getPrice()
      }
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

  async function getOriginAsset() {
    const x: any = await evmOriginAsset(
      sourceParsedTokenAccount.mintKey,
      sourceChain,
      provider)
    setOriginAsset(x)
    setTargetAsset(null)
    return x
  }
  async function getTargetInfo() {
    const x: any = await algorandOriginAsset(targetAsset)
    setTargetInfo(x)
    return x
  }

  async function fetchAlgorandTargetAsset(
    originChain: ChainId,
    originAsset: string,
    isSourceAssetWormholeWrapped: boolean,
    targetChain: ChainId

  ) {

    const argsMatchLastSuccess = !!lastSuccessfulArgs &&
      lastSuccessfulArgs.isSourceAssetWormholeWrapped ===
      isSourceAssetWormholeWrapped &&
      lastSuccessfulArgs.originChain === originChain &&
      lastSuccessfulArgs.originAsset === originAsset &&
      lastSuccessfulArgs.targetChain === targetChain;

    if (argsMatchLastSuccess) {
      setFetchingTarget(false)
      return;
    }
    const setArgs = () => {
      setLastSuccessfulArgs({
        isSourceAssetWormholeWrapped,
        originChain,
        originAsset,
        targetChain,
      });
    }

    try {
      const algodClient = new algosdk.Algodv2(
        ALGORAND_HOST.algodToken,
        ALGORAND_HOST.algodServer,
        ALGORAND_HOST.algodPort
      );

      const asset = await getForeignAssetAlgorand(
        //@ts-ignore
        algodClient,
        ALGORAND_TOKEN_BRIDGE_ID,
        originChain,
        originAsset
      );
      console.log("checkkkkk", asset)
      setTargetAsset(asset === null ? asset : asset.toString(),
      );
      setArgs();

      setFetchingTarget(false)
    } catch (e) {
      console.error(e);
      setTargetAsset(
        errorDataWrapper(
          "Unable to determine existence of wrapped asset"
        )
      );

      setFetchingTarget(false)
    }
  }

  useEffect(() => {
    console.log("taaaags", sourceParsedTokenAccount)
    if (sourceParsedTokenAccount && !originAsset) {
      const x = getOriginAsset()
    }
  }, [
    originAsset,
    sourceParsedTokenAccount
  ])

  useEffect(() => {
    if (pathTargetChain === CHAIN_ID_ALGORAND && originAsset && !targetAsset) {
      fetchAlgorandTargetAsset(
        pathSourceChain,
        originAsset.originAsset,
        originAsset.isSourceAssetWormholeWrapped,
        pathTargetChain
      )
    }
  }, [originAsset, targetAsset, pathTargetChain, setTargetAsset])

  useEffect(() => {
    if (targetAsset && originAsset) {
      console.log("origin Asset", originAsset)
      console.log("target Asset", targetAsset)

      getTargetInfo()

    }
  }, [targetAsset, originAsset])

  useEffect(() => {

    console.log("approved amount", amount)
  }, [amount])




  const lookupAlgoAddress = () => {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    if (!account) {
      return
    }

    console.log(targetAsset);

    return fetchSingleMetadata(targetAsset, algodClient)
      .then(async (metadata) => {

        const accountInfo = await algodClient
          .accountInformation(invoice.metadata.signer)
          .do();

        let ParsedTargetAccounts = [];

        for (const asset of accountInfo.assets) {
          const assetId = asset["asset-id"];
          if (assetId.toString() === targetAsset) {
            const amount = asset.amount;
            const parsedAccount = createParsedTokenAccount(
              account!.addr,
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
            ParsedTargetAccounts.push(parsedAccount)

          }
        }
        console.log("parsedd", ParsedTargetAccounts)
        setTargetParsedTokenAccount(ParsedTargetAccounts[0])
      })
      .catch(() => Promise.reject());
  }

  async function checker() {
    const algoAsset = await lookupAlgoAddress();
    console.log("Algorand Asset", algoAsset)

  }





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

