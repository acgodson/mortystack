//delete all pins from pinata dashboard
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const PINATA_JWT = `Bearer ${process.env.PINATA_JWT}`;
const PIN_QUERY =
  "https://api.pinata.cloud/data/pinList?status=pinned&includesCount=false&pageLimit=1000";

let pinHashes: any = [];

const deletePinFromIPFS = async (hashToUnpin: string) => {
  try {
    const res = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`,
      {
        headers: {
          Authorization: PINATA_JWT,
        },
      }
    );
    console.log(res.status);
  } catch (error) {
    console.log(error);
  }
};
const wait = async (time: any) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const fetchPins = async () => {
  try {
    const res = await axios.get(PIN_QUERY, {
      headers: {
        Authorization: PINATA_JWT,
      },
    });
    const responseData = res.data.rows;
    responseData.forEach((row: any) => {
      pinHashes.push(row.ipfs_pin_hash);
    });
    console.log(pinHashes);
  } catch (error) {
    console.log(error);
  }
};

const bulkUnpin = async () => {
  try {
    for (const hash of pinHashes) {
      await deletePinFromIPFS(hash);
      await wait(200);
    }
    pinHashes = [];
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  await fetchPins();
  while (pinHashes) {
    await bulkUnpin();
    await fetchPins();
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const x: any = main();
    if (x) {
      console.log("deleted", x);
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
