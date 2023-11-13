import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "./middleware";
import axios from "axios";
import http from "http";
import fetch from "isomorphic-fetch";
const PINATA_GATEWAY_TOKEN =
  "klWVmF7ztrf1-dLbTMh2DZaGfKimAY3yvA6eBDf4v2TiY_3vlkOcui7k2swrMIpT";
const PINATA_GATEWAY = "https://scarlet-warm-anaconda-739.mypinata.cloud";

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
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(
      Number(currentTime) - Number(24 * 60 * 60 * 1000)
    );

    const createdAt = docRef.data()["createdAt"].toDate();
    const cid = docRef.data()["cid"];

    const isValid = createdAt.getTime() > twentyFourHoursAgo.getTime();

    let invoiceDetails = null;

    if (isValid) {
      const pinataUrl = `${PINATA_GATEWAY}/ipfs/${cid}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
      const response = await fetch(pinataUrl);
      const data = await response.text();

      if (data) {
        const details = JSON.parse(data);
        const metadata = JSON.parse(details);
        invoiceDetails = {
          createdAt: createdAt,
          id: docRef.id,
          cid: cid,
          ...metadata,
        };
      }
    }

    if (isValid) {
      res.status(200).json({ success: true, invoice: invoiceDetails });
    } else {
      res.status(200).json({ success: false, error: "Invoice is expired" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
