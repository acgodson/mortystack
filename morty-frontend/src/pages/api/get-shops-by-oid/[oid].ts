// src/pages/api/get-shops-by-oid/[oid].ts
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../firebase-admin";

const db = admin.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { oid } = req.query;

  if (typeof oid !== 'string') {
    res.status(400).json({ error: "Invalid oid" });
    return;
  }

  try {
    const shopsRef = db.collection("shops");
    const snapshot = await shopsRef.where('oid', '==', oid).get();

    if (snapshot.empty) {
      res.status(404).json({ error: "No matching shops." });
      return;
    }

    const shops: any[] = [];
    snapshot.forEach(doc => {
      shops.push(doc.data());
    });

    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};