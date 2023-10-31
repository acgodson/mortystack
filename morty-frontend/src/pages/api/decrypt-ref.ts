import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto-js";
import { middleware } from "./middleware";
import algosdk from "algosdk";


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const updatedHeaders = await middleware(req);
  // Check if CORS middleware allows the request
  if (!updatedHeaders) {
    return;
  }

  Object.assign(req.headers, updatedHeaders);

  try {
    const { ref }: any = req.body;

    const secretKey = "go"; // sample
    const decryptedReference: any = crypto.AES.decrypt(ref, secretKey).toString(
      crypto.enc.Utf8
    );

    console.log(decryptedReference);
    const { amount, email, loyaltyID, expiry } = JSON.parse(decryptedReference);

    if (amount && email) {
      const invoice = { amount, email, loyaltyID, expiry };
      if (expiry && expiry > Date.now()) {
        //transaction is expired
        res.status(200).json({
          status: "valid",
          invoice,
        });
      } else {
        res.status(400).json({
          status: "expired",
          invoice,
        });
      }
    } else {
      res.status(400).json({
        status: "invalid",
      });
    }

    res.status(200).json({ status: "not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
