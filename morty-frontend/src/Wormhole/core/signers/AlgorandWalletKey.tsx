
import { useEffect, useState } from "react";
import algosdk, { Account } from "algosdk";
import { useRouter } from "next/router";
import { useRelayContext } from "@/contexts/WormholeContext/RelayWalletContext";



const AlgorandWalletKey = () => {

  const router = useRouter()
  const [fetching, setFetching] = useState(true)
  const { account, setAccount } = useRelayContext();


  const generateNewAccount = () => {
    const newAccount = algosdk.generateAccount()
    setAccount(newAccount)
    setFetching(false)
  }

  useEffect(() => {
    if (!account) {
      generateNewAccount()
    }
  },);

  useEffect(() => {

    console.log("new account", account)

  }, [account])



  return (
    <>
      {!fetching && (
        <>
          {/* display algo account info */}
        </>
      )}
    </>
  );
};

export default AlgorandWalletKey;
