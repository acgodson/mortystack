import { mortyFont } from "../components/PayButton/font";

export interface PaymentStatus {
  code: "200" | "401" | "403" | "404" | "500";
  hash: string;
}

export type AssetOptionType = {
  USDC: number;
  WMATIC: number;
  WETH: number;
  ALGOS: number;
};

export interface PayButtonProps {
  asset?: number;
  amount?: number;
  email?: undefined;
  name?: undefined;
  items?: undefined;
  acceptWrapped?: boolean;
}

export const mortyFontStyles = `
      @font-face {
        font-family: 'CustomFontRegular';
        src: url(data:application/font-woff;charset=utf-8;base64,${mortyFont}) format('woff');
        font-weight: normal;
        font-style: normal;
      }
  
      body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select {
        font-family: 'CustomFontRegular'
      }
    `;

export type AssetConfig = {
  id: number | BigInt;
  symbol: string;
};

export const assets: AssetConfig[] = [
  { id: 0, symbol: "ALGOS" },
  { id: 86782447, symbol: "WETH" },
  { id: 212942045, symbol: "WMATIC" },
  { id: 10458941, symbol: "USDC" },
];

export interface AssetIndex {
  USDC: number;
  WMATIC: number;
  WETH: number;
  ALGOS: number;
}
export const ASSET_IDS: AssetIndex = {
  USDC: 10458941,
  WMATIC: 212942045,
  WETH: 86782447,
  ALGOS: 0,
};

export const initAssets = (
  assetOptions: (number | AssetConfig)[] | undefined
): AssetConfig[] => {
  if (!assetOptions) {
    return [];
  }

  return assetOptions.map((asset) => {
    if (typeof asset === "number") {
      // If it's a predefined asset ID, find the corresponding config
      const symbol = Object.keys(ASSET_IDS).find(
        (key) => ASSET_IDS[key] === asset
      ) as keyof AssetOptionType;
      return { id: asset, symbol };
    } else {
      // If it's a custom asset, return it as is
      return asset;
    }
  });
};
