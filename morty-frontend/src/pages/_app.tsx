import '@/styles/globals.css'
import '@/styles/Home.module.css'
import '@/styles/fonts.css';
import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { WormholeProvider } from '@/contexts/WormholeContext/WormholeStoreContext'
import { AlgorandWalletProvider } from '@/contexts/WormholeContext/AlgorandWalletContext'
import { EthereumWalletProvider } from '@/contexts/WormholeContext/EthereumWalletContext'
import { TransactionProvider } from '@/contexts/TransactionContext'
import { ModalProvider } from '@/contexts/ModalContext/useModalContext'
import { Web3AuthProvider } from '@/contexts/Web3AuthContext'
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { useInitializeProviders, PROVIDER_ID, WalletProvider } from '@txnlab/use-wallet';
import { useRouter } from 'next/router';
import { RelayWalletProvider } from '@/contexts/WormholeContext/RelayWalletContext';



export default function App({ Component, pageProps }: AppProps) {

  const providers = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    ],
    nodeConfig: {
      nodeServer: process.env.ALGO_RPC_URL!,
      network: "testnet"
    }
  })




  // TODO: set custom lightmode
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: '#101827',
          color: 'white',
        },
      },
    },
  });

  const router = useRouter()

  const isPaymentPage = router.pathname === '/pay';
  const isKitten = router.pathname === '/kitten';

  return (

    <>
      {isPaymentPage || isKitten ? (
        <ChakraProvider theme={theme}>
          <ModalProvider>
            <WalletProvider value={providers}>
              <EthereumWalletProvider>
                <RelayWalletProvider>
                  <WormholeProvider>
                    <Component {...pageProps} />
                  </WormholeProvider>
                </RelayWalletProvider>
              </EthereumWalletProvider>
            </WalletProvider>
          </ModalProvider>
        </ChakraProvider >
      ) :

        (<ChakraProvider theme={theme}>
          <ModalProvider>
            <Web3AuthProvider>
              <WalletProvider value={providers}>
                <TransactionProvider>
                  <EthereumWalletProvider>
                    <AlgorandWalletProvider>
                      <WormholeProvider>
                        <ColorModeScript initialColorMode="dark" />
                        <Component {...pageProps} />
                      </WormholeProvider>
                    </AlgorandWalletProvider>
                  </EthereumWalletProvider>
                </TransactionProvider>
              </WalletProvider>
            </Web3AuthProvider>
          </ModalProvider >
        </ChakraProvider>
        )
      }

    </>

  );
}
