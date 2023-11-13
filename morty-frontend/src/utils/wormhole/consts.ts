import {
  ChainId,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_BSC,
  CHAIN_ID_CELO,
  CHAIN_ID_ETH,
  CHAIN_ID_FANTOM,
  CHAIN_ID_NEAR,
  CHAIN_ID_POLYGON,
  coalesceChainName,
  CONTRACTS,
  isEVMChain,
  CHAIN_ID_AURORA,
  CHAIN_ID_ACALA,
  CHAIN_ID_KARURA,
} from "@certusone/wormhole-sdk";
import { getAddress } from "ethers/lib/utils";
const algorandIcon = "../icons/algorand.svg";
const arbitrumIcon = "../icons/arbitrum.svg";
const bscIcon = "../icons/bsc.svg";
const celoIcon = "../icons/celo.svg";
const ethIcon = "../icons/eth.svg";
const fantomIcon = "../icons/fantom.svg";
const polygonIcon = "../icons/polygon.svg";
const nearIcon = "../icons/near.svg";

export type Cluster = "devnet" | "testnet";
const urlParams =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
const paramCluster = urlParams?.get("cluster");
export const CLUSTER: Cluster =
  paramCluster === "devnet" ? "devnet" : "testnet";

export interface ChainInfo {
  id: ChainId;
  name: string;
  logo: string;
}
export const CHAINS: ChainInfo[] =
  CLUSTER === "testnet"
    ? [
        {
          id: CHAIN_ID_ALGORAND,
          name: "Algorand",
          logo: algorandIcon,
        },

        {
          id: CHAIN_ID_ARBITRUM,
          name: "Arbitrum",
          logo: arbitrumIcon,
        },

        {
          id: CHAIN_ID_BSC,
          name: "Binance Smart Chain",
          logo: bscIcon,
        },
        {
          id: CHAIN_ID_CELO,
          name: "Celo",
          logo: celoIcon,
        },
        {
          id: CHAIN_ID_ETH,
          name: "Ethereum (Goerli)",
          logo: ethIcon,
        },
        {
          id: CHAIN_ID_FANTOM,
          name: "Fantom",
          logo: fantomIcon,
        },
        {
          id: CHAIN_ID_POLYGON,
          name: "Polygon",
          logo: polygonIcon,
        },
      ]
    : [
        {
          id: CHAIN_ID_ALGORAND,
          name: "Algorand",
          logo: algorandIcon,
        },
        {
          id: CHAIN_ID_BSC,
          name: "Binance Smart Chain",
          logo: bscIcon,
        },
        {
          id: CHAIN_ID_ETH,
          name: "Ethereum",
          logo: ethIcon,
        },
        {
          id: CHAIN_ID_NEAR,
          name: "Near",
          logo: nearIcon,
        },
      ];
export const CHAINS_WITH_NFT_SUPPORT = CHAINS.filter(
  ({ id }) =>
    id === CHAIN_ID_BSC ||
    id === CHAIN_ID_ETH ||
    id === CHAIN_ID_POLYGON ||
    id === CHAIN_ID_AURORA ||
    id === CHAIN_ID_FANTOM ||
    id === CHAIN_ID_CELO ||
    id === CHAIN_ID_ARBITRUM
);
export type ChainsById = { [key in ChainId]: ChainInfo };
export const CHAINS_BY_ID: ChainsById = CHAINS.reduce((obj, chain) => {
  obj[chain.id] = chain;
  return obj;
}, {} as ChainsById);

export const COMING_SOON_CHAINS: ChainInfo[] = [];
export const getDefaultNativeCurrencySymbol = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? "ETH"
    : chainId === CHAIN_ID_BSC
    ? "BNB"
    : chainId === CHAIN_ID_POLYGON
    ? "MATIC"
    : chainId === CHAIN_ID_ALGORAND
    ? "ALGO"
    : chainId === CHAIN_ID_AURORA
    ? "ETH"
    : chainId === CHAIN_ID_FANTOM
    ? "FTM"
    : chainId === CHAIN_ID_CELO
    ? "CELO"
    : chainId === CHAIN_ID_ARBITRUM
    ? "ETH"
    : "";

