import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../firebase-admin";
import { middleware } from "./middleware";

const db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedHeaders = await middleware(req);

  if (!updatedHeaders) {
    // Not allowed
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Object.assign(req.headers, updatedHeaders);

  try {
    const { oid, name, description, products = [] } = req.body;

    const shopRef = db.collection("shops").doc(name);
    const shopDoc = (await shopRef.get()) as admin.firestore.DocumentData;

    if (shopDoc.exists) {
      res.status(400).json({ error: "Shop exists" });
      return;
    }

    await shopRef.set({
      description,
      name,
      oid,
      products,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
