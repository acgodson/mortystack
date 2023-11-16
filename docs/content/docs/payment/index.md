---
title: "Pay-Button"
date: 2019-02-11T19:27:37+10:00
draft: false
weight: 3
---

## Using Morty's Branded Button

![Button](https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/badge.png?alt=media&token=0940d98c-54d1-49b5-bc2c-c889f6bf08ed)

```javascript
import { PayButton } from "mortystack";
```

The Button would trigger the payment modal after successful click

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