export const getDefaultNativeCurrencyAddressEvm = (chainId: ChainId) => {
  return chainId === CHAIN_ID_ETH
    ? WETH_ADDRESS
    : chainId === CHAIN_ID_BSC
    ? WBNB_ADDRESS
    : chainId === CHAIN_ID_POLYGON
    ? WMATIC_ADDRESS
    : chainId === CHAIN_ID_AURORA
    ? WETH_AURORA_ADDRESS
    : chainId === CHAIN_ID_FANTOM
    ? WFTM_ADDRESS
    : chainId === CHAIN_ID_CELO
    ? CELO_ADDRESS
    : "";
};

export const getExplorerName = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? "Etherscan"
    : chainId === CHAIN_ID_BSC
    ? "BscScan"
    : chainId === CHAIN_ID_POLYGON
    ? "Polygonscan"
    : chainId === CHAIN_ID_ALGORAND
    ? "AlgoExplorer"
    : chainId === CHAIN_ID_FANTOM
    ? "FTMScan"
    : chainId === CHAIN_ID_ARBITRUM
    ? "Arbiscan"
    : "Explorer";
export const WORMHOLE_RPC_HOSTS =
  CLUSTER === "testnet"
    ? ["https://wormhole-v2-testnet-api.certus.one"]
    : ["http://localhost:7071"];
export const ETH_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 5 : 1337;
export const BSC_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 97 : 1397;
export const POLYGON_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 80001 : 1381;
export const AURORA_NETWORK_CHAIN_ID =
  CLUSTER === "testnet" ? 1313161555 : 1381;
export const FANTOM_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 4002 : 1381;
export const CELO_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 44787 : 1381;
export const ARBITRUM_NETWORK_CHAIN_ID = CLUSTER === "testnet" ? 421613 : 1381;
export const getEvmChainId = (chainId: ChainId) =>
  chainId === CHAIN_ID_ETH
    ? ETH_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_BSC
    ? BSC_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_POLYGON
    ? POLYGON_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_FANTOM
    ? FANTOM_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_CELO
    ? CELO_NETWORK_CHAIN_ID
    : chainId === CHAIN_ID_ARBITRUM
    ? ARBITRUM_NETWORK_CHAIN_ID
    : undefined;

export const ALGORAND_HOST =
  CLUSTER === "testnet"
    ? {
        algodToken: "",
        algodServer: "https://testnet-api.algonode.cloud",
        algodPort: "",
      }
    : {
        algodToken:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        algodServer: "http://localhost",
        algodPort: "4001",
      };

export const ALGORAND_WAIT_FOR_CONFIRMATIONS = CLUSTER === "testnet" ? 4 : 1;

export const ALGORAND_BRIDGE_ID = BigInt(
  CONTRACTS[CLUSTER === "testnet" ? "TESTNET" : "DEVNET"].algorand.core
);
export const ALGORAND_TOKEN_BRIDGE_ID = BigInt(
  CONTRACTS[CLUSTER === "testnet" ? "TESTNET" : "DEVNET"].algorand.token_bridge
);

export const NEAR_CORE_BRIDGE_ACCOUNT =
  CLUSTER === "testnet" ? "wormhole.wormhole.testnet" : "wormhole.test.near";

export const NEAR_TOKEN_BRIDGE_ACCOUNT =
  CLUSTER === "testnet" ? "token.wormhole.testnet" : "token.test.near";

export const getBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS[CLUSTER === "testnet" ? "TESTNET" : "DEVNET"][
    coalesceChainName(chainId)
  ].core || "";
export const getNFTBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS[CLUSTER === "testnet" ? "TESTNET" : "DEVNET"][
    coalesceChainName(chainId)
  ].nft_bridge || "";

export const getTokenBridgeAddressForChain = (chainId: ChainId) =>
  CONTRACTS[CLUSTER === "testnet" ? "TESTNET" : "DEVNET"][
    coalesceChainName(chainId)
  ].token_bridge || "";

export const COVALENT_API_KEY = process.env.COVALENT_API_KEY
  ? process.env.COVALENT_API_KEY
  : "";

export const COVALENT_ETHEREUM = 1; // Covalent only supports mainnet and Kovan
export const COVALENT_BSC = CLUSTER === "devnet" ? 56 : BSC_NETWORK_CHAIN_ID;
export const COVALENT_POLYGON =
  CLUSTER === "devnet" ? 137 : POLYGON_NETWORK_CHAIN_ID;
export const COVALENT_FANTOM =
  CLUSTER === "devnet" ? 250 : FANTOM_NETWORK_CHAIN_ID;
