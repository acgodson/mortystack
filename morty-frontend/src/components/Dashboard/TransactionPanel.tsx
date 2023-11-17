import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useTransaction } from '@/contexts/TransactionContext';
import { calculateKeccak256 } from '@/utils/helpers';
import { hexToUint8Array } from '@certusone/wormhole-sdk';
import algosdk, { Algodv2 } from 'algosdk';
import { MortyClient } from '@/tsContracts/MortyClient';
import { ALGORAND_HOST } from '@/utils/wormhole/consts';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';


const algodClient = new Algodv2(
  ALGORAND_HOST.algodToken,
  ALGORAND_HOST.algodServer,
  ALGORAND_HOST.algodPort
);


interface TransactionProps {
  title: string;
  details: string;
}

const Transaction: React.FC<TransactionProps> = ({ title, details }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { web3AuthAccount, organizations, status, refs, invoices, fetchInvoices }: any = useWeb3AuthProvider();
  const [orgs, setOrgs] = useState(null)

  const typedClient = new MortyClient(
    {
      sender: undefined,
      resolveBy: "id",
      id: 479526612,
    },
    algodClient
  );

  const getAllTransactions = async (oid: string, addr: string) => {

    const res = await typedClient.appClient.getBoxValue(algosdk.decodeAddress(addr).publicKey);
    const decoder = new algosdk.ABITupleType([
      new algosdk.ABIUintType(64),
      new algosdk.ABIUintType(64),
    ]);
    const result: any = decoder.decode(res)
    const resultSum = result.map((x: bigint) => Number(x));
    const period: number = resultSum.reduce(
      (acc: number, num: number) => acc + num,
      0);
    const reference = calculateKeccak256(oid + period.toString());

    //return values for all txnIDs in record
    const recRes = await typedClient.appClient.getBoxValue(hexToUint8Array(reference));

    const decoder2 = new algosdk.ABIArrayDynamicType(new algosdk.ABIUintType(64));

    const result2: any = decoder2.decode(recRes)

    console.log(result2)


  }

  useEffect(() => {
    if (organizations) {
      console.log("from txnPanel:", organizations)
    }

  }, [organizations])



  return (
    <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <IconButton
          aria-label={isOpen ? 'Hide' : 'Show'}
          icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
          onClick={onToggle}
        />
      </Flex>
      <Collapse in={isOpen}>
        <Text mt={2}>{details}</Text>
      </Collapse>
    </Box>
  );
};

const TransactionList: React.FC = () => {
  return (
    <div>
      <Transaction title="Transaction 1" details="Transaction details 1" />
      <Transaction title="Transaction 2" details="Transaction details 2" />
      {/* Add more transactions as needed */}
    </div>
  );
};

const DashboardTransactions: React.FC = () => {
  return (
    <Box
      w="100%"
      pr={0}
      mt={32}
      bgGradient="linear-gradient(to right, #101827, #0f182a)"
      ml={[0, 0, 0, "252px"]}
      maxW={["100%", "100%", "100%", "54%"]}
      p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Transactions
      </Text>
      {/* <TransactionList /> */}
    </Box>
  );
};

export default DashboardTransactions;
