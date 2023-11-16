import React, { createContext, useContext } from 'react';
import { usePay as usePayHook } from '../../../hooks/usePay';

import { usePendingTransactions } from '../../../hooks/usePendingTransactions';

const TransactionContext: any = createContext({});

export const TransactionProvider = ({ children }: any) => {


    const contextValue = {
        usePay: usePayHook,
    };





    return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
};




export const usePay = usePayHook;