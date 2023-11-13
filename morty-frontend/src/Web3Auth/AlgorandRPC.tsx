import { SafeEventEmitterProvider } from "@web3auth/base";
import algosdk, { waitForConfirmation } from "algosdk";


const algodToken = {
    "x-api-key": process.env.ALGO_API_KEY!,
};
const algodServer = process.env.ALGO_RPC_URL;
const algodPort = "";

const indexerClient = new algosdk.Indexer(algodToken, algodServer, algodPort);

export default class AlgorandRPC {
    private provider: SafeEventEmitterProvider;

    constructor(provider: SafeEventEmitterProvider) {
        this.provider = provider;
    }

    getAlgorandKeyPair = async (): Promise<any> => {
        if (!this.provider) {
            return
        }

        const privateKey = (await this.provider.request({
            method: "private_key",
        })) as string;

        var passphrase = algosdk.secretKeyToMnemonic(
            Buffer.from(privateKey, "hex")
        );
        var keyPair = algosdk.mnemonicToSecretKey(passphrase);
        return keyPair;
    };

    getAccounts = async (): Promise<any> => {
        const keyPair = await this.getAlgorandKeyPair();
        return keyPair.addr;
    };

    getBalance = async (): Promise<any> => {
        const keyPair = await this.getAlgorandKeyPair();
        const client = await this.makeClient();
        const balance = await client.accountInformation(keyPair.addr).do();
        return balance.amount;
    };

    makeClient = async (): Promise<any> => {
        const algodToken = {
            "x-api-key": process.env.ALGO_API_KEY!,
        };
        const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
        const algodPort = "";
        let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        const client = algodClient;
        return client;
    };

    signMessage = async (invoice: any): Promise<any> => {
        const keyPair = await this.getAlgorandKeyPair();
        const client = await this.makeClient();
        const params = await client.getTransactionParams().do();
        const enc = new TextEncoder();
        const message = algosdk.encodeObj(invoice);
        const txn = algosdk.makePaymentTxnWithSuggestedParams(
            keyPair.addr,
            keyPair.addr,
            0,
            undefined,
            message,
            params
        );
        let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
        let txId = signedTxn.txID;
        return txId;
    };

    signAndSendTransaction = async (
        receiver: string,
        note: string,
        amount: number
    ): Promise<any> => {
        try {
            const keyPair = await this.getAlgorandKeyPair();
            const client = await this.makeClient();
            const params = await client.getTransactionParams().do();
            const enc = new TextEncoder();
            const message = enc.encode(note);
            const txn = algosdk.makePaymentTxnWithSuggestedParams(
                keyPair.addr, // sender
                receiver, // receiver
                amount,
                undefined,
                message,
                params
            );

            let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
            const txHash = await client.sendRawTransaction(signedTxn.blob).do();
            console.log(txHash);
            return txHash.txId;
        } catch (error) {
            console.log(error);
        }
    };

    fetchTransactions = async (
        address: string,
        startTime: string | null
    ): Promise<any> => {
        try {
            let limit = 5;
            let transactionInfo = startTime
                ? await indexerClient
                    .searchForTransactions()
                    .address(address)
                    .afterTime(startTime)
                    .do()
                : await indexerClient.searchForTransactions().address(address).do();

            if (transactionInfo) {
                const info = transactionInfo;
                console.log(info);
                return info;
            }
            console.log("transaction has been retrived");
        } catch (e) {
            console.log(e);
            console.trace();
        }
    };

    confirmTransaction = async (txID: string): Promise<any> => {
        const client = await this.makeClient();
        // Wait for confirmation
        let confirmedTxn = await waitForConfirmation(client, txID, 4);
        //Get the completed Transaction
        const txinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
        var notes = new TextDecoder().decode(confirmedTxn.txn.txn.note);
        const response = {
            tx: txinfo,
            note: notes,
        };
        return response;
    };

    fetchSellersAssets = async (address: string): Promise<any> => {
        try {
            let response = await indexerClient
                .lookupAccountCreatedAssets(address)
                .do();
            if (response) {
                const info = JSON.stringify(response, undefined, 2);
                console.log(info);
                return info;
            }
        } catch (e) {
            console.log(e);
        }
    };

