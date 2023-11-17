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

  const [connected, setConnected] = useState<any | null>(false);
  const { addTransaction, removeTransaction, verifyTransaction } =
    usePendingTransactions();
  const [reference, setReference] = useState<string | null>("");
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
    let response = await fetch("https://mortystack.xyz/api/verify-record", {
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
    if (ref) {
      setReference(ref);
    }

    const encodedRef = encodeURIComponent(ref);

    const paymentUrl = `${PAYMENT_PAGE_URL}/pay?ref=${encodedRef}`;
    const paymentWindow = window.open(paymentUrl, "_blank");
  };

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
// if (paymentWindow) {
//   addTransaction(encryptedReference, expiry);
//   paymentWindow.addEventListener("message", (event) => {
//     const { transaction } = event.data;
//     if (transaction) {
//       if (transaction.status) {
//         const status: PaymentStatus = transaction.status;
//         if (status.code === "200") {
//           //payment is successful
//           setStatus(status);
//           setReference(null);
//           setConnected(false);
//           //close payment modal
//         } else {
//           //error
//           removeTransaction(transaction.reference);
//           setReference(null);
//           setConnected(false);
//           //close payment modal, maybe add a toast
//         }
//       }
//     }
//   });
// }
