import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext({});

export const TransactionProvider = ({ children }: any) => {
    const [selectedStrategy, setSelectedTransaction] = useState<any | null>(null);

    return (
        <TransactionContext.Provider value={{ selectedStrategy, setSelectedTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};
