import { SenderType } from '@/contexts/TransactionContext';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { MortyClient } from '@/contracts/MortyClient';
import { calculateKeccak256 } from '@/utils/helpers';
import { useSteps } from '@chakra-ui/react';
import { useState, useEffect } from 'react';


import { createContext } from 'react';



export const useInvoiceDetails = () => {
    const [organization, setOrganization] = useState<string>('');
    const [contactEmail, setContactEmail] = useState<string>('');
    const [customerName, setCustomerName] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState<string>('');
    const [invoiceTitle, setInvoiceTitle] = useState<string>('');
    const [invoiceToken, setInvoiceToken] = useState<string>('');
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
        { description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ]);
    const [invoiceTotal, setInvoiceTotal] = useState<number>(0);
    const [preview, setPreview] = useState(false)
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
    });
    const [hasDispenser, setHasDispenser] = useState(true);
    const [record, setRecord] = useState<string>("")

    const reset = () => {
        setOrganization('');
        setCustomerName('');
        setCustomerEmail('')
        setInvoiceTitle('');
        setInvoiceItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 },]);
        setInvoiceToken('')
    }

    useEffect(() => {
        // Recalculate total amount whenever invoice items change
        const total = invoiceItems.reduce((acc, item) => acc + item.amount, 0);
        setInvoiceTotal(total);
    }, [invoiceItems]);


    const handleAddItem = () => {
        setInvoiceItems([...invoiceItems, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    };

    const handleItemInputChange = (index: number, field: keyof InvoiceItem, value: InvoiceItem[keyof InvoiceItem]) => {
        const updatedItems: any[] = [...invoiceItems];
        updatedItems[index][field] = value;
        updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
        setInvoiceItems(updatedItems);
    };

    const invoiceDetails = {
        organization,
        setOrganization,
        contactEmail,
        setContactEmail,
        customerName,
        setCustomerName,
        customerEmail,
        setCustomerEmail,
        invoiceTitle,
        setInvoiceTitle,
        invoiceToken,
        setInvoiceToken,
        invoiceItems,
        handleAddItem,
        handleItemInputChange,
        invoiceTotal,
        setInvoiceItems,
        reset,
        activeStep,
        setActiveStep,
        preview,
        setPreview,
        hasDispenser,
        setHasDispenser,
        record,
        setRecord
    };

    return invoiceDetails;
};

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}
