import React, { createContext, useContext } from 'react';
import { PaymentDetailsProp, usePay } from '../../../hooks/usePay';
import { usePendingTransactions } from '../../../hooks/usePendingTransactions';

const TransactionContext: any = createContext({});

export const TransactionProvider = ({ children }: any) => {
    const contextValue = {
        usePay,
    };

    return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
};

