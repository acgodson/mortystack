import React from 'react';
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


interface TransactionProps {
  title: string;
  details: string;
}

const Transaction: React.FC<TransactionProps> = ({ title, details }) => {
  const { isOpen, onToggle } = useDisclosure();

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
