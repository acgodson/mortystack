import {
  addTransactionToRecord,
  PaymentGatewayVault,
  updateTransactionStatus,
} from "./add";

describe("add transaction to Record and updates status", () => {
  test("adds transactions to the correct rounds within a vault", () => {
    const sellerID = "sellerA-ID";
    const paymentGatewayVault: PaymentGatewayVault = {
      Records: {},
    };

    const timestamp1 = new Date("2023-10-21T10:30:00").getTime();
    const timestamp2 = new Date("2023-10-21T12:15:00").getTime();

    const Tx1 = {
      amount: "100",
      description: "Transaction 1",  
      from: "Bob",
      to: "Alice",
    };

    const Tx2 = {
      amount: "200",
      description: "Transaction 2",
      from: "John",
      to: "Alice",
    };

    const updatedVault = addTransactionToRecord(
      paymentGatewayVault,
      sellerID,
      timestamp1,
      "100",
      "Transaction 1",
      "Bob",
      "Alice"
    );

    const finalVault = addTransactionToRecord(
      updatedVault,
      sellerID,
      timestamp2,
      "200",
      "Transaction 2",
      "John",
      "Alice"
    );

    // Check if transactions are added to the correct rounds within the vault
    expect(finalVault.Records[sellerID].rounds).toEqual({
      0: {
        ["transaction-" + timestamp1]: {
          ...Tx1,
          status: "pending",
          asset: undefined,
          rIdx: 0,
        },
      },
      1: {
        ["transaction-" + timestamp2]: {
          ...Tx2,
          status: "pending",
          asset: undefined,
          rIdx: 1,
        },
      },
    });

    const updatedVaultWithCompletedTx = updateTransactionStatus(
      finalVault,
      sellerID,
      1,
      "transaction-" + timestamp2,
      "paid"
    );

    // Check if the transaction status is updated to "completed"
    expect(
      updatedVaultWithCompletedTx.Records[sellerID].rounds[1][
        "transaction-" + timestamp2
      ].status
    ).toBe("paid");
  });
});
