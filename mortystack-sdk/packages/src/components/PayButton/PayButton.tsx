import React, { useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react"
import { useModal } from '../MortyStackProvider/contexts/ModalContext';
import { PayModal } from '../PayModal/PayModal';
import { Button, Box, Text, HStack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import AlgorandLogo from "../Icons/Algorand"
import InfoIcon from "../Icons/InfoIcon"
import { PaymentDetailsProp, usePay } from '../../hooks/usePay';




export interface PayButtonProps {
  label?: string;
  value?: PaymentDetailsProp
}

const defaultProps = {
  label: 'MortyStack',
} as const;


const LearnMoreInfoIcon = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <Menu autoSelect={false} isOpen={isMenuOpen} onClose={handleMenuClose}>
      <MenuButton
        as={Box}
        cursor={"pointer"}
        onClick={handleMenuOpen}
      >< InfoIcon />
      </MenuButton>
      <MenuList border={"1px solid whitesmoke"}>
        <MenuItem border={"none"}>USDC, ALGO, etc</MenuItem>
      </MenuList>
    </Menu>
  )
}


export function PayButton({ label = defaultProps.label, value }: PayButtonProps) {
  const { isOpen, onClose, onOpen } = useModal();
  const { sendPayment, connected } = usePay()
  const toast = useToast()
 
  useEffect(() => {
    if (isOpen && value && !connected) {
      sendPayment(value);
    }
  }, [isOpen, connected, value]);

  useEffect(() => {
    if (isOpen) {
      if (!value) {
        onClose();
        console.error("Empty details in the value prop")
      }
    }
  }, [isOpen, value]);



  return (
    <>

      <HStack pt={2} pb={2} maxW="180px">
        <Text
          cursor={"default"}
          fontWeight={"bold"} fontSize={"10px"}> Pay with Crypto</Text>

        <LearnMoreInfoIcon />


      </HStack>


      <Button
        as="button"
        borderRadius="10px"
        border={"none"}
        cursor={"pointer"}
        fontWeight="bold"
        height="45px"
        key="pay"
        color="white"
        _hover={{
          bgGradient: 'linear(to-l, #1E90FF, #00BFFF)',
          color: "white",
          border: "none"
        }}
        _active={{
          bgGradient: 'linear(to-l, #1E90FF, #00BFFF)',
          color: "white",
          border: "none"
        }}
        _focus={{
          bgGradient: 'linear(to-l, #1E90FF, #00BFFF)',
          color: "white",
          border: "none"
        }}
        bgGradient='linear(to-l, #1E90FF, #00BFFF)'
        onClick={() => onOpen()}
        px={6}
        w="fit-content"
        transition="default"
        type="button"
        leftIcon={<AlgorandLogo />}
      >
        {label}


      </Button>

      <PayModal onClose={onClose} open={isOpen} />

    </>

  );
}

PayButton.__defaultProps = defaultProps;
