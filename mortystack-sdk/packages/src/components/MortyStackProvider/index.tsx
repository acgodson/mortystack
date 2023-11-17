import React, { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ModalProvider } from './contexts/ModalContext';
import { AppProvider } from './contexts/AppContext';
import { Locale } from '../../locales';
import { ThemeMode } from './contexts/ThemeContext';
import { Theme } from '../../themes';
import { NetworkContext } from "./contexts/NetworkContext"
import { TransactionProvider } from './contexts/TransactionContext';
import { AssetIndex, AssetConfig } from '../../utils/helpers';


export interface SignerType {
    addr: string
    secret: string
}


export interface MortyStackProviderProps {
    config: {
        id?: string;
        theme?: ThemeMode | null;
        locale?: Locale;
        assets?: (AssetIndex | AssetConfig)[];
        signer?: SignerType | null
    }
    children: ReactNode;
}

const defaultTheme: ThemeMode = 'light';


export function MortyStackProvider({
    config: { id = "", theme = defaultTheme, assets, locale, signer } = {},
    children,

}: MortyStackProviderProps) {

    return (
        <NetworkContext.Provider value={{ id, status: null }} >
            <AppProvider appInfo={{
                id: id,
                assets: assets,
                signer: signer
            }}>
                <TransactionProvider >
                    <ModalProvider>
                        {children}
                    </ModalProvider>

                </TransactionProvider>
            </AppProvider>
        </NetworkContext.Provider>

    );
}