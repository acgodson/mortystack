// import { PeraWalletConnect } from "@perawallet/connect"
// import { Account } from "algosdk";
// import {
//   useEffect,
//   useState,
// } from "react";


// type AlgorandChainIDs = 416001 | 416002 | 416003 | 4160;

// interface PeraWalletConnectOptions {
//   shouldShowSignTxnToast?: boolean;
//   chainId?: AlgorandChainIDs;
// }



// export const usePeraWallet = () => {

//   const peraWallet = new PeraWalletConnect({
//     chainId: 416002
//   });

//   const [peraAccount, setPeraAccount] = useState<Account | null>(null)
//   const isConnectedToPeraWallet = !!peraAccount;


//   const connectPera = () => {
//     peraWallet
//       .connect()
//       .then((newAccounts: any) => {
//         // Setup the disconnect event listener
//         peraWallet.connector?.on("disconnect", disconnectPera);
//         setPeraAccount(newAccounts[0]);
  
//       })
//       .catch((error: any) => {
//         // Handle the reject here
//         if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
//           // log the necessary errors
//         }
//       });
//   }


//   useEffect(() => {
//     // Reconnect to the session when the component is mounted
//     peraWallet.reconnectSession()
//       .then((accounts: any) => {
//         // Setup the disconnect event listener
//         peraWallet.connector?.on("disconnect", disconnectPera);

//         if (peraWallet.isConnected && accounts.length) {
//           setPeraAccount(accounts[0]);
//         }
//       })
//       .catch((error: any) => { 
//         console.log(error);
//       });

//   }, []);


//   function disconnectPera() {
//     peraWallet.disconnect();

//     setPeraAccount(null);
//   }



//   return {
//     peraAccount,
//     connectPera,
//     disconnectPera,
//     setPeraAccount,
//     peraWallet
//   }
// };

