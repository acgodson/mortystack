import { Contract } from "@algorandfoundation/tealscript";

const INTERVAL_MS: uint64 = 24 * 60 * 60 * 1000;

type byte32 = StaticArray<byte, 32>;
type pubkey = StaticArray<byte, 32>;
type period = StaticArray<uint64, 2>;
type metadata = {
  vault: Asset;
  value: uint64;
  description: string;
  status: uint64;
  receipt: Asset;
  to: Address;
  from: Address;
  rIdx: uint64;
};
// eslint-disable-next-line no-unused-vars
class Morty extends Contract {
  TxnIDx = GlobalStateKey<uint64>({ key: "TxnIDx" });
  subscription = BoxMap<pubkey, period>();
  transactionDetails = BoxMap<uint64, metadata>();
  sellerRecord = BoxMap<bytes, uint64[]>();
  dispenser = BoxMap<Address, Address>();

  /**
   * Initializes the transaction ID counter when creating the application.
   */
  createApplication(): void {
    this.TxnIDx.value = 1;
  }

  /**
   * Calculates the round index based on the start date and current timestamp.
   * @param startDate - Start date of the subscription period.
   * @param timestamp - Current timestamp.
   * @returns The calculated round index.
   */
  private calculateRoundIndex(startDate: uint64, timestamp: uint64): uint64 {
    const elapsedMilliseconds: uint64 = timestamp - startDate;
    const fullDays: uint64 = elapsedMilliseconds / INTERVAL_MS;
    return fullDays + 1;
  }

  /**
   * Allows an account to subscribe, setting a subscription period and charging money after the free 1 month period.
   * @param account - Public key of the account subscribing.
   * @returns The subscription period [startDate, endDate].
   */
  subscribe(account: pubkey): period {
    if (this.subscription(account).exists) {
      //TODO: charge money after free 1 month
    }
    const startdate: uint64 = globals.latestTimestamp;
    const endDate: uint64 = startdate + 30 * 24 * 60 * 60 * 1000;
    this.subscription(account).value = [startdate, endDate];
    return this.subscription(account).value;
  }

  /**
   * Creates a unique seller record based on the account, reference, and asset information.
   * @param account - Public key of the seller's account.
   * @param ref - Reference string.
   * @returns The unique reference for the seller's record.
   */
  createRecord(account: pubkey, ref: string): byte32 {
    // TODO: Prevent abuse by creating assets for each ref and verify that the creator is same as account.
    assert(this.subscription(account).exists); //subscription exists
    assert(this.subscription(account).value[1] > globals.latestTimestamp); //active subscription
    const start: uint64 = this.subscription(account).value[0];
    const end: uint64 = this.subscription(account).value[1];
    const period: uint64 = start + end;
    const reference: byte32 = keccak256(ref + period.toString());
    assert(!this.sellerRecord(reference).exists);
    this.sellerRecord(reference).value = [];
    return reference;
  }

  /**
   * Processes a payment transaction, creating a new transaction record and associated metadata.
   * @param vault - Asset used for the payment.
   * @param amount - Amount of the payment.
   * @param description - Description of the payment.
   * @param sub - Public key of the subscriber.
   * @param sellerRef - Reference string associated with the seller's record.
   * @param from - Sender's address.
   * @param to - Receiver's address.
   * @returns The receipt (asset) for the payment transaction.
   */
  makePayment(
    vault: Asset,
    amount: uint64,
    description: string,
    sub: pubkey,
    sellerRef: string,
    from: Address,
    to: Address
  ): Asset {
    verifyTxn(this.txn, { sender: from });
    const txnID: uint64 = this.TxnIDx.value;
    assert(this.subscription(sub).value[1] > globals.latestTimestamp);
    const period: uint64 =
      this.subscription(sub).value[0] + this.subscription(sub).value[1];
    const recordID: byte32 = keccak256(sellerRef + period.toString());
    assert(this.sellerRecord(recordID).exists);

    //opt in app into asset
    sendAssetTransfer({
      xferAsset: vault,
      assetAmount: 0,
      fee: 10000,
      assetReceiver: this.app.address,
      sender: this.app.address,
    });

    const roundID: uint64 = this.calculateRoundIndex(
      this.subscription(sub).value[0],
      globals.latestTimestamp
    );

    const receipt: Asset = sendAssetCreation({
      configAssetTotal: 1,
      configAssetFreeze: this.app.address,
      configAssetClawback: this.app.address,
      sender: this.app.address,
    });

    const metadata: metadata = {
      vault: vault,
      value: amount,
      description: description,
      status: 0,
      receipt: receipt,
      to: to,
      from: this.txn.sender,
      rIdx: roundID,
    };

    this.transactionDetails(txnID).value = metadata;
    this.sellerRecord(recordID).value.push(txnID);
    this.TxnIDx.value = this.TxnIDx.value + 1;
    return receipt;
  }

