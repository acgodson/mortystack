## Hello Morty fren 👋

<img alt="logo" height="100px" w="auto" src="/morty-frontend/public/mortyIcon.png">

# MortyStack wants to help millions of unsatisfied and under-banked users meet their needs and grow their businesses

## Using the MortyStack SDK & Dashboard

To use enable morty within your React app, you will need to install [mortystack](https://www.npmjs.com/package/mortystack) and fill in your organization's ID obtained from the [dashboard]().

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

1.  Login to the [MortStack Dashboard](https://mortystack.xyz). We use `Web3Auth` and `jwt` to generate a unique account address for each email login.

![login](morty-frontend/public/login.png)

2. Connect an External provider to your dashboard. We use useWallet from `@txnlabs`

![Connect Wallet](morty-frontend/public/connect.png)

3. Create a new Subscription

4. Now you create a new organization and open a new record on chain

5. Copy the Organization ID afterwards

# With your Organization ID, you can now

### - 1. Create quick `Invoices` and forward checkout links to customers. See example [invoice]()

### - 2. Set up the `mortystack Button` to receive assets from your website. See example [website]()

<img alt="mortystack button" height="40px" w="auto" src="/morty-frontend/public/badge.png">

```javascript
import { PayButton } from "mortystack";

// The PayButton triggers the payment modal onclick
```

- Add payload from your application states

```javascript
<PayButton
  payload={{
    asset: asset,
    amount: amount,
    email: undefined,
    name: undefined,
    items: undefined,
    acceptWrapped: true,
  }}
/>
```

| Prop          | Type                     |               Description               |
| :------------ | :----------------------- | :-------------------------------------: |
| asset         | number                   |                Asset ID                 |
| amount        | number                   |               amount in $               |
| email         | string, optional         |            customer's email             |
| name          | string, optional         |             customer's name             |
| items         | InvoiceItems[], optional |              invoice items              |
| acceptWrapped | boolean, optional        | accept wrapped tokens (wormhole bridge) |

- 3. Host a shop for your organization with your choice sub-domain example `[name].mortystack.xyz`, served from `AWS`

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
