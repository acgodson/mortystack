// middleware.ts

import { NextApiRequest } from "next";

export async function middleware(req: NextApiRequest) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://example-1.com",
    "https://example-2.com",
    "https://example-99.com",
  ];

  const updatedHeaders: Record<string, string> = {};

  if (origin && allowedOrigins.includes(origin)) {
    updatedHeaders["Access-Control-Allow-Origin"] = origin;
  }

  updatedHeaders["Access-Control-Allow-Credentials"] = "true";
  updatedHeaders["Access-Control-Allow-Methods"] =
    "GET, DELETE, PATCH, POST, PUT";
  updatedHeaders["Access-Control-Allow-Headers"] =
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";

  return updatedHeaders;
}
