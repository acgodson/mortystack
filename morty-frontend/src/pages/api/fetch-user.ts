import { FirebaseError } from "firebase/app";
import admin from "../../../firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

const db = admin.firestore();

const createUserDocument = async (address: string, userId: string) => {
  try {
    const userRef = db.collection("users").doc(address);
    await userRef.set({
      uid: userId,
      status: 0,
      org: [],
      subs: [],
    });
  } catch (error: any) {
    throw new Error("Error creating user document: " + error.message);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { userId, address } = req.query;
      if (!userId) {
        throw new Error("User ID is required");
      }

      const userRef = db.collection("users").doc(address as string);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // If user document doesn't exist, create one
        await createUserDocument(address as string, userId as string);
      } else {
        const userData: any = userDoc.data();

        if (!userData.status) {
          // If status field is not present, update the document
          await userRef.update({
            status: 0,
            org: [],
            subs: [],
          });
        }
      }

      // Get the updated user document
      const updatedUserDoc = await userRef.get();
      const userData = updatedUserDoc.data();

      res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
