import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "./middleware";

// const PINATA_GATEWAY_TOKEN =
//   "klWVmF7ztrf1-dLbTMh2DZaGfKimAY3yvA6eBDf4v2TiY_3vlkOcui7k2swrMIpT";
// const PINATA_GATEWAY = "https://scarlet-warm-anaconda-739.mypinata.cloud";

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
    const { ref } = req.body;

    const docRef = (await db
      .collection("invoices")
      .doc(ref)
      .get()) as admin.firestore.DocumentData;

    if (!docRef.exists) {
      res.status(404).json({ success: false, error: "Invoice not found" });
      return;
    }

    const status = docRef.data()["status"];
    const txID = docRef.data()["txID"];
    const currentTime = new Date();

    if (status === true) {
      res.status(200).json({ success: true, status: true, txID });
      return;
    }

    // Check expiration only if the status is false
    const twentyFourHoursAgo = new Date(
      Number(currentTime) - Number(24 * 60 * 60 * 1000)
    );

    const createdAt = docRef.data()["createdAt"].toDate();
    const isValid = createdAt.getTime() > twentyFourHoursAgo.getTime();

    if (!isValid) {
      res
        .status(404)
        .json({ success: false, error: "Invoice not found or expired" });
      return;
    }

    res.status(200).json({ success: true, status: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
