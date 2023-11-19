import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
//@ts-ignore
import { MortyStackProvider, usePay, PayButton } from 'mortystack'


export default function App({ Component, pageProps }: AppProps) {

  const { initAssets, ASSET_IDS, } = usePay()


  const selectedAssets = initAssets([
    ASSET_IDS.WETH,
    { id: 10458941, symbol: "USDC" }, //custom asset
    ASSET_IDS.ALGOS,
    ASSET_IDS.WMATIC,
  ]);


  const config = {
    id: "HIG-1700166882994-KB0H0K",
    assets: selectedAssets,
    signer: {
      addr: "HI2XIZK5RGT6AUVECTRQ35X6GJJO4ZAWLX4Y5A6I5WTMA6GQFJNCP7TN2I",
      secret: process.env.Secret // dispenser hash secret. Currently disabled but N/B This is not the secret associated with signer addr
    }
  }


  return (
    <MortyStackProvider config={config}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </MortyStackProvider>
  )

}

// "mortystack": "^0.1.0-alpha.5",