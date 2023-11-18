---
title: "Smart Contract"
date: 2019-02-11T19:30:08+10:00
draft: false
weight: 4
summary: Syntax highlighting and menus can be configured via `config.toml`.
---

#### Morty's Smart Contract, written in TealScript and compiled to Teal, functions as a secure vault for deposited assets tied to an organization's Record. The transaction cycle involves three broad stages: `Preparation`, `Attestation`, and `Confirmation`.

## Frontend Approaches

##### Direct (Algo to Algo Chain)

Buyers engage in direct Algo-to-Algo transactions, easy and efficient escrow-like asset transfer.

![direct approach](https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/Direct_Approach.jpg?alt=media&token=21bc89f1-edc9-4303-ae23-aaa9e1a44066)

##### Redirect (EVM to Algo Chain)

Buyers use wrapped assets on the EVM, transferring payments via Metamask to the Wormhole bridge. Morty facilitates the transfer, but generates a temporary Algo account to handle attestation between wormhole, seller, and morty. _This approach is slightly limited due to the speed of cross-chain transfers and non-nft transfer support between other chains and Algorand on wormhole bridge_. Continue reading to our whitepaper to see proposals we've made to improve compatitiblity on Morty

## Smart Contract Assets

Representative assets are minted upon successful deposits, controlled by the Morty Application. The asset ensures that only the depositor can claim the receipt, restricting it to a single claim after the seller retrieves the payment.

### Use Cases

The Smart contract Assets minted per deposit can be used freely at the discretion of the owner of the record (seller). By default the seller can use the asset-id to query transaction information from morty

- Some basic representations include
  - Basic Receipt for paid goods and services
  - Voucher and coupons
- Advanced Use Cases
  - Loyalty Tokens
  - Membership Invites

#### Extended Functionality

Morty Stack aims to expand smart contract capabilities for pro-subscribers, allowing them to create unique after-sales experiences. This includes

- Minting fixed assets with the smart contract as clawback for an organization's record.
- Enabling sellers to choose assets as receipts for specific transactions or sales.
  Example: A DAO issues its own tokens to members after donations or purchases. Instead of creating assets per deposit, they create a predefined total supply of a custom asset controlled by the Morty Smart Contract.

  ### **Morty.algo.ts** **Tealscript**

#### Subscribe

- Allows an account to subscribe to Morty's service.
- If the account already has a subscription, it may handle post-free trial charges (TODO)
- Records the start date and end date of the subscription in the storage
- Returns the subscription period in a tuple [startDate, endDate]

  - `@param `account - Public key of the account subscribing. \*
  - ` @returns` The subscription period [startDate, endDate].

#### Create Record

- Creates a unique seller record based on the account, reference, and subscription information.

  - `@param `account - Public key of the seller's account.
  - `@param `ref - Reference string. \*` @returns` The unique reference for the seller's record.

#### Make Payment

- Processes a payment transaction

  - `@param `vault - Asset used for the payment.
  - `@param `amount - Amount of the payment.
  - `@param `description - Description of the payment.
  - `@param `sub - Public key of the subscriber.
  - `@param `sellerRef - Reference string associated with the seller's record.
  - `@param `from - Sender's address.
  - `@param `to - Receiver's address. -` @returns` The receipt (smart contract asset) for the payment transaction.

#### Claim Receipt

- Claims the receipt associated with a payment transaction.
  - `@param` txID - Transaction ID of the payment transaction.
  - `@param `receipt - Receipt (asset) for the payment.
