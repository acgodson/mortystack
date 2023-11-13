import { ethers_contracts } from "@certusone/wormhole-sdk";
import { ethers } from "ethers";
import { arrayify, formatUnits } from "ethers/lib/utils";
import { createParsedTokenAccount } from "./parsedTokenAccount";

export async function getEthereumToken(
  tokenAddress: string,
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
) {
  const token = ethers_contracts.TokenImplementation__factory.connect(
    tokenAddress,
    provider
  );
  return token;
}

export async function ethTokenToParsedTokenAccount(
  token: ethers_contracts.TokenImplementation,
  signerAddress: string
) {
  const decimals = await token.decimals();
  const balance = await token.balanceOf(signerAddress);
  const symbol = await token.symbol();
  const name = await token.name();
  return createParsedTokenAccount(
    signerAddress,
    token.address,
    balance.toString(),
    decimals,
    Number(formatUnits(balance, decimals)),
    formatUnits(balance, decimals),
    symbol,
    name
  );
}

export function isValidEthereumAddress(address: string) {
  return ethers.utils.isAddress(address);
}
