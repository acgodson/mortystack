import { useEffect, useState } from "react";
import { usePendingTransactions } from "../hooks/usePendingTransactions";
import { PAYMENT_PAGE_URL, generateTransactionReference } from "../utils/api";
import { useAppInfo } from "../components/MortyStackProvider/contexts/AppContext";
import {
  AssetOptionType,
  PayButtonProps,
  PaymentStatus,
  assets,
  initAssets,
} from "../utils/helpers";

export const ASSET_IDS: AssetOptionType = {
  USDC: 10458941,
  WMATIC: 212942045,
  WETH: 86782447,
  ALGOS: 0,
};
export const ASSET_NAMES = {
  USDC: "USDC",
  WMATIC: "WMATIC",
  WETH: "WETH",
  ALGOS: "ALGOS",
};

export const usePay = () => {
  const appInfo = useAppInfo();
  const { reference, setReference, receipt, setReceipt, txnID, setTxnID } =
    appInfo;
  const [connected, setConnected] = useState<any | null>(false);
  const { addTransaction, removeTransaction, verifyTransaction } =
    usePendingTransactions();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [countdown, setCountdown] = useState<number>(300);
  const [verifierStatus, setVerifierStatus] = useState<boolean>(false);
  const [txn, setTxn] = useState<string | undefined>();

  const startCountdown = () => {
    if (!reference) {
      return;
    }
    setCountdown(300);
    localStorage.setItem("lastReference", reference);
  };

  const cancelCountdown = () => {
    setCountdown(0);
    localStorage.removeItem("lastReference");
  };

  const verify = async () => {
    console.log("is verifying mate");
    return;
    try {
      const headersList = {
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify({ ref: reference });

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      const data = await response.json();

      if (data.success) {
        if (data.status) {
          const transactionId = data.txID;
          setTxn(transactionId);
          localStorage.removeItem("lastReference");
        } else {
          setCountdown(0);
          localStorage.removeItem("lastReference");
        }

        setVerifierStatus(!data.status);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };
  useEffect(() => {
    const storedReference = localStorage.getItem("lastReference");

    if (storedReference === reference) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown > 0 ? prevCountdown - 1 : 0
        );
      }, 1000);

      verify();
      return () => clearInterval(interval);
    } else {
      startCountdown();

      const interval = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown > 0 ? prevCountdown - 1 : 0
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [reference]);

  const sendPayment = async (paymentDetails: PayButtonProps) => {
    setConnected(true);

    if (!appInfo.signer) {
      console.error("no signer address found");
      return;
    }

    console.log(appInfo.signer.addr);

    //prepare asset
    const filter = assets.find((x) => x.id === Number(paymentDetails.asset));

    if (!filter) {
      console.log("seller does not support asset");
      throw "seller does not support asset";
      return;
    }

    const invoiceToken =
      filter.symbol.toString() + " (" + filter.id.toString() + ")";

    let headersList = {
      "Content-Type": "application/json",
    };

    console.log("this is the id", appInfo.id);

    let bodyContent = JSON.stringify({
      organization: appInfo.id,
      signer: appInfo.signer.addr,
    });
    //TODO: remember to replace with url addresses
    let response = await fetch("http://algo.localhost:3000/api/verify-record", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let data = await response.json();
    console.log(data);

    if (!data.success) {
      console.log("error", data);
      return;
    }

    const metadata = {
      organization: appInfo.id,
      invoiceTotal: paymentDetails.amount,
      contactEmail: paymentDetails.name,
      customerName: paymentDetails.name,
      customerEmail: paymentDetails.email,
      invoiceTitle: null,
      invoiceToken: invoiceToken,
      invoiceItems: null,
      acceptWrapped: paymentDetails.acceptWrapped ? true : false,
      record: data.reecord,
      signer: appInfo.signer.addr, //replace with signer in config
    };

    //send a second request to create new invoice and return the reference
    const { ref, expiry } = await generateTransactionReference(metadata);

    console.log("payment reference from sdk", ref);

    setReference(ref);

    const encodedRef = encodeURIComponent(ref);

    const paymentUrl = `${PAYMENT_PAGE_URL}/pay?ref=${encodedRef}`;
    const paymentWindow = window.open(paymentUrl, "_blank");
    if (paymentWindow) {
      paymentWindow.addEventListener("message", (event) => {
        console.log(event);

        const { type, reference, txnID, returnValue } = event.data;
        console.log("Payment was successful for reference:", reference);
        console.log("Transaction ID:", txnID);
        console.log("Return Value:", returnValue);
        setStatus(status);
        setReference(null);
        setConnected(false);
        setTxnID(txnID);
      });
    }
  };

  useEffect(() => {
    console.log(txnID);
  }, [txnID]);

  return {
    ASSET_IDS,
    appInfo,
    status,
    reference,
    connected,
    countdown,
    verifierStatus,
    txn,
    initAssets,
    sendPayment,
  };
};

// Set up event listener to handle messages from the payment window
