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



function TransferBridge() {

  const { provider } = useEthereumProvider()
  const { isRedeeming, sourceChain, targetAsset, setTargetAsset, sourceParsedTokenAccount, sourceAsset, isSendComplete, isSending, setSourceChain, setTargetChain, activeStep, isRedeemComplete, originAsset, setOriginAsset, setTargetParsedTokenAccount }: any = useWormholeContext()

  const pathSourceChain = CHAIN_ID_POLYGON
  const pathTargetChain = CHAIN_ID_ALGORAND;



  const preventNavigation = (isSending || isSendComplete || isRedeeming) && !isRedeemComplete;

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

  // useCheckIfWormholeWrapped();

  // useFetchTargetAsset();

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



  const lookupAlgoAddress = () => {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    if (!account) {
      return
    }

    return fetchSingleMetadata(targetAsset, algodClient)
      .then(async (metadata) => {

        const accountInfo = await algodClient
          .accountInformation('3R4TN5MX7I2CLEUJPANEQ4Y2Z2JC6L7YACZBXQRCSC6WT4UW7Z6K5QDYTE')
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
    console.log("algoAsstet", algoAsset)

  }

  useEffect(() => {
    if (targetInfo) {
      console.log("target Info", targetInfo)
      checker()
    }

  }, [targetInfo])



  return (


    <Container
      // px={3}
      maxW={"500px"}
    >



      <Center>
        <VStack>

          <Box w="100%" flexShrink='0'>
            {/* <StepTitle>Sender </StepTitle> */}
            {activeStep === 0 ? <Source /> : <SourcePreview />}
          </Box>

          <Box w="100%" flexShrink='0'>
            {/* <StepTitle> Receiver </StepTitle> */}
            {activeStep === 1 ? <Target /> : <TargetPreview />}
          </Box>

          <Box
            w="100%"
            // flexShrink='0'
            // px={3}
            maxW={activeStep > 2 ? "400px" : "400px"}
          >
            {/* <StepTitle> Send Tokens </StepTitle> */}
            {activeStep === 2 ? <Send /> : <SendPreview />}
          </Box>

        </VStack>

      </Center>



    </Container >



  );
}

export default TransferBridge;

