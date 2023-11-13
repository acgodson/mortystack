import {  uint8ArrayToHex } from "@certusone/wormhole-sdk";
//algo account
import algosdk from "algosdk";
import { arrayify, zeroPad } from "@ethersproject/bytes";


export function algorandTargetAddress(address: string) {
  return uint8ArrayToHex(algosdk.decodeAddress(address).publicKey);
}

export function evmTargetAddress(signerAddress: string) {
  return uint8ArrayToHex(zeroPad(arrayify(signerAddress), 32));
}
