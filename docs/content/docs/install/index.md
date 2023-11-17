---
title: "Installation"
date: 2019-02-11T19:27:37+10:00
weight: 2
---

To use enable morty within your React app, you will need to install the [mortystack]() installed and fill in your app configuration obtained from the [dashboard]().

```javascript
npm i mortystack

```

- Usage

```javascript
import { usePay, MortyStackProvider, PayButton } from "mortystack";
```

### App Configuration

- Initialize assets and get asset IDs:

```javascript
const { initAssets, ASSET_IDS } = usePay();

const selectedAssets = initAssets([
  ASSET_IDS.WETH,
  { id: 10458941, symbol: "USDC" }, // custom asset
  ASSET_IDS.ALGOS,
  ASSET_IDS.WMATIC,
]);
```

- Configure and wrap your app/desired componet with the Mortystack provider :

```javascript
const config = {
  id: "HIG-1699996617305-FY1K59", // Morty Organization ID from your Dashboard
  assets: selectedAssets, //<--- InitAsset
  signer: {
    addr: undefined, // address that owns and signs the record,
    secret?: process.env.Secret // dispenser secret if available
  }
}
    <MortyStackProvider config={config}>
        <Component {...pageProps} />
 </MortyStackProvider>

```

### Retreiving your App ID

- Login to the [Dashboard](https://mortystack.xyz)

- Connect an External Algorand Wallet to your dashboard

- Create a new Subscription

- Now you create a new organization

- Copy the Organization ID afterwards
