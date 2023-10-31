import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto-js";
import { middleware } from "./middleware";
import axios from "axios";

// export const runtime = "edge"; // 'nodejs' (default) | 'edge'
function calculateExpiryTime() {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 30 * 60000);
  return expiryTime.getTime();
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const updatedHeaders = await middleware(req);

  if (!updatedHeaders) {
    //not allowed
    return;
  }

  // Merge updated headers with request headers
  Object.assign(req.headers, updatedHeaders);
  try {
    const { amount, email, loyaltyID }: any = req.body;

    const time = calculateExpiryTime();

    const paymentDetails = { amount, email, loyaltyID, expiry: time };
    const secretKey = "go"; // sample
    const encryptedReference = crypto.AES.encrypt(
      JSON.stringify(paymentDetails),
      secretKey
    ).toString();

    // Push encrypted refer.PINATA_JWT
    const pinataResponse: any = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: "PaymentInvoice.json",
        },
        pinataOptions: {
          cidVersion: 0,
        },
        pinataContent: JSON.stringify({ encryptedReference }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace with your Pinata API Key
        },
      }
    );
    if (pinataResponse) {
      console.log(pinataResponse);

      console.log("encrypted reference", pinataResponse.IpfsHash);



      //let's test retrieval


      // const decryptedReference: any = crypto.AES.decrypt(
      //   encryptedReference,
      //   secretKey
      // ).toString(crypto.enc.Utf8);

      // console.log("decrypted reference", decryptedReference);
      res.status(200).json({ reference: pinataResponse.IpfsHash, expiry: time });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