export const COVALENT_ARBITRUM =
  CLUSTER === "devnet" ? null : ARBITRUM_NETWORK_CHAIN_ID;

export const COVALENT_GET_TOKENS_URL = (
  chainId: ChainId,
  walletAddress: string,
  nft?: boolean,
  noNftMetadata?: boolean
) => {
  const chainNum =
    chainId === CHAIN_ID_ETH
      ? COVALENT_ETHEREUM
      : chainId === CHAIN_ID_BSC
      ? COVALENT_BSC
      : chainId === CHAIN_ID_POLYGON
      ? COVALENT_POLYGON
      : chainId === CHAIN_ID_FANTOM
      ? COVALENT_FANTOM
      : chainId === CHAIN_ID_ARBITRUM
      ? COVALENT_ARBITRUM
      : "";
  // https://www.covalenthq.com/docs/api/#get-/v1/{chain_id}/address/{address}/balances_v2/
  return chainNum
    ? `https://api.covalenthq.com/v1/${chainNum}/address/${walletAddress}/balances_v2/?key=${COVALENT_API_KEY}${
        nft ? "&nft=true" : ""
      }${noNftMetadata ? "&no-nft-fetch=true" : ""}`
    : "";
};

export const BLOCKSCOUT_GET_TOKENS_URL = (
  chainId: ChainId,
  walletAddress: string
) => {
  const baseUrl =
    chainId === CHAIN_ID_AURORA
      ? CLUSTER === "testnet"
        ? "https://explorer.testnet.aurora.dev"
        : ""
      : chainId === CHAIN_ID_CELO
      ? CLUSTER === "testnet"
        ? "https://alfajores-blockscout.celo-testnet.org"
        : ""
      : "";
  return baseUrl
    ? `${baseUrl}/api?module=account&action=tokenlist&address=${walletAddress}`
    : "";
};

export const WETH_ADDRESS =
  CLUSTER === "testnet"
    ? "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const WETH_DECIMALS = 18;

export const WBNB_ADDRESS =
  CLUSTER === "testnet"
    ? "0xae13d989dac2f0debff460ac112a837c89baa7cd"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const WBNB_DECIMALS = 18;

export const WMATIC_ADDRESS =
  CLUSTER === "testnet"
    ? "0x9c3c9283d3e44854697cd22d3faa240cfb032889"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const WMATIC_DECIMALS = 18;

export const WETH_AURORA_ADDRESS =
  CLUSTER === "testnet"
    ? "0x9D29f395524B3C817ed86e2987A14c1897aFF849"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const WETH_AURORA_DECIMALS = 18;

export const WFTM_ADDRESS =
  CLUSTER === "testnet"
    ? "0xf1277d1Ed8AD466beddF92ef448A132661956621"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const WFTM_DECIMALS = 18;

export const CELO_ADDRESS =
  CLUSTER === "testnet"
    ? "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"
    : "0xDDb64fE46a91D46ee29420539FC25FD07c5FEa3E";
export const CELO_DECIMALS = 18;

export const ALGO_DECIMALS = 6;

// hardcoded addresses for warnings
export const ETH_TOKENS_THAT_EXIST_ELSEWHERE = [
  getAddress("0x476c5E26a75bd202a9683ffD34359C0CC15be0fF"), // SRM
  getAddress("0x818fc6c2ec5986bc6e2cbf00939d90556ab12ce5"), // KIN
  getAddress("0xeb4c2781e4eba804ce9a9803c67d0893436bb27d"), // renBTC
  getAddress("0x52d87F22192131636F93c5AB18d0127Ea52CB641"), // renLUNA
  getAddress("0x459086f2376525bdceba5bdda135e4e9d3fef5bf"), // renBCH
  getAddress("0xe3cb486f3f5c639e98ccbaf57d95369375687f80"), // renDGB
  getAddress("0x3832d2F059E55934220881F831bE501D180671A7"), // renDOGE
  getAddress("0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2"), // renZEC
  getAddress("0xD5147bc8e386d91Cc5DBE72099DAC6C9b99276F5"), // renFIL
];

export const BSC_MARKET_WARNINGS = [
  getAddress(WBNB_ADDRESS),
  getAddress("0xe9e7cea3dedca5984780bafc599bd69add087d56"), // BUSD
  getAddress("0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"), // USDC
  getAddress("0x55d398326f99059ff775485246999027b3197955"), // BSC-USD
];

