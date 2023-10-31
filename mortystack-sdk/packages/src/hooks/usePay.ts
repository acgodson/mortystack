import { useEffect, useState } from "react";
import { usePendingTransactions } from "../hooks/usePendingTransactions";
import { generateTransactionReference, PAYMENT_PAGE_URL } from "../utils/api";

export interface PaymentDetailsProp {
  amount: number;
  email: string;
  loyaltyID?: string;
}

export interface PaymentStatus {
  code: "200" | "401" | "403" | "404" | "500";
  hash: string;
}

export const usePay = () => {
  const [connected, setConnected] = useState(false);
  const { addTransaction, removeTransaction, verifyTransaction } =
    usePendingTransactions();
  const [reference, setReference] = useState<string | null>("");
  const [status, setStatus] = useState<PaymentStatus | null>(null);

  const sendPayment = async (paymentDetails: PaymentDetailsProp) => {
    setConnected(true);
    console.log(paymentDetails);

    const { encryptedReference, expiry } = await generateTransactionReference(
      paymentDetails
    );

    console.log("encryptedRefrence from sdk", encryptedReference)
    setReference(encryptedReference);
    const encodedRef = encodeURIComponent(encryptedReference);

    const paymentUrl = `${PAYMENT_PAGE_URL}/checkout?ref=${encodedRef}`;
    const paymentWindow = window.open(paymentUrl, "_blank");
    // Set up event listener to handle messages from the payment window
    if (paymentWindow) {
      addTransaction(encryptedReference, expiry);
      paymentWindow.addEventListener("message", (event) => {
        const { transaction } = event.data;
        if (transaction) {
          if (transaction.status) {
            const status: PaymentStatus = transaction.status;
            if (status.code === "200") {
              //payment is successful
              setStatus(status);
              setReference(null);
              setConnected(false);
              //close payment modal
            } else {
              //error
              removeTransaction(transaction.reference);
              setReference(null);
              setConnected(false);
              //close payment modal, maybe add a toast
            }
          }
        }
      });
    }
  };

  return {
    connected,
    status,
    reference,
    sendPayment,
  };
};
