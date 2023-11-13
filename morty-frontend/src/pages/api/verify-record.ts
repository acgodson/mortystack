// import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "./middleware";
import { MortyClient } from "@/contracts/MortyClient";
import { calculateKeccak256 } from "@/utils/helpers";
import algosdk, { Algodv2 } from "algosdk";
import { ALGORAND_HOST } from "@/utils/wormhole/consts";

// const db = admin.firestore();

const algodClient = new Algodv2(
  ALGORAND_HOST.algodToken,
  ALGORAND_HOST.algodServer,
  ALGORAND_HOST.algodPort
);

const AdminAccount = {};

const typedClient = new MortyClient(
  {
    sender: AdminAccount || undefined,
    resolveBy: "id",
    id: 474685206,
  },
  algodClient
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedHeaders = await middleware(req);

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
    const { organization, signer } = req.body;

    const getReference = async () => {
      if (!typedClient) {
        return;
      }

      console.log("this is the org used - make sure it's the id", organization);
      console.log(`Calling current Subscription`);

      const ref = signer;
      if (!ref) {
        return;
      }
      const res = await typedClient.appClient.getBoxValue(
        algosdk.decodeAddress(ref).publicKey
      );
      const decoder = new algosdk.ABITupleType([
        new algosdk.ABIUintType(64),
        new algosdk.ABIUintType(64),
      ]);
      const result: any = decoder.decode(res);
      const resultSum = result.map((x: bigint) => Number(x));
      const period: number = resultSum.reduce(
        (acc: number, num: number) => acc + num,
        0
      );
      const reference = calculateKeccak256(organization + period.toString());
      console.log(organization);
      console.log(period);
      console.log("ref", reference);
      return reference;
    };

    const ref = await getReference();

    if (ref) {
      res.status(200).json({ success: true, reecord: ref });
    } else {
      res.status(404).json({ error: "no active subscription" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
