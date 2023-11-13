import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "./middleware";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedHeaders = await middleware(req);

  if (!updatedHeaders) {
    //not allowed
    return;
  }

  if (!updatedHeaders) {
    // Not allowed
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Object.assign(req.headers, updatedHeaders);

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { ref, metadata } = req.body;

    const pinataResponse: any = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: "PaymentInvoice.json",
        },
        pinataOptions: {
          cidVersion: 0,
        },
        pinataContent: JSON.stringify({ metadata }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace with your Pinata API Key
        },
      }
    );

    if (pinataResponse) {
      console.log("uploaded CID", pinataResponse.data.IpfsHash);
      const hash = pinataResponse.data.IpfsHash;

      const db = admin.firestore();
      const docRef = db.collection("invoices").doc();

      const object = {
        cid: hash,
        record: ref,
        signer: metadata.signer,
        status: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await docRef.set(object).then((doc) => {});

      res
        .status(200)
        .json({ success: true, ref: docRef.id, created: Date.now() });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
