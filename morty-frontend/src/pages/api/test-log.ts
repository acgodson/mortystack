//test logging of intervals and finding them

import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
   

    type Interval = { [key: string]: number[] }; // Interval type

    let intervals: Interval[] = []; // Array to store intervals
    const intervalMinutes: number = 30; // Interval duration in minutes
    const initialTimestamp: number = new Date('2023-10-21T09:00:00').getTime(); // Initial timestamp
    
    // Function to add timestamp transactions to intervals array
    const addTimestampTransaction = (timestamp: number, transactionDetails: any): void => {
        const intervalNumber: number = calculateIntervalNumber(initialTimestamp, timestamp, intervalMinutes);
        const intervalKey: string = `interval-${intervalNumber}`;
        if (!intervals[intervalNumber]) {
            intervals[intervalNumber] = { [intervalKey]: [] };
        }
        intervals[intervalNumber][intervalKey].push(timestamp);
    }
    
    // Function to calculate interval number for a given timestamp
    const calculateIntervalNumber = (startTime: number, currentTime: number, intervalMinutes: number): number => {
        const elapsedMinutes: number = Math.floor((currentTime - startTime) / (1000 * 60));
        return Math.floor(elapsedMinutes / intervalMinutes) + 1;
    }
    
    // Add timestamp transactions
    const transaction1Timestamp: number = new Date('2023-10-21T09:15:00').getTime();
    const transaction1Details: any = { id: 1, amount: 100 };
    addTimestampTransaction(transaction1Timestamp, transaction1Details);
    
    const transaction2Timestamp: number = new Date('2023-10-21T10:30:00').getTime();
    const transaction2Details: any = { id: 2, amount: 150 };
    addTimestampTransaction(transaction2Timestamp, transaction2Details);
    
    // Find interval of a timestamp transaction
    const searchTimestamp: number = new Date('2023-10-21T10:15:00').getTime();
    const intervalNumber: number = calculateIntervalNumber(initialTimestamp, searchTimestamp, intervalMinutes);
    
    console.log('Intervals with Timestamp Transactions:');
    console.log(JSON.stringify(intervals, null, 2));
    console.log(`Interval number for search timestamp: ${intervalNumber}`);
    


  } catch (e) {
    res.status(500).json({ error: e });
  }
}
