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
    const { oid } = req.body;

    const orgDoc = await db.collection("orgs").doc(oid).get();

    const orgData: any = orgDoc.data();

    res.status(200).json({ success: true, info: orgData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
