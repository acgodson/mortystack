// src/pages/api/get-shop.ts
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../firebase-admin";

const db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;

  if (typeof name !== "string") {
    res.status(400).json({ error: "Invalid shop name" });
    return;
  }

  try {
    const shopRef = db.collection("shops").doc(name);
    const shopDoc = await shopRef.get();

    if (!shopDoc.exists) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }

    const shopData = shopDoc.data();

    res.status(200).json({ shop: shopData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
