import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import AModalLayout from "@/layout/ActionModal";
import { createShop, getShopsByOid } from "@/libs/shops";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalBody = ({ setShops, onClose }: { setShops: any; onClose: any }) => {
  const { organizations }: any = useWeb3AuthProvider();

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const toast = useToast();

  // Updated regex to allow domain characters
  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
    setShopName(sanitizedValue);
  };

  return (
    <VStack
      w="100%"
      position={"relative"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        mb={8}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        alignSelf={"center"}
        w="100%"
        maxW={"500px"}
      >
        <Box w="100%" pt={32}>
          <FormControl>
            <FormLabel fontSize={["md", "md", "lg", "2xl"]} mt={4}>
              Shop name
            </FormLabel>
            <Input
              w="100%"
              value={shopName}
              onChange={handleShopNameChange}
              placeholder="Enter shop name"
            />
            <FormLabel fontSize={["md", "md", "lg", "2xl"]} mt={4}>
              Shop description
            </FormLabel>
            <Textarea
              w="100%"
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              placeholder="Enter shop description"
            />
          </FormControl>

          <HStack py={12} w="100%" spacing={10} alignItems={"center"}>
            <Button
              colorScheme="green"
              onClick={() => {
                createShop(
                  {
                    description: shopDescription,
                    name: shopName,
                    oid: organizations[0].oid,
                  },
                  (error: string) => {
                    if (error) {
                      toast({
                        status: "error",
                        description: error,
                      });
                    } else {
                      toast({
                        status: "success",
                        description: "Shop created",
                      });

                      // get shop by OID
                      const myCallback = (error: string, shops?: any[]) => {
                        if (error) {
                          toast({
                            status: "error",
                            description: error,
                          });
                        } else {
                          console.log(shops);
                          setShops(shops || []);
                        }
                      };

                      getShopsByOid(organizations[0].oid, myCallback);

                      onClose();
                    }
                  }
                );
              }}
            >
              Create
            </Button>
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
};

const CreateNewShopModal: React.FC<CreateOrgModalProps & { setShops: any }> = ({
  isOpen,
  onClose,
  setShops,
}) => {
  return (
    <>
      <AModalLayout
        isOpen={isOpen}
        onClose={onClose}
        title={"New Shop"}
        size={"fit-content"}
        body={<ModalBody setShops={setShops} onClose={onClose} />}
      />
    </>
  );
};

export default CreateNewShopModal;
