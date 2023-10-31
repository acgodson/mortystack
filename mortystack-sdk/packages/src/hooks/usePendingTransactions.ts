import { useEffect, useState } from "react";
import { PaymentStatus } from "./usePay";

interface Transaction {
  status: PaymentStatus;
  reference: string;
}

interface PendingTransaction {
  status: PaymentStatus;
  reference: string;
  expiry: number;
}

//remote check is disabled for now -TODO: jwt verification system
export const usePendingTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[] | any[]
  >([]);
  const [remoteCheck, setRemoteCheck] = useState(false);

  useEffect(() => {
    //on page refresh check local storage for pending transactions
    const storage = localStorage.getItem("pendingTransactions");
    if (storage) {
      //then update pending transactions with value in storag
      setPendingTransactions(JSON.parse(storage));
    } else {
      setPendingTransactions([]); //empty array
    }
  }, []);

  useEffect(() => {
    const checkExpiry = () => {
      pendingTransactions?.forEach((transaction: PendingTransaction) => {
        const isValid = verifyTransaction(transaction.reference);
        if (transaction.expiry > Date.now() && !isValid) {
          removeTransaction(transaction);
        }
      });
    };

    const remotePendingTransactions = async (email: string) => {
      let fetchDataFromAPI: any; //placeholder

      const remote: any = await fetchDataFromAPI(email);

      if (remote.data) {
        const remoteReferences = remote.data.map((item: any) => item.reference);

        const uniqueReferences = new Set([
          ...pendingTransactions,
          ...remoteReferences,
        ]);
        const uniqueReferencesArray = Array.from(uniqueReferences);

        setPendingTransactions(uniqueReferencesArray);
      }
      setRemoteCheck(true);
    };
    // if (!remoteCheck) {
    //   remotePendingTransactions();
    // }

    if (pendingTransactions.length > 0) {
      checkExpiry();
    }
  }, [
    pendingTransactions,
    // remoteCheck
  ]);

  const removeTransaction = async (transactionReference: any) => {
    if (pendingTransactions) {
      const updatedList = pendingTransactions!.filter(
        (ref) => ref !== transactionReference
      );
      setPendingTransactions(updatedList);
      localStorage.setItem("pendingTransactions", JSON.stringify(updatedList));
    }
  };

  const addTransaction = async (transactionReference: any, expiry: number) => {
    const updatedTransaction = [
      ...pendingTransactions!,
      { transactionReference, status: null, expiry },
    ];
    setPendingTransactions(updatedTransaction);
    localStorage.setItem(
      "pendingTransactions",
      JSON.stringify(updatedTransaction)
    );
  };

  const verifyTransaction = async (transactionReference: string) => {
    const RetrieveTxn = async (transactionReference: string) => {
      return true;
    };
    //send to API
    const isValid = await RetrieveTxn(transactionReference);

    if (!isValid) {
      //transaction does not exist on the databaseƒ, return null
      return null;
    } else {
      //transaction was found on the database
      return isValid!;
    }
  };

  return {
    pendingTransactions,
    verifyTransaction,
    removeTransaction,
    addTransaction,
  };
};
