import React, { useState } from "react";
import { Flex, Box, Text, HStack, Button, useModal } from "@chakra-ui/react";
import RightPanel from "./RightPanel";
import { useSignInModal } from "@/context/useModalContext";
import { FiCircle } from 'react-icons/fi';
import BulletTitle from "../Headers";
import CreateButton from "../CreateButton/CreateButton";
import { useTransaction } from "@/context/TransactionContext";
import { Transaction } from "./DashboardContent";



const CenterPanel = (transactions: Transaction[] | any) => {
  const { selectedStrategy, setSelectedStrategy }: any = useTransaction();
  const exists = transactions && transactions.length > 0
  const data = exists ? transactions : Array.from({ length: 3 }, (_, index) => ``);


  return (

    <Box
      bg="red"
      flex="1"
      overflowY="auto"
      w="100%"
      position={!selectedStrategy ? "fixed" : "relative"}
      pr={
        !selectedStrategy ?
          14 : 0}

      bgGradient="linear-gradient(to right, #101827, #0f182a)"
      ml="252px"
      maxW="44%"
    // minH="100vh"
    >
      <Box mt={20}
        py={1} w="100%" pr={16} pl={8}>
        <BulletTitle title=
          // " Active Strategies"
          " Active Invoices"

        />

        {data && (
          <>
            <Box w="100%" pr={10} pl={3}>
              <Box
                bg="rgba(21, 34, 57, 0.6)"
                border="solid 0.9px #253350"
                borderRadius={"12px"}
                sx={{
                  backdropFilter: "blur(15px) saturate(120%)",
                }}

                py={5} px={2} w="100%" >
                {data.map((item: any, index: number) => (
                  <Box
                    bg={selectedStrategy === item ? "#253350" : "#182942"}
                    key={index}
                    cursor={exists ? "pointer" : "default"}
                    // onClick={() => { }}
                    onClick={exists ? () => setSelectedStrategy(item) : () => { }}
                    px={4}
                    py={6}
                    borderRadius={"12px"}
                    w="100%"
                    color={selectedStrategy === item ? "white" : "whiteAlpha.500"}
                    mb={8}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}

        <CreateButton />

      </Box>
    </Box >

  );
};

export default CenterPanel;
