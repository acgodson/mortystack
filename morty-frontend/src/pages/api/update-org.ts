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
    const { uid, metadata } = req.body;

    const orgRef = db.collection("orgs").doc(metadata.oid);
    const orgDoc = (await orgRef.get()) as admin.firestore.DocumentData;

    if (orgDoc.exists) {
      console.log("it exists");
      res.status(400).json({ error: "organization exists" });
      return;
    }

    await orgRef.set({
      uid: uid,
      oid: metadata.oid,
      name: metadata.name,
      category: metadata.category,
      url: metadata.url,
    });

    res.status(200).json({ success: true, id: metadata.oid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