    isAlgorandAddress = async (address: string): Promise<any> => {
        try {
            const client = await this.makeClient();
            const decode = client.decodeAddress(address);
            return true;
        } catch (ex) {
            return false;
        }
    };

    printCreatedAsset = async (
        account: string,
        assetid: number
    ): Promise<any> => {
        const client = await this.makeClient();
        let i: number;
        let accountInfo = await client.accountInformation(account).do();

        for (i = 0; i < accountInfo["created-assets"].length; i++) {
            let scrutinizedAsset = accountInfo["created-assets"][i];
            if (scrutinizedAsset["index"] == assetid) {
                console.log("AssetID = " + scrutinizedAsset["index"]);
                let myparms = JSON.stringify(scrutinizedAsset["params"], undefined, 2);
                console.log("parms = " + myparms);
                return myparms;
            }
        }
    };

    printAssetHolding = async (
        account: string,
        assetid: number
    ): Promise<any> => {
        const client = await this.makeClient();
        let i: number;

        const parami = [];
        let accountInfo = await client.accountInformation(account).do();
        for (i = 0; i < accountInfo["assets"].length; i++) {
            let scrutinizedAsset = accountInfo["assets"][i];
            if (scrutinizedAsset["asset-id"] == assetid) {
                let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
                console.log("assetholdinginfo = " + myassetholding);
                parami.push(myassetholding);
                return parami;
            }
        }
    };

    createAsset = async (
        assetName: string,
        unitName: string,
        amount: number
    ): Promise<any> => {
        const keyPair = await this.getAlgorandKeyPair();
        const client = await this.makeClient();
        const params = await client.getTransactionParams().do();

        let note = undefined;
        let addr = keyPair.addr;
        let defaultFrozen = false;
        let decimals = 0;
        let totalIssuance = 1000;
        let assetURL = "http://mortywallet.vercel.app";
        let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
        let manager = keyPair.addr;
        let reserve = keyPair.addr;
        let freeze = keyPair.addr;
        let clawback = keyPair.addr;

        // signing and sending "txn" allows "addr" to create an asset
        let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
            addr,
            note,
            totalIssuance,
            decimals,
            defaultFrozen,
            manager,
            reserve,
            freeze,
            clawback,
            unitName,
            assetName,
            assetURL,
            assetMetadataHash,
            params
        );

        const rawSignedTxn = txn.signTxn(keyPair.sk);
        let ctx = await client.sendRawTransaction(rawSignedTxn).do();

        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(client, ctx.txId, 4);
        //Get the completed Transaction
        console.log(
            "Transaction " +
            ctx.txId +
            " confirmed in round " +
            confirmedTxn["confirmed-round"]
        );

        const assetID = confirmedTxn["asset-index"];

        const result = await this.printCreatedAsset(keyPair.addr, assetID);
        return result;
    };

    acceptAsset = async (assetID: number, message: string) => {
        const keyPair = await this.getAlgorandKeyPair();
        const client = await this.makeClient();
        const params = await client.getTransactionParams().do();

        const enc = new TextEncoder();
        const note = enc.encode(message);

        //comment out the next two lines to use suggested fee
        // params.fee = 1000;
        // params.flatFee = true;

        let sender = keyPair.addr;
        let recipient = sender;
        let revocationTarget = undefined;
        let closeRemainderTo = undefined;
        let assetURL = "";
        const amount = 0;

        let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            sender,
            recipient,
            closeRemainderTo,
            revocationTarget,
            amount,
            note,
            assetID,
            params
        );

        const rawSignedTxn = opttxn.signTxn(keyPair.sk.sk);
        let ctx = await client.sendRawTransaction(rawSignedTxn).do();

        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(client, ctx.txId, 4);
        //Get the completed Transaction
        console.log(
            "Transaction " +
            ctx.txId +
            " confirmed in round " +
            confirmedTxn["confirmed-round"]
        );
        assetID = confirmedTxn["asset-index"];

        const result = await this.printCreatedAsset(keyPair.addr, assetID);
        return result;
    };

    findAssetsOnAccount = async (address: string): Promise<any> => {
        let response = await indexerClient.lookupAccountAssets(address).do();
        console.log(JSON.stringify(response, undefined, 2));
    };
} 