import React, { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ModalProvider } from './contexts/ModalContext';
import { AppProvider } from './contexts/AppContext';
import { Locale } from '../../locales';
import {
    ModalSizes,
} from './contexts/ModalSizeContext';
import { I18nProvider } from "./contexts/I18nContext"
import { ThemeMode } from './contexts/ThemeContext';
import { Theme } from '../../themes';
import { NetworkContext } from "./contexts/NetworkContext"
import { TransactionProvider } from './contexts/TransactionContext';



export interface MortyStackProviderProps {
    config: {
        id?: string;
        theme?: ThemeMode | null;
        locale?: Locale;
    }
    children: ReactNode;
}

const defaultTheme: ThemeMode = 'light';


export function MortyStackProvider({
    config: { id = "", theme = defaultTheme, locale } = {},
    children,

}: MortyStackProviderProps) {

    return (
        <ChakraProvider theme={Theme} resetCSS={false} >
            <I18nProvider locale={locale}>
                <NetworkContext.Provider value={{ id, status: null }} >
                    <AppProvider>
                        <TransactionProvider>
                            <ModalProvider>
                                {children}
                            </ModalProvider>
                        </TransactionProvider>
                    </AppProvider>
                </NetworkContext.Provider>
            </I18nProvider >
        </ChakraProvider>
    );
}