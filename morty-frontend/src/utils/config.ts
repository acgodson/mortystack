import { initializeApp } from "firebase/app";
import "firebase/auth";
import { FaDiscord, FaGithub } from "react-icons/fa";
const firebaseConfig = {
  apiKey: "AIzaSyD5w2TBQ-3o87WH6HMxdV6Qr1k63uTS4wM",
  authDomain: "mortywalletng.firebaseapp.com",
  projectId: "mortywalletng",
  storageBucket: "mortywalletng.appspot.com",
  messagingSenderId: "751112650794",
  appId: "1:751112650794:web:34aee24829405eb2834353",
  measurementId: "G-SGTM6TYVGP",
};

export const WEB3AUTH_CLIENT_ID =
  "BHbBFRsJyQ9gDWPmgjkt8hIp3wg64Pt1PdBQ6g5mITjKpfMv9-EOOtOH0kpncxkXVqH2qa826OiQvp1M1PkTIG8";

export const siteConfig = {
  copyright: `© ${new Date().getFullYear()} mortywallet`,
  author: {
    name: "tinybird@acgodson",
    accounts: [
      {
        url: "https://github.com/acgodson/mortystack.git",
        icon: { FaGithub },
        name: "Github",
        type: "github",
        label: "github",
      },
      {
        url: "",
        icon: { FaDiscord },
        name: "Discord",
        type: "discord",
        label: "discord",
      },
    ],
  },
};

export const CRYPTO_COMPARE_API_KEY =
  "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=NGN";

export const USDC_SECRET =
  "de086e06f8dc2b6b9b7eeaf42e088acabbfb4d9b716a1847fe22755374c578f8";

export const CIRCLE_API_KEY =
  "QVBJX0tFWTo5MjAwZjZiYmQ4NmFlNzUxZDRjMWMxOTQxZDk2M2ExZjoxZTg3ZGY5NGE5YjkyZjI0OTgwODhmYmU5NDRjNzkxNA==";

export function initFirebase() {
  initializeApp(firebaseConfig);
}
