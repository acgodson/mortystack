
import { MortyClient } from '@/tsContracts/MortyClient';
import { ALGORAND_HOST } from '@/utils/wormhole/consts';
import algosdk, { Algodv2 } from 'algosdk';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3AuthProvider } from './Web3AuthContext';
import { useWallet } from '@txnlab/use-wallet';
import { calculateKeccak256, generateUniqueReferenceID, hexToUint8Array } from '@/utils/helpers';
import { useFirebaseStorage } from '@/hooks/useFireStorage';
import { getDownloadURL } from 'firebase/storage';
import { createParsedTokenAccount } from '@/utils/wormhole/parsedTokenAccount';
import { formatUnits } from '@ethersproject/units';
import { InvoiceItem, useInvoiceDetails } from '@/hooks/useInvoiceDetails';
import { microAlgos } from '@algorandfoundation/algokit-utils';
import { useToast } from '@chakra-ui/react';
import { FaGalacticSenate } from 'react-icons/fa';


const algodToken = {
    "x-api-key": process.env.ALGO_API_KEY!,
};


export interface SenderType {
    signer: algosdk.TransactionSigner;
    addr: string;
}

export interface PaymentTxnType {
    token: number, amount: number, description: string, sellersSigner: string, organizationID: string, from: string
    reference: string
}

interface TransactionContextProps {
    typedClient: MortyClient | undefined;
    selectedTransaction: any;
    appID: number;
    sender: SenderType | undefined;
    isSubscribing?: boolean | undefined;
    isCreatingOrg?: boolean | undefined;
    hasError: string | null,
    fetchingBal: boolean,
    subExpires: number | null,
    name: string,
    category: string,
    signer: algosdk.TransactionSigner | undefined,
    setSelectedTransaction(index: number): void,
    setIsSubscribing(isSubscribing: boolean): void,
    setIsCreatingOrg(isCreatingOrg: boolean): void,
    setAppID(index: number): void,
    Subscribe(account: Uint8Array, boxes: any[]): void,
    CreateRecord(name: string, category: string, selectedImage: File | null): void,
    toggleProvider(index: number): void,
    setName(namee: string): void,
    setCategory(namee: string): void,
    getAssetHoildings(): any,
    organization: string;
    setOrganization: (value: string) => void;
    contactEmail: string;
    setContactEmail: (value: string) => void;
    customerName: string;
    setCustomerName: (value: string) => void;
    customerEmail: string;
    setCustomerEmail: (value: string) => void;
    invoiceTitle: string;
    setInvoiceTitle: (value: string) => void;
    invoiceToken: string;
    setInvoiceToken: (value: string) => void;
    invoiceItems: InvoiceItem[];
    handleAddItem: () => void;
    handleItemInputChange: (
        index: number,
        field: keyof InvoiceItem,
        value: InvoiceItem[keyof InvoiceItem]
    ) => void;
    invoiceTotal: number;
    setInvoiceItems: (value: InvoiceItem[]) => void;
    reset: () => void;
    activeStep: number;
    setActiveStep: (value: number) => void;
    preview: boolean;
    setPreview: (value: boolean) => void;
    hasDispenser: boolean;
    setHasDispenser: (value: boolean) => void;
    record: string;
    setRecord: (value: string) => void;
    CreateInvoice: (metadata: any) => any;
    isSubmittingInvoice: boolean,
    setIsSubmittingInvoice: (value: boolean) => void
    CreateApplication: () => void
    page: number,
    setPage: (value: number) => void,
}


async function UploadOrgOffline(metadata: any, userid: string) {

    console.log("new organization metadata", metadata)

    let headers = {
        "Content-Type": "application/json"
    }

    let body = JSON.stringify({
        "uid": userid,
        "metadata": metadata
    });

    let response = await fetch("/api/update-org", {
        method: "POST",
        body: body,
        headers
    });

    let data = await response.json();
    console.log(data.success);
}



