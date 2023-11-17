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

const currentTime = new Date();
const twentyFourHoursAgo = new Date(
  Number(currentTime) - Number(24 * 60 * 60 * 1000)
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedHeaders = await middleware(req);

  if (!updatedHeaders) {
    // Not allowed
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Object.assign(req.headers, updatedHeaders);
  let ivs: any = [];
  let invoices: any = [];
  const expiredInvoices: any = [];
  try {
    const { refs } = req.body;

    console.log(refs);
    if (!refs) {
      return;
    }

    for (let index = 0; index < refs.length; index++) {
      const ref = refs[index];
      const docRef = (await db
        .collection("invoices")
        .doc(ref)
        .get()) as admin.firestore.DocumentData;

      if (docRef && docRef.exists) {
        const obj = {
          createdAt: docRef.data()["createdAt"].toDate(),
          cid: docRef.data()["cid"],
          id: docRef.id,
          record: docRef.data()["record"],
        };
        ivs.push(obj);
      } else {
        console.error(`Document with ref ${ref} not found`);
      }
    }

    const validInvoices = ivs.filter((invoice: any) => {
      const createdAtTime = new Date(invoice.createdAt as string);
      if (createdAtTime.getTime() > twentyFourHoursAgo.getTime()) {
        return true;
      } else {
        expiredInvoices.push({
          cid: invoice.cid,
          createdAt: invoice.createdAt,
        });
        return false;
      }
    });

    for (let index = 0; index < validInvoices.length; index++) {
      const invoice = validInvoices[index];
      const cid = invoice.cid;
      const pinataUrl = `${PINATA_GATEWAY}/ipfs/${cid}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN} `;
      const response = await fetch(pinataUrl);
      const data = await response.text();

      if (data) {
        const details = JSON.parse(data);
        const metadata = JSON.parse(details);
        const obj = {
          createdAt: invoice.createdAt,
          cid: cid,
          id: invoice.id,
          ...metadata,
        };
        invoices.push(obj);
      }
    }

    console.log(invoices);
    res
      .status(200)
      .json({ success: true, active: invoices, expired: expiredInvoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
