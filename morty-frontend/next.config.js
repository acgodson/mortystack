/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  env: {
    ALGO_API_KEY: process.env.ALGO_API_KEY,
    ALGO_INDEXER_URL: process.env.ALGO_INDEXER_URL,
    ALGO_RPC_URL: process.env.ALGO_RPC_URL,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_JWT: process.env.PINATA_JWT,
    COVALENT_API_KEY: process.env.COVALENT_API_KEY,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
    APPID: process.env.APPID,
    CRYPTO_COMPARE_API_KEY: process.env.CRYPTO_COMPARE_API_KEY,
  },
};

module.exports = nextConfig;