const TransactionContext = createContext<TransactionContextProps>({
    typedClient: undefined,
    selectedTransaction: null,
    appID: 0,
    sender: undefined,
    hasError: null,
    fetchingBal: false,
    signer: undefined,
    subExpires: null,
    name: "",
    category: "",
    setSelectedTransaction: (index: number) => { },
    setIsSubscribing: (isSubscribing: boolean) => { },
    setIsCreatingOrg: (isSubscribing: boolean) => { },
    setAppID: (index: number) => { },
    Subscribe: (account: Uint8Array, boxes: any[]) => { },
    CreateRecord: (name: string, category: string, selectedImage: File | null) => { },
    toggleProvider: (index: number) => { },
    setName: (name: string) => { },
    setCategory: (name: string) => { },
    getAssetHoildings: () => [],
    organization: '',
    setOrganization: () => { },
    contactEmail: '',
    setContactEmail: () => { },
    customerName: '',
    setCustomerName: () => { },
    customerEmail: '',
    setCustomerEmail: () => { },
    invoiceTitle: '',
    setInvoiceTitle: () => { },
    invoiceToken: '',
    setInvoiceToken: () => { },
    invoiceItems: [],
    handleAddItem: () => { },
    handleItemInputChange: () => { },
    invoiceTotal: 0,
    setInvoiceItems: () => { },
    reset: () => { },
    activeStep: 0,
    setActiveStep: () => { },
    preview: false,
    setPreview: () => { },
    hasDispenser: true,
    setHasDispenser: () => { },
    record: '',
    setRecord: () => { },
    CreateInvoice: (metadata: any) => [],
    isSubmittingInvoice: false,
    setIsSubmittingInvoice: () => { },
    CreateApplication: () => { },
    page: 0,
    setPage: () => { },

});

const algodClient = new Algodv2(
    ALGORAND_HOST.algodToken,
    ALGORAND_HOST.algodServer,
    ALGORAND_HOST.algodPort
);

