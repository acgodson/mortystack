## Hello Morty fren 👋

# MortyStack wants to help millions of unsatisfied and under-banked users meet their needs and grow their businesses

## Using the MortyStack SDK

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
  assets: selectedAssets,
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

1.  Login to the [Dashboard](https://mortystack.xyz)We use web3 auth and custom jwt to generate a unique account address for each social login

![login](morty-frontend/public/login.png)

2. Connect to an External provider to your dashboard. We use useWallet from @txnlabs

![Connect Wallet](morty-frontend/public/connect.png)

3. Create a new Subscription

4. Now you create a new organization and open a new record on chain

5. Copy the Organization ID afterwards

### With your Organization ID, you can now

- 1. Create quick Invoices to bill customers
- 2. Set up the mortystack SDK to receive assets on your website
- 3. Host a shop for your organization with your unique url `[name].mortystack.xyz`

#

### Resources

- [Pitch Deck]()

- [Brand Bible]()

- [Whitepaper]()

### Links

- [Documentation]()
- [Dashboard]()

### Examples

- [SDK Example website]()

- [Invoice Sample & Checkout]()

- [Sample Shop]()

### Videos

- [ Demo Video (Summary)]()
- [ Demo Video (Design)]()
- [ Demo Video (Smart Contracts)]()
- [ Demo Video (Client)]()

### Contributors

[Contributors](TEAM.md)

### Appendix

Monorepo Structure

- Docs
- Frontend
  - API
  - Shops
  - Pay
  - Checkout
  - Dashboard
- Smart Contract
  - Test
- SDK
  - Example Project
  - Packages

`Code Refactoring in progress`
