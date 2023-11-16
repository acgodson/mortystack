// pages/api/price.ts
import { NextApiRequest, NextApiResponse } from 'next';

async function priceFetcher(symbol: string): Promise<number | null> {
  try {
    const apiKey = process.env.CRYPTO_COMPARE_API_KEY;
    if (!apiKey) {
      throw new Error('API key not provided');
    }

    const response = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Apikey ${apiKey}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.USD;
    } else {
      console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required in the request body' });
  }

  const usdPrice = await priceFetcher(symbol);

  if (usdPrice !== null) {
    res.status(200).json({ symbol, usdPrice });
  } else {
    res.status(500).json({ error: 'Failed to fetch USD price' });
  }
}
