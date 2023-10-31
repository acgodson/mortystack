import '@/styles/globals.css'
import '@/styles/Home.module.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Tabs, extendTheme, useTab } from '@chakra-ui/react'
import { TabsProvider, useTabs } from '@/context/TabsContext'
import { ModalProvider } from "@/context/useModalContext"
import { TransactionProvider } from '@/context/TransactionContext'


export default function App({ Component, pageProps }: AppProps) {

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

  return (
    <ModalProvider>
      <ChakraProvider theme={theme}>
        <TransactionProvider>
          <Component {...pageProps} />
        </TransactionProvider>
      </ChakraProvider>
    </ModalProvider>
  );
}
