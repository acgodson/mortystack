export interface RewardsProgram {
  [assetID: string]: {
    [reciever: string]: number; // Mapping between assetID and reward points recieved from each receiver
  };
}

type SellerId = string;
type TxnStatus = "paid" | "claimed" | "expired" | "failed" | "pending";

export interface TransactionDetails {
  amount: string;
  description: string;
  status: TxnStatus;
  asset: number | undefined; //asset minted during claim process to issue receipt or reward
  from: string;
  to: SellerId;
  rIdx: number; //round index for easy retrieval
}

// Round interface representing a round in the Record
export interface Round {
  [txnID: string]: TransactionDetails;
}

// Record interface representing the data structure for a record
export interface Record {
  "start-date": number; // Timestamp representing start date
  "end-date": number; // Timestamp representing end date
  intervalMs: number; // Interval in milliseconds
  rounds: {
    [key: number]: Round;
  };
  rewardProgramActive: boolean; // Indicates whether the reward program is active for the entire record
  rewardsProgram?: RewardsProgram | null;
}

// PaymentGatewayVault interface representing a vault mapping seller IDs to their records
export interface PaymentGatewayVault {
  Records: {
    [sellerId: SellerId]: Record;
  };
}

// Function to calculate the round index based on timestamps and interval
function calculateRoundIndex(
  startDate: number,
  intervalMs: number,
  timestamp: number
): number {
  const elapsedTime = timestamp - startDate;
  const intervalNumber = Math.floor(elapsedTime / intervalMs);
  return intervalNumber;
}

function switchRewardsProgram(
  paymentGatewayVault: PaymentGatewayVault, //ref
  sellerID: string,
  roundIndex: number,
  activate: boolean
): PaymentGatewayVault {
  const record: Record = paymentGatewayVault.Records[sellerID];

  if (record && record.rounds[roundIndex]) {
    if (activate) {
      // Deactivate rewards program
      record.rewardProgramActive = false;
    } else {
      // Activate rewards program
      record.rewardProgramActive = true;
    }
  }

  return paymentGatewayVault;
}

function updatedTransactionDetails(
  transactionDetails: TransactionDetails,
  status: TxnStatus, //update a pending transaction state
  asset?: number
  // senderAddress: string
): TransactionDetails {
  return {
    ...transactionDetails,
    status,
    asset,
  };
}

// Function to add a transaction to the correct round in the record and return the updated vault
export function addTransactionToRecord(
  paymentGatewayVault: PaymentGatewayVault,
  sellerID: string,
  timestamp: number,
  amount: string,
  description: string,
  from: string,
  to: SellerId
): PaymentGatewayVault {
  const record = paymentGatewayVault.Records[sellerID];

  if (!record) {
    // If the record for the seller doesn't exist, create a new one
    const startDate = new Date("2023-10-21T10:30:00").getTime(); //let's use a test timestamp
    const endDate = startDate + 30 * 24 * 60 * 60 * 1000; // 30 days later in milliseconds

    // init new seller record
    paymentGatewayVault.Records[sellerID] = {
      "start-date": startDate,
      "end-date": endDate,
      intervalMs: 60 * 60 * 1000,
      rounds: {},
      rewardProgramActive: false,
      rewardsProgram: null,
    };
  }

  const roundIndex = calculateRoundIndex(
    paymentGatewayVault.Records[sellerID]["start-date"],
    paymentGatewayVault.Records[sellerID].intervalMs,
    timestamp
  );

  //create transaction object
  const transaction: TransactionDetails = {
    amount,
    description,
    status: "pending",
    asset: undefined,
    from,
    to,
    rIdx: roundIndex,
  };

  const timestampKey = `transaction-${timestamp}`;
  if (!paymentGatewayVault.Records[sellerID].rounds[roundIndex]) {
    paymentGatewayVault.Records[sellerID].rounds[roundIndex] = {};
  }
  paymentGatewayVault.Records[sellerID].rounds[roundIndex][timestampKey] =
    transaction;

  // Return the updated PaymentGatewayVault
  return paymentGatewayVault;
}

//function that updates a vaults payment status to paid
export function updateTransactionStatus(
  paymentGatewayVault: PaymentGatewayVault,
  sellerID: string,
  rIdx: number, //round
  txnID: string,
  status: TxnStatus
): PaymentGatewayVault {
  const record: Record = paymentGatewayVault.Records[sellerID];
  var transaction: TransactionDetails = record.rounds[rIdx][txnID];

  if (!transaction) {
    console.log("invalid transaction, not found");
    return paymentGatewayVault; // Return the original vault if the transaction is not found
  }

  //mint new receipt for complete txn
  const asset = parseInt(generateRandomAssetID(5));

  if (transaction) {
    transaction.status = status;
    transaction.asset = asset;
  }

  //update status to completed
  const updatedTransaction = updatedTransactionDetails(
    transaction,
    status,
    asset
  );

  record.rounds[rIdx][txnID] = updatedTransaction;

  //return the updated vault
  return paymentGatewayVault;
}

function generateRandomAssetID(length: number): string {
  const charset = "0123456789";
  let assetID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    assetID += charset[randomIndex];
  }
  return assetID;
}

//in the test we're going to simulatanelously addtransactiontoRecord and completeTransaction in a record
