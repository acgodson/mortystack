import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
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
    const { addr } = req.body;

    const InvoicesQuery = await db
      .collection("invoices")
      .where("signer", "==", addr)
      .get();
    const refs = InvoicesQuery.docs.map((doc) => doc.id);

    console.log(addr);
    console.log(refs);

    res.status(200).json({ success: true, refs: refs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