  /**
   * Handles the payment claim process, verifying the seller's signature and transferring assets to the seller.
   * @param txID - Transaction ID of the payment transaction.
   * @param payASA - Asset associated with the payment.
   * @param txn - Payment transaction details.
   */
  claimPayment(txID: uint64, payASA: Asset, txn: PayTxn): void {
    // FIXME THOUGHTS: Replace with EDSAVerify Instead of addr to confirm signature?
    assert(this.transactionDetails(txID).exists);
    const pubKey: Address = this.transactionDetails(txID).value.to;
    assert(this.txn.sender === pubKey);
    verifyTxn(txn, { receiver: pubKey });
    const status: uint64 = this.transactionDetails(txID).value.status;
    assert(status === 0);
    const asset: Asset = this.transactionDetails(txID).value.vault;
    assert(payASA === asset);
    const amount: uint64 = this.transactionDetails(txID).value.value;
    assert(amount > 0);

    //send asset from vault to seller
    this.pendingGroup.addAssetTransfer({
      xferAsset: asset,
      assetAmount: amount,
      assetReceiver: this.txn.sender,
      fee: 10000,
    });

    this.pendingGroup.submit();

    this.transactionDetails(txID).value.value = 0;
    this.transactionDetails(txID).value.status = 1;
  }

  claimReceipt(txID: uint64, receipt: Asset): void {
    assert(this.transactionDetails(txID).exists);
    const payer: Address = this.transactionDetails(txID).value.from;
    assert(payer === this.txn.sender);
    const asset: Asset = this.transactionDetails(txID).value.receipt;
    assert(asset !== Asset.zeroIndex); //

    sendAssetTransfer({
      xferAsset: receipt,
      assetAmount: 1,
      fee: 10000,
      assetReceiver: this.txn.sender,
      sender: this.app.address,
    });

    this.transactionDetails(txID).value.receipt = Asset.zeroIndex;
  }

  /**
   * Retrieves the current subscription period for a given account.
   * @param acc - Public key of the account.
   * @returns The subscription period [startDate, endDate].
   */
  getLastSubscription(acc: pubkey): period {
    return this.subscription(acc).value;
  }

  /**
   * Retrieves the receipt (asset) associated with a given transaction ID.
   * @param txID - Transaction ID.
   * @returns The receipt (asset) for the specified transaction.
   */
  getReceipt(txID: uint64): Asset {
    const receipt: Asset = this.transactionDetails(txID).value.receipt;
    return receipt;
  }

  /**
   * Retrieves the vault (asset) associated with a given transaction ID.
   * @param txID - Transaction ID.
   * @returns The vault (asset) for the specified transaction.
   */
  getVault(txID: uint64): Asset {
    const receipt: Asset = this.transactionDetails(txID).value.vault;
    return receipt;
  }

  /**
   * Generates a unique record reference based on start and end timestamps and a reference string.
   * @param start - Start timestamp.
   * @param end - End timestamp.
   * @param ref - Reference string.
   * @returns The unique reference for the seller's record.
   */
  getRecordReference(start: uint64, end: uint64, ref: string): byte32 {
    const period: uint64 = start + end;
    const reference: byte32 = keccak256(ref + period.toString());
    return reference;
  }

  /**
   * Retrieves transaction IDs associated with a specific record reference.
   * @param reference - Unique reference for the seller's record.
   * @returns An array of transaction IDs associated with the specified record reference.
   */
  getMyTxnIDs(reference: byte32): uint64[] {
    assert(this.sellerRecord(reference).exists);
    return this.sellerRecord(reference).value;
  }

  /**
   * Retrieves transaction information including description, status, and round index for a given transaction ID.
   * @param txID - Transaction ID.
   * @returns Transaction information object { description, status, rIdx }.
   */
  getTxnInfo(txID: uint64): {
    description: string;
    status: uint64;
    rIdx: uint64;
  } {
    const txnInfo: {
      description: string;
      status: uint64;
      rIdx: uint64;
    } = {
      description: this.transactionDetails(txID).value.description,
      status: this.transactionDetails(txID).value.status,
      rIdx: this.transactionDetails(txID).value.rIdx,
    };
    return txnInfo;
  }
}
