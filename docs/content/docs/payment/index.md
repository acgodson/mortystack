---
title: "Pay-Button"
date: 2019-02-11T19:27:37+10:00
draft: false
weight: 3
---

## Using the Morty's Branded Button

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