export const MIGRATION_PROGRAM_ADDRESS =
  CLUSTER === "testnet" ? "" : "Ex9bCdVMSfx7EzB3pgSi2R4UHwJAXvTw18rBQm5YQ8gK";

export const NATIVE_NEAR_DECIMALS = 24;
export const NATIVE_NEAR_PLACEHOLDER = "near";
export const NATIVE_NEAR_WH_ADDRESS =
  "0000000000000000000000000000000000000000000000000000000000000000";

export const WORMHOLE_EXPLORER_BASE = "https://wormhole.com/explorer";


export const getHowToAddTokensToWalletUrl = (chainId: ChainId) => {
  if (isEVMChain(chainId)) {
    return "https://docs.wormhole.com/wormhole/video-tutorial-how-to-manually-add-tokens-to-your-wallet#metamask";
  }
  return "";
};

export const getIsTransferDisabled = (
  chainId: ChainId,
  isSourceChain: boolean
) => {
  const disableTransfers = CHAIN_CONFIG_MAP[chainId]?.disableTransfers;
  return disableTransfers === "from"
    ? isSourceChain
    : disableTransfers === "to"
    ? !isSourceChain
    : !!disableTransfers;
};

export const LUNA_ADDRESS = "uluna";
export const UST_ADDRESS = "uusd";

export type RelayerCompareAsset = {
  [key in ChainId]: string;
};
export const RELAYER_COMPARE_ASSET: RelayerCompareAsset = {
  [CHAIN_ID_ETH]: "ethereum",
  [CHAIN_ID_BSC]: "binancecoin",
  [CHAIN_ID_POLYGON]: "matic-network",
  [CHAIN_ID_FANTOM]: "fantom",
  [CHAIN_ID_AURORA]: "ethereum", // Aurora uses bridged ether
  [CHAIN_ID_CELO]: "celo",
} as RelayerCompareAsset;
export const getCoinGeckoURL = (coinGeckoId: string) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;

export const RELAYER_INFO_URL =
  CLUSTER === "testnet" ? "" : "/relayerExample.json";

export const RELAY_URL_EXTENSION = "/relayvaa/";

export const getChainShortName = (chainId: ChainId) => {
  return chainId === CHAIN_ID_BSC ? "BSC" : CHAINS_BY_ID[chainId]?.name;
};

export const DISABLED_TOKEN_TRANSFERS: {
  [key in ChainId]?: { [address: string]: ChainId[] };
} = {
  [CHAIN_ID_ACALA]: {
    "0x0000000000000000000100000000000000000001": [CHAIN_ID_KARURA], // aUSD
  },
  [CHAIN_ID_KARURA]: {
    "0x0000000000000000000100000000000000000081": [], // aUSD
  },
};
export const getIsTokenTransferDisabled = (
  sourceChain: ChainId,
  targetChain: ChainId,
  tokenAddress: string
): boolean => {
  const disabledTransfers =
    DISABLED_TOKEN_TRANSFERS[sourceChain]?.[tokenAddress];
  return disabledTransfers !== undefined
    ? disabledTransfers.length === 0 || disabledTransfers.includes(targetChain)
    : false;
};

export const USD_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface WarningMessage {
  text: string;
  link?: {
    url: string;
    text: string;
  };
}

export type DisableTransfers = boolean | "to" | "from";
export interface ChainConfig {
  disableTransfers?: DisableTransfers;
  warningMessage?: WarningMessage;
}

export type ChainConfigMap = {
  [key in ChainId]?: ChainConfig;
};

export const CHAIN_CONFIG_MAP: ChainConfigMap = {
  // [CHAIN_ID_POLYGON]: {
  //   disableTransfers: true,
  //   warningMessage: {
  //     text: "Polygon is currently experiencing partial downtime. As a precautionary measure, Wormhole Network and Portal have paused Polygon support until the network has been fully restored.",
  //     link: {
  //       url: "https://twitter.com/0xPolygonDevs",
  //       text: "Follow @0xPolygonDevs for updates",
  //     },
  //   },
  // } as ChainConfig,
};


export const AlgoWormHoleAddress = "0x6D52a10BE00Dc81d352d1Ed85323814c29826665";

//query the algorand asset to get it's foriegn address
