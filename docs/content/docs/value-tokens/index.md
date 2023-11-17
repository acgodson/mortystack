---
title: "Smart Contract"
date: 2019-02-11T19:30:08+10:00
draft: false
weight: 4
summary: Syntax highlighting and menus can be configured via `config.toml`.
---

#### Morty's Smart Contract was Written in TealScript, and compiled down to Teal

The Morty Contract/vault holds deposited assets on behalf of the owner of the record (organziation ID). A complete cycle of transaction is in three stages
`Preparation`, `Attestation` , and finally `Confirmation`

We have two approaches on the frontend to complete this exchange between a buyer, morty and seller

##### Direct (Algo to Algo Chain)

![direct approach](https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/Direct_Approach.jpg?alt=media&token=21bc89f1-edc9-4303-ae23-aaa9e1a44066)

##### Relay (EVM to Algo Chain)

This allows buyers make payments of wrapped assets to seller using an EVM wallet like metamask, via wormhole bridge

## NFT Reciepts

 These represent  assets minted when a user deposits within The Morty Smart Contract
