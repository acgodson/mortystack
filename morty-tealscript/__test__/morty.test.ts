import { describe, test, expect, beforeAll, beforeEach } from "@jest/globals";
import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { algorandFixture } from "@algorandfoundation/algokit-utils/testing";
import {
  algos,
  microAlgos,
  getOrCreateKmdWalletAccount,
} from "@algorandfoundation/algokit-utils";
import { MortyClient } from "../contracts/clients/MortyClient";
import {
  algodClient,
  calculateKeccak256,
  hexToUint8Array,
  indexerClient,
  kmdClient,
} from "../utils";

const fixture = algorandFixture();

let appClient: MortyClient;

describe("Morty", () => {
  let algod: algosdk.Algodv2;
  let sender: algosdk.Account;
  const description: string = "Payment for goods";
  const PaymentASAAmount = 500000;
  let sellerRef = "myshop";
  let dispenserAccount: any;
  let buyerAccount: any;
  let paymentASA: bigint | number;
  let recordReference: Uint8Array;
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount, kmd } = fixture.context;
    algod = fixture.context.algod;

    sender = await getOrCreateKmdWalletAccount(
      {
        name: "tealscript-dao-sender",
        fundWith: algos(10),
      },
      algod,
      kmd
    );

    appClient = new MortyClient(
      {
        sender: testAccount,
        resolveBy: "id",
        id: 0,
      },
      algod
    );

    dispenserAccount = await algokit.getDispenserAccount(
      algodClient,
      kmdClient
    );

    await appClient.create.createApplication({});
  }, 15_000);

  test("Prepare Sample Asset (USDC)", async () => {
    await algokit.transferAlgos(
      {
        from: dispenserAccount,
        to: sender.addr,
        amount: microAlgos(500000),
      },
      algod
    );

    const createAssetTxn =
      algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: await algokit.getTransactionParams(
          undefined,
          algodClient
        ),
        total: PaymentASAAmount,
        decimals: 0,
        defaultFrozen: false,
      });

    await algokit.sendTransaction(
      { from: sender, transaction: createAssetTxn },
      algodClient
    );

    const result = await algokit.waitForConfirmation(
      createAssetTxn.txID().toString(),
      3,
      algodClient
    );
    if (result) {
      paymentASA = Number(result.assetIndex);
    }
  });

  test("Register Seller (subscribe & create Record)", async () => {
    await appClient.appClient.fundAppAccount(microAlgos(600_000));

    const seller = algosdk.decodeAddress(sender.addr);

    const subscriptionResult = await appClient.subscribe(
      { account: seller.publicKey },
      {
        sendParams: {
          fee: microAlgos(1_000),
        },
        boxes: [seller.publicKey],
        sender: sender,
      }
    );

    const result: any = subscriptionResult.return!.valueOf();
    const resultSum = result.map((x: bigint) => Number(x));
    const period: number = resultSum.reduce(
      (acc: number, num: number) => acc + num,
      0
    );
    const reference = calculateKeccak256(sellerRef + period.toString());

    await appClient.createRecord(
      {
        account: algosdk.decodeAddress(sender.addr).publicKey,
        ref: sellerRef,
        asset: paymentASA,
      },
      {
        sendParams: {
          fee: microAlgos(4_000),
        },
        boxes: [seller.publicKey, hexToUint8Array(reference)],
        sender: sender,
      }
    );
    recordReference = hexToUint8Array(reference);
  });

  test("Prepare Sample Customer", async () => {
    buyerAccount = algokit.randomAccount();

    await algokit.transferAlgos(
      {
        from: dispenserAccount,
        to: buyerAccount.addr,
        amount: microAlgos(10000000),
      },
      algod
    );

    //opt into payment asset
    const OptInzTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject(
      {
        from: buyerAccount.addr,
        suggestedParams: await algokit.getTransactionParams(undefined, algod),
        to: buyerAccount.addr,
        amount: 0,
        assetIndex: Number(paymentASA),
      }
    );

    await algokit.sendTransaction(
      { from: buyerAccount, transaction: OptInzTxn },
      algodClient
    );

    //Receive a sample asset to use for payment
    const RecvAsstTxn =
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: sender.addr,
        suggestedParams: await algokit.getTransactionParams(undefined, algod),
        to: buyerAccount.addr,
        amount: 300000,
        assetIndex: Number(paymentASA),
      });

    await algokit.sendTransaction(
      { from: sender, transaction: RecvAsstTxn },
      algodClient
    );
  });

  test("Send Payment to Seller", async () => {
    await appClient.appClient.fundAppAccount(microAlgos(800_000));

    const txIndex = (
      await appClient.getGlobalState()
    ).TxnIDx?.asNumber().valueOf();

    const atc = new algosdk.AtomicTransactionComposer();

    const suggestedParams = await algodClient.getTransactionParams().do();

    atc.addMethodCall({
      method: appClient.appClient.getABIMethod("makePayment")!,
      methodArgs: [
        paymentASA,
        300000,
        description,
        algosdk.decodeAddress(sender.addr).publicKey,
        sellerRef,
        buyerAccount.addr,
        sender.addr,
      ],
      suggestedParams: {
        ...suggestedParams,
        fee: 3000,
      },
      sender: buyerAccount.addr,
      boxes: [
        {
          appIndex: Number((await appClient.appClient.getAppReference()).appId),
          name: algosdk.encodeUint64(txIndex!),
        },
        {
          appIndex: Number((await appClient.appClient.getAppReference()).appId),
          name: algosdk.decodeAddress(sender.addr).publicKey,
        },
        {
          appIndex: Number((await appClient.appClient.getAppReference()).appId),
          name: recordReference,
        },
      ],
      appID: Number((await appClient.appClient.getAppReference()).appId),
      signer: algosdk.makeBasicAccountTransactionSigner(buyerAccount),
    });

    const depositTxn =
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: buyerAccount.addr,
        suggestedParams: await algokit.getTransactionParams(undefined, algod),
        to: (await appClient.appClient.getAppReference()).appAddress,
        amount: 300000,
        assetIndex: Number(paymentASA),
      });

    atc.addTransaction({
      txn: depositTxn,
      signer: algosdk.makeBasicAccountTransactionSigner(buyerAccount),
    });

    atc.submit(algod);
  });

  test("Make Payment Claim", async () => {
    await appClient.appClient.fundAppAccount(microAlgos(200_000));
    // fetch all payments
    const myPayments = await appClient.getMyTxnIDs(
      {
        reference: recordReference,
      },
      {
        boxes: [recordReference],
      }
    );

    const returnedIDs: any = myPayments.return?.valueOf();

    let transactions = [];

    for (let i = 0; i < returnedIDs.length; i++) {
      const fetchTxnInfo = await appClient.getTxnInfo(
        {
          txID: returnedIDs[i],
        },
        {
          boxes: [algosdk.encodeUint64(returnedIDs[i])],
        }
      );

      const txnInfo: any = fetchTxnInfo.return?.valueOf();

      const fetchTxnReceipt = await appClient.getReceipt(
        {
          txID: returnedIDs[i],
        },
        {
          boxes: [algosdk.encodeUint64(returnedIDs[i])],
        }
      );

      const fetchTxnVault = await appClient.getVault(
        {
          txID: returnedIDs[i],
        },
        {
          boxes: [algosdk.encodeUint64(returnedIDs[i])],
        }
      );
      const rcptInfo: any = fetchTxnReceipt.return?.valueOf();
      const vaultInfo: any = fetchTxnVault.return?.valueOf();
      const obj = {
        vault: vaultInfo,
        amount: txnInfo[0],
        description: txnInfo[1],
        status: Number(txnInfo[2]) === 0 ? "unclaimed" : "paid",
        round: Number(txnInfo[3]),
        id: Number(returnedIDs[i]),
        receipt: Number(rcptInfo),
      };
      transactions.push(obj);
    }
    const chargesTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      suggestedParams: await algodClient.getTransactionParams().do(),
      to: sender.addr,
      amount: 0,
    });

    const makeClaim = await appClient.claimPayment(
      {
        txID: transactions[0].id,
        payASA: paymentASA,
        txn: chargesTxn,
      },
      {
        boxes: [algosdk.encodeUint64(transactions[0].id)],
        sender: sender,
      }
    );

    // await algokit.waitForConfirmation(makeClaim.transaction.txID(), 3, algod);

    const b = await indexerClient.lookupAssetBalances(Number(paymentASA)).do();
    const list: any[] = b.balances;
    const filtered = list.filter((x) => x.address === sender.addr);
  });
});