export const TransactionProvider = ({ children }: any) => {
    const [page, setPage] = useState(0)
    const { user, web3AuthAccount, status, web3AuthBalance, setSelectedProvider, refs, selectedProvider, setStatus, getUserStatus,
        organizations, setOrganizations, fetchRefs, invoices, fetchInvoices }: any = useWeb3AuthProvider()
    const { providers, activeAddress, signer } = useWallet()
    const [fetchingBal, setFetchingBal] = useState<boolean>(false)
    const [appID, setAppID] = useState<number>(479526612)
    const [hasError, setHasError] = useState<string | null>(null)
    const [balance, setBalance] = useState<number | null>(null)
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subExpires, setSubExpires] = useState<any | null>(null);
    const sender = { signer, addr: activeAddress! }
    const [isCreatingOrg, setIsCreatingOrg] = useState(false)
    const [name, setName] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
    const toast = useToast()
    const typedClient = new MortyClient(
        {
            sender: web3AuthAccount,
            resolveBy: 'id',
            id: appID,
        },
        algodClient
    );

    const { getRef, upload } = useFirebaseStorage()

    // GQFIDU622V6ZIVD6E2X2N72IIHBRD6ZACJQ6GS4F5XZFW3S3ZMYN4STEPM
    const invoiceTxns = useInvoiceDetails()


    const toggleProvider = (index: number) => {
        setSelectedProvider(index);
        setStatus(null)
    };



    useEffect(() => {

        if (user && !status && activeAddress && selectedProvider === 1) {
            console.log("firebase", user)

            // console.log(user.id)
            getUserStatus(user.id, activeAddress)
        }
    }, [user, status, selectedProvider, activeAddress])

    // useEffect(() => {
    //     console.log(status)
    // }, [status])




    useEffect(() => {
        if (selectedProvider === 1) {
            try {
                if (!activeAddress) {
                    return
                } else {
                    setSelectedProvider(1)
                    setFetchingBal(true)
                }
            } catch (e) {
                setSelectedProvider(0)
                setHasError("connection failed try again!")
            }
        } else {
            if (selectedProvider === 0) {
                setFetchingBal(true);
                setSelectedProvider(0)
            }
        }
    }, [selectedProvider, activeAddress, setFetchingBal])



    const getBalance = async (addr: string): Promise<any> => {
        if (!addr) {
            return;
        }
        try {
            const result = await algodClient.accountInformation(addr).do();
            const formattedAmount = Math.floor(result.amount / 1e6);
            setBalance(formattedAmount);
            setFetchingBal(false);
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance(null); // Reset balance if there's an error
            setFetchingBal(false);
            setHasError('error')
        }
    };

    useEffect(() => {
        if (selectedProvider === 1) {
            if (activeAddress && fetchingBal) {
                getBalance(activeAddress)
            }
        } else {
            if (web3AuthAccount && fetchingBal) {
                getBalance(web3AuthAccount.addr)
            }
        }
    }, [selectedProvider, web3AuthAccount, fetchingBal])

    useEffect(() => {

        if (activeAddress) {
            if (balance! < 2) {
                const txnErr = 'Insufficent Balance, requires at least 0.21 Algos for transaction fees'
                setHasError(txnErr)
            } else {
                setHasError("")
            }
        } else {
            if (web3AuthBalance! < 2) {
                const txnErr = 'Insufficent Balance, requires at least 0.21 Algos for transaction fees'
                setHasError(txnErr)
            } else {
                setHasError("")
            }
        }
    }, [balance, activeAddress, web3AuthBalance])



    async function getSub() {
        if (appID === 0) {
            return
        }
        console.log(`Calling last Subscription`)
        const ref = selectedProvider === 1 ? activeAddress : web3AuthAccount.addr;
        if (!ref) {
            return
        }
        try {
            const result = await typedClient.appClient.getBoxValue(algosdk.decodeAddress(ref).publicKey);
            if (result) {
                const decoder = new algosdk.ABITupleType([
                    new algosdk.ABIUintType(64),
                    new algosdk.ABIUintType(64),
                ]);
                const value = decoder.decode(result)
                console.log(value);
                setSubExpires(Number(value[1]))
            }
        } catch (e) {
            console.log("error trying t find subscription from box values")
            setSubExpires([])
        }
    }

    useEffect(() => {
        if (status && status > 0 && typedClient && !subExpires) {
            getSub()
        }
    }, [status, subExpires, typedClient])


    const getRefs = async () => {
        if (!web3AuthAccount) {
            if (!activeAddress) {
                return
            }
        }
        const x = await fetchRefs(activeAddress)
        console.log(x)
    }


    useEffect(() => {
        if (!refs && activeAddress && web3AuthAccount) {
            getRefs()
        }
    })

    useEffect(() => {

        if (refs && refs.length > 0 && !invoices) {
            fetchInvoices(refs);
        }

    }, [refs, invoices])




    async function getAssetHoildings() {

        if (!activeAddress) {
            return [];
        }
        let list = [];
        const algodServer = process.env.ALGO_INDEXER_URL;
        const algodPort = "";

        const indexerClient = new algosdk.Indexer(algodToken, algodServer, algodPort);

        let response = await indexerClient.lookupAccountAssets(activeAddress).do();

        for (const asset of response.assets) {
            const assetId = asset["asset-id"];
            const assetInfo = await algodClient.getAssetByID(assetId).do();
            const metadata = {
                tokenName: assetInfo.params.name,
                symbol: assetInfo.params["unit-name"],
                decimals: assetInfo.params.decimals,
            };
            const amount = asset.amount;
            const tk = createParsedTokenAccount(
                activeAddress,
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
            list.push({
                mintKey: tk.mintKey,
                symbol: tk.symbol,
                bal: tk.uiAmount
            })
        }
        if (response) {
            return list
        }
        console.log(list)
        return []
    }



    //creating a new application
    const CreateApplication = async () => {
        console.log(`Calling createApplication`)
        const x = await typedClient.create.createApplication(
            {},
            { sender },
        );
        console.log(x)
        return x

    }


    //function for subscribing
    const Subscribe = async (account: Uint8Array, boxes: any[]) => {
        if (!activeAddress) {
            return;
        }
        setIsSubscribing(true)
        console.log(`Calling subscribe`)
        const atc = new algosdk.AtomicTransactionComposer();
        const suggestedParams = await algodClient.getTransactionParams().do();

        const depositTxn =
            algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: activeAddress,
                suggestedParams: await algodClient.getTransactionParams().do(),
                to: (await typedClient.appClient.getAppReference()).appAddress,
                amount: 200_000,
            });

        atc.addTransaction({
            txn: depositTxn,
            signer,
        });

        atc.addMethodCall({
            method: typedClient.appClient.getABIMethod("subscribe")!,
            methodArgs: [account],
            suggestedParams: suggestedParams,
            sender: activeAddress!,
            boxes,
            appID,
            signer,
        });

        const result = await atc.execute(algodClient, 4)
        let list = [];
        for (const res in result) {
            const test: any = result.methodResults.valueOf()
            console.log(result.methodResults.valueOf())
            const dates = test[0].returnValue
            console.log(dates)
            list.push(...dates)
        }


        const resultSum = list.map((x: bigint) => Number(x));
        const period: number = resultSum.reduce(
            (acc: number, num: number) => acc + num,
            0
        );

        //let's update the server with the latest subscription
        let headers = {
            "Content-Type": "application/json"
        }

        let body = JSON.stringify({
            "userId": user.id,
            "address": activeAddress,
            "period": resultSum
        });

        let response = await fetch("/api/update-sub", {
            method: "POST",
            body: body,
            headers
        });

        let data = await response.json();
        console.log(data.success);

        if (data.success) {
            setIsSubscribing(false)
            setStatus(null)
        }
    }


    //function adding an organization
    const CreateRecord = async (name: string, category: string, selectedImage?: File | null) => {

        setIsCreatingOrg(true)
        if (!user || !activeAddress) {
            return;
        }
        let url;

        //calculate organuzation ID
        const OID = generateUniqueReferenceID(name, user.id)


        try {

            //calculate subscription date
            const subscription = await typedClient.appClient.getBoxValue(algosdk.decodeAddress(activeAddress!).publicKey);

            const decoder = new algosdk.ABITupleType([
                new algosdk.ABIUintType(64),
                new algosdk.ABIUintType(64),
            ]);
            if (!decoder) {
                console.log("error, can't find subscription")
                return
            }

            const subscriptionValue: any = decoder.decode(subscription)
            console.log(subscriptionValue);
            const resultSum = subscriptionValue.map((x: bigint) => Number(x));
            const period: number = resultSum.reduce(
                (acc: number, num: number) => acc + num,
                0
            );

            console.log("subscription-data: " + subscriptionValue, period);

            const reference = calculateKeccak256(OID + period.toString());

            console.log("reference-for-record: " + reference);


            const atc = new algosdk.AtomicTransactionComposer();
            const suggestedParams = await algodClient.getTransactionParams().do();
            const encoder = new TextEncoder;


            const depositTxn =
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    from: activeAddress,
                    suggestedParams: await algodClient.getTransactionParams().do(),
                    to: (await typedClient.appClient.getAppReference()).appAddress,
                    amount: 200_000,

                });

            atc.addTransaction({
                txn: depositTxn,
                signer,
            });


            atc.addMethodCall({
                method: typedClient.appClient.getABIMethod("createRecord")!,
                methodArgs: [algosdk.decodeAddress(activeAddress!).publicKey, encoder.encode(OID)],
                suggestedParams: suggestedParams,
                sender: activeAddress,
                boxes: [
                    {
                        appIndex: appID,
                        name: algosdk.decodeAddress(activeAddress).publicKey
                    },
                    {
                        appIndex: appID,
                        name: hexToUint8Array(reference)
                    },
                ],
                appID,
                signer,
            });

            const result = await atc.execute(algodClient, 4)

            console.log(result)

            //upload on fire storage
            if (selectedImage) {
                //process sending image
                const storageRef = getRef(name);
                await upload(storageRef, selectedImage!)
                getDownloadURL(storageRef)
                    .then(async (_url) => {
                        url = _url
                        console.log(_url)

                        const metadata = {
                            oid: OID,
                            name: name,
                            category: category,
                            url: url
                        }

                        await UploadOrgOffline(metadata, user.id)

                    })
                    .catch((error) => {
                        console.error(error.message)
                    });
            } else {

                const metadata = {
                    oid: OID,
                    name: name,
                    category: category,
                    url: url
                }

                await UploadOrgOffline(metadata, user.id)
            }

            toast({
                status: "success",
                description: "Record Created Successfully",
                position: "top-right",
                duration: 10000
            });
            setIsCreatingOrg(false)
            setName("")
            setCategory("")
            setOrganizations(null)
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsCreatingOrg(false)
        }






        // console.log(`Calling createRecord`)
        // //we just want to register an organziation offline
        // await typedClient.createRecord(
        //     {
        //         account: account,
        //         ref: ref,
        //         asset: 123  //remember to remove this
        //     },
        //     { sender },
        // );


    }

    //function for creating an invoice
    const CreateInvoice = async (metadata: any) => {
        let refs = []
        const dataObject = {
            ref: metadata.record,
            metadata
        }
        setIsSubmittingInvoice(true)
        console.log("ready for submission", dataObject)
        let headersList = {
            "Content-Type": "application/json"
        }
        let bodyContent = JSON.stringify(dataObject);
        let response = await fetch("/api/upload-invoice", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });
        let data = await response.json();
        console.log(data);
        if (data.ref) {
            refs.push(data.ref)
        }
        setIsSubmittingInvoice(false)
        return refs
    }

    return (
        <TransactionContext.Provider value={{
            typedClient,
            selectedTransaction,
            appID,
            sender,
            isSubscribing,
            hasError,
            fetchingBal,
            subExpires,
            name,
            category,
            signer,
            setSelectedTransaction,
            setIsSubscribing,
            setAppID,
            Subscribe,
            toggleProvider,
            isCreatingOrg,
            setIsCreatingOrg,
            CreateRecord,
            CreateApplication,
            setName,
            setCategory,
            getAssetHoildings,
            CreateInvoice,
            ...invoiceTxns,
            isSubmittingInvoice,
            setIsSubmittingInvoice,
            page,
            setPage,
        }}>
            {children}
        </TransactionContext.Provider>
    );
};



export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};
