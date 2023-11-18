import { TransactionSignerPair } from "@certusone/wormhole-sdk/lib/esm/algorand";
import { Algodv2, assignGroupID, waitForConfirmation } from "algosdk";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  ALGORAND_WAIT_FOR_CONFIRMATIONS,
  getTokenBridgeAddressForChain,
} from "./consts";
import { PeraWalletConnect } from "@perawallet/connect";
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels";
import {
  ChainId,
  isEVMChain,
  getOriginalAssetAlgorand,
  getForeignAssetEth,
  getOriginalAssetEth,
  uint8ArrayToHex,
  getForeignAssetAlgorand,
  hexToNativeString,
  tryHexToNativeString,
} from "@certusone/wormhole-sdk";
import { ethers } from "ethers";
import { receiveDataWrapper } from "./helpers";
import { zeroPad } from "@ethersproject/bytes";

export async function signSendAndConfirmAlgorand(
  algodClient: Algodv2,
  txs: TransactionSignerPair[]
) {
  const peraWallet = new PeraWalletConnect({
    chainId: 416001,
  });

  assignGroupID(txs.map((tx) => tx.tx));

  const signedTxns: Uint8Array[] = [];
  const lsigSignedTxns: Uint8Array[] = [];
  const walletUnsignedTxns: Uint8Array[] | any[] = [];
  // sign all the lsigs
  for (const lsigTx of txs) {
    if (lsigTx.signer) {
      lsigSignedTxns.push(await lsigTx.signer.signTxn(lsigTx.tx));
    }
  }
  // assemble the txs for the wallet to sign
  for (const walletTx of txs) {
    if (!walletTx.signer) {
      walletUnsignedTxns.push(walletTx.tx.toByte());
    }
  }
  const xxx: SignerTransaction[][] = walletUnsignedTxns.map((txn) => [txn]);
  const walletSignedTxns = await peraWallet.signTransaction(xxx);

  let lsigIdx = 0;
  let walletIdx = 0;
  for (const originalTx of txs) {
    if (originalTx.signer) {
      signedTxns.push(lsigSignedTxns[lsigIdx++]);
    } else {
      signedTxns.push(walletSignedTxns[walletIdx++]);
    }
  }
  await algodClient.sendRawTransaction(signedTxns).do();
  const result = await waitForConfirmation(
    algodClient,
    txs[txs.length - 1].tx.txID(),
    ALGORAND_WAIT_FOR_CONFIRMATIONS
  );
  return result;
}

export const getTokenEquivalent = async (
  sourceChain: number,
  method: string,
  provider: any
) => {
  const payerChain = sourceChain as ChainId;

  if (!isEVMChain(payerChain)) {
    console.log(
      "This payment option is evm compatible only. Please connect an evm wallet"
    );
    return;
  }
  if (!payerChain) {
    console.error("no source chain");
    return;
  }

  try {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const wrappedInfo = await getOriginalAssetAlgorand(
      //@ts-ignore
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      BigInt(method)
    );

    console.log("wrapped info", wrappedInfo);
    return;

    const { chainId, assetAddress } = wrappedInfo;
    console.log(wrappedInfo);

    if (chainId === payerChain) {
      const readableTargetAddress = tryHexToNativeString(
        uint8ArrayToHex(assetAddress),
        chainId
      );
      console.log(readableTargetAddress);

      const result = receiveDataWrapper({
        doesExist:
          readableTargetAddress &&
          readableTargetAddress !== ethers.constants.AddressZero
            ? true
            : false,
        address: readableTargetAddress,
      });

      return result;
    }

    const asset = await getForeignAssetEth(
      getTokenBridgeAddressForChain(payerChain),
      provider!,
      chainId,
      assetAddress
    );

    const result = receiveDataWrapper({
      doesExist: asset && asset !== ethers.constants.AddressZero ? true : false,
      address: asset,
    });

    console.log("thankss s syou", result);
    return result;
  } catch (e) {
    console.log(
      "Unable to determine existence of wrapped asset. Please try another payment method"
    );
  }
};
