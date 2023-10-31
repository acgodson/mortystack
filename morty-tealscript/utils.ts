import algosdk from "algosdk";
import { keccak256 } from "js-sha3";

export function hexToUint8Array(hex: string): Uint8Array {
  const uint8Array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return uint8Array;
}

export function calculateKeccak256(input: string): string {
  // Calculate Keccak-256 hash
  const hash = keccak256(input);
  return hash;
}

//testnet configuration
export const algodClient = new algosdk.Algodv2(
  "a".repeat(64),
  "http://localhost",
  4001
);

export const indexerClient = new algosdk.Indexer(
  "a".repeat(64),
  "http://localhost",
  8980
);

export const kmdClient = new algosdk.Kmd(
  "a".repeat(64),
  "http://localhost",
  4002
);
