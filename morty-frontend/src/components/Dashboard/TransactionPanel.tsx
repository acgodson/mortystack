import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
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
import { useWallet } from '@txnlab/use-wallet';


const algodClient = new Algodv2(
  ALGORAND_HOST.algodToken,
  ALGORAND_HOST.algodServer,
  ALGORAND_HOST.algodPort
);


const typedClient = new MortyClient(
  {
    sender: undefined,
    resolveBy: "id",
    id: 479526612,
  },
  algodClient
);

const Transaction: React.FC<any> = ({ value, id, assetID, details, }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [asset, setAsset] = useState<string | null>(null);

  const fetchAsset = async () => {
    const assetInfo = await algodClient.getAssetByID(assetID).do();
    setAsset(assetInfo.params["unit-name"])
  }


  useEffect(() => {
    if (assetID && !asset) {
      fetchAsset()
    }
  }, [asset, assetID])



  assetID
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">
          {value} {asset ? asset : assetID}
        </Text>
        <Box>
          <Button
            colorScheme='blue'
          > Withdraw</Button>
          <IconButton
            ml={5}
            aria-label={isOpen ? 'Hide' : 'Show'}
            icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            onClick={onToggle}
          />
        </Box>
      </Flex>
      <Collapse in={isOpen}>
        <HStack justifyContent={"left"}
          px={0}
        >

          <Text fontSize={"xs"}>invoice ref: {details}</Text>


        </HStack>
      </Collapse>
    </Box>
  );
};

const TransactionList = ({ data }: { data: any }) => {

  return (
    <Box>
      {
        data.map((x: any, i: number) => (
          <Transaction
            key={x.id}
            value={Number(x.value)}
            assetID={Number(x.vault)}
            id={Number(x.id)}
            details={x.description}
          />

        ))}

    </Box>
  );
};

const DashboardTransactions: React.FC = () => {

  const { web3AuthAccount, organizations }: any = useWeb3AuthProvider();
  const [txns, settxns] = useState<any | null>(null)
  const { activeAddress } = useWallet()


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
    if (reference) {
      const recRes = await typedClient.appClient.getBoxValue(hexToUint8Array(reference));
      const decoder2 = new algosdk.ABIArrayDynamicType(new algosdk.ABIUintType(64));
      const result2: any = decoder2.decode(recRes)
      const transactionIDs = result2.map((x: bigint) => Number(x));
      console.log("txn IDs", transactionIDs)
      settxns(true)
      let transactions = [];
      if (transactionIDs.length > 0) {
        for (let index = 0; index < transactionIDs.length; index++) {
          const id = transactionIDs[index];
          const res = await typedClient.appClient.getBoxValue(algosdk.encodeUint64(id));

          const nNecoder = new algosdk.ABITupleType([
            new algosdk.ABIUintType(64),
            new algosdk.ABIUintType(64),
            new algosdk.ABIStringType(),
            new algosdk.ABIUintType(64),
            new algosdk.ABIUintType(64),
            new algosdk.ABIAddressType(),
            new algosdk.ABIAddressType(),
            new algosdk.ABIUintType(64),
          ]);
          const result = nNecoder.decode(res)
          const metadata = {
            vault: result[0],
            value: result[1],
            description: result[2],
            status: result[3],
            receipt: result[4],
            to: result[5],
            from: result[6],
            rIdx: result[7],
            id: Number(id)
          };


          transactions.push(metadata)
        }

        console.log("all transs", transactions)
        settxns(transactions)
      }
    }
  }

  useEffect(() => {
    if (activeAddress && organizations && organizations.length > 0 && !txns) {
      console.log("from txnPanel:", organizations)
      getAllTransactions(organizations[0].oid, activeAddress)
    }
  });


  useEffect(() => {
    console.log("all transactions")
  }, [txns])

  const gertOrignalAsset = () => {
  }



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
      {txns && txns.length > 0 && (
        <TransactionList data={txns} />
      )}
    </Box>
  );
};

export default DashboardTransactions;
