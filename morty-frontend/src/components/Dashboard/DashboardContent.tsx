import React, { useState } from 'react';
import { Flex, Box, Text, HStack, Button } from '@chakra-ui/react';
import RightPanel from './RightPanel';
import CenterPanel from './CenterPanel';


export interface Transaction {
    id: number | string;
    name: string;
    amountInvested: number;
    currentWorth: number;
    balance: number;
    gmxPosition: number;
    insurance: boolean;
    typeOfInsurance?: string;
}


const DashboardContent = () => {

    //this is where we'll pass the strategies from
    return (
        <Flex w="100%"
           
        >
            <CenterPanel strategies={[]} />
            <RightPanel />
        </Flex>
    );
};

export default DashboardContent;
