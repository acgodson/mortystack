import { keccak256 } from "js-sha3";

export const balancePretty = (uiString: string) => {
  const numberString = uiString.split(".")[0];
  const nsLen = numberString.length;
  if (nsLen > 9) {
    // Billion case
    const num = numberString.substring(0, nsLen - 9);
    const fract = numberString.substring(nsLen - 9, nsLen - 9 + 2);
    return num + "." + fract + " B";
  } else if (nsLen > 6) {
    // Million case
    const num = numberString.substring(0, nsLen - 6);
    const fract = numberString.substring(nsLen - 6, nsLen - 6 + 2);
    return num + "." + fract + " M";
  } else if (uiString.length > 8) {
    return uiString.substring(0, 8);
  } else {
    return uiString;
  }
};

export const validateEmail = (email: string): boolean => {
  // Regular expression for validating an Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function calculateKeccak256(input: string): string {
  // Calculate Keccak-256 hash
  const hash = keccak256(input);
  return hash;
}

export function generateUniqueReferenceID(
  organizationName: string,
  userID: string
) {
  // Abbreviate the organization name (first 3 letters)
  const organizationAbbreviation = organizationName
    .substring(0, 3)
    .toUpperCase();

  // Generate a random 6-character alphanumeric string
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Get current timestamp (in milliseconds)
  const timestamp = Date.now();

  // Combine elements to create the unique reference ID
  const referenceID = `${organizationAbbreviation}-${timestamp}-${randomString}`;

  return referenceID;
}

export function extractToken(inputString: string) {
  if (!inputString) {
    return;
  }
  let result;
  const parts = inputString.match(/\(([^)]+)\)/);

  if (parts && parts.length > 1) {
    result = parts[1];
    console.log(result);
  } else {
    console.log("No content inside parentheses found.");
  }
  return result;
}
