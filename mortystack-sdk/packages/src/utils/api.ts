// src/utils/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/";
export const PAYMENT_PAGE_URL = "http://localhost:3000/";

export const generateTransactionReference = async (metadata: any) => {
  // Send request to your server via API to encrypt paymentDetails and get a reference
  const response = await fetch(`${API_BASE_URL}upload-invoice`, {
    method: "POST",
    body: JSON.stringify({ ref: metadata.record, metadata }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  const currentDate = new Date();
  const expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const timestamp = expiryDate.getTime();

  return {
    success: data.success,
    ref: data.ref,
    expiry: timestamp,
  };
};

// Function to fetch payment status from the server
export const fetchPaymentStatus = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/status`);
    return response.data.status; // Assuming the server returns a JSON object with a 'status' field
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error; // Handle errors in the component that calls this function
  }
};

// Function to process payment on the server
export const processPayment = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/payment/process`);
    // No need to return anything if the payment processing is successful
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error; // Handle errors in the component that calls this function
  }
};
