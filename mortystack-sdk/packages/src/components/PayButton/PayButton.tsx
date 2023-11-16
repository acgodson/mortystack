import React, { useEffect, useState } from 'react';
import { ChakraProvider, VStack, useToast } from "@chakra-ui/react"
import { useModal } from '../MortyStackProvider/contexts/ModalContext';
import { PayModal } from '../PayModal/PayModal';
import { Button, Box, Text, HStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { MortyLogoIcon } from "../Icons/mortyIcon"
import { usePay } from '../../hooks/usePay';
import { mortyFont } from "./font"
import { useNetwork } from '../MortyStackProvider/contexts/NetworkContext';
import { PayButtonProps, assets, mortyFontStyles } from '../../utils/helpers';




export function PayButton({ payload }: {
  payload: PayButtonProps,

  isDisabled?: boolean

}) {
  const toast = useToast()
  const { asset } = payload;
  const [setName, setsetName] = useState()
  const { } = usePay()

  const { isOpen, onClose, onOpen } = useModal();
  const { sendPayment, connected } = usePay()


  useEffect(() => {
    if (isOpen && payload && !connected) {
      sendPayment(payload);
    }
  }, [isOpen, connected, payload]);

  useEffect(() => {
    if (isOpen) {
      if (!payload.asset || !payload.amount) {
        onClose();
        console.error("Empty details in the value prop")
      }
    }
  }, [isOpen, payload]);



  return (
    <ChakraProvider resetCSS={false}>
      <Box
        css={mortyFontStyles}
        pt={8}
      >

        <Button
          as="button"
          fontFamily={"CustomFontRegular"}
          borderRadius="12px"
          border={"none"}
          boxShadow={"lg"}
          cursor={"pointer"}
          fontWeight="bold"
          height="fit-content"
          key="pay"
          pt={2}
          pb={3}
          color="white"
          _hover={{
            bg: "#000000",
            color: "white",
            border: "none"
          }}
          _active={{
            bg: "#000000",
            color: "white",
            border: "none"
          }}
          _focus={{
            bg: "#000000",
            color: "white",
            border: "none"
          }}
          bg="#000000"
          onClick={() => onOpen()}
          px={6}
          w="fit-content"
          transition="default"
          type="button"
          isDisabled={!payload.amount || !payload.asset ? true : false}
          leftIcon={<MortyLogoIcon />}
        >

          <VStack
            h="30px"

            justifyContent={"center"}
            alignItems={"flex-start"}
            lineHeight={"14px"}
          >
            <Text fontSize={"xs"}>      We accept {
              asset ?
                assets.find((x) => x.id === asset)?.symbol : "Tokens"
            } </Text>
            asset
            <Box
              fontSize={"2xl"}
            >
              Morty<Box color={"#4f4fde"} as="span">Stack  </Box>
            </Box>
          </VStack>


        </Button>

        <PayModal
          onClose={onClose}
          open={isOpen}
        />


      </Box>
    </ChakraProvider>


  );
}


