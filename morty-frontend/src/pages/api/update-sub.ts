import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "./middleware";
import axios from "axios";

const db = admin.firestore();

const createUserDocument = async (userId: string, address: string) => {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      status: 0,
      org: [],
      subs: [],
    });
  } catch (error: any) {
    throw new Error("Error creating user document: " + error.message);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedHeaders = await middleware(req);

  if (!updatedHeaders) {
    // Not allowed
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Object.assign(req.headers, updatedHeaders);

  try {
    const { userId, address, period } = req.body;

    //TODO: verify that userid (KYC) matches address in the docs

    const userRef = db.collection("users").doc(address);

    const userDoc = (await userRef.get()) as admin.firestore.DocumentData;

    const time = period as Array<2>;
    const latestSub = { start: time[0], end: time[1] };

    if (!userDoc.exists) {
      await createUserDocument(address as string, userId as string);
    }

    const currentStatus = userDoc.data()["status"];
    const currentSub = userDoc.data()["subs"];

    if (currentSub.length > 0) {
      await userRef.update({
        status: currentStatus === 0 ? currentStatus + 1 : currentStatus,
        subs: [...currentSub, { start: time[0], end: time[1] }],
      });
    } else {
      await userRef.update({
        status: currentStatus + 1,
        subs: [latestSub],
      });
    }

    res.status(200).json({ success: true, status: currentStatus + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
