import React, { useState, useEffect } from 'react';
import { Flex, } from '@chakra-ui/react';
import RightPanel from './RightPanel';
import CenterPanel from './CenterPanel';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { useTransaction } from '@/contexts/TransactionContext';
import useCountdown from '@/hooks/useCountdown';



const DashboardContent = () => {

    const { selectedTransaction, setSelectedTransaction }: any = useTransaction();


    // const [data, setData] = useState<any | null>(null)
    // const org = organizations ? organizations : []

    const hoursLeft = useCountdown({ startDate: "" });
   





    return (
        <Flex
            w="100%"

        >
            <CenterPanel />

            <RightPanel


            />

        </Flex >
    );
};

export default DashboardContent;
