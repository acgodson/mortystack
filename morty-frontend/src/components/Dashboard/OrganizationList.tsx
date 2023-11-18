import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { Box, Flex, Text, IconButton, HStack, useToast, useClipboard } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';



const OrganizationList = () => {
  const { organizations }: any = useWeb3AuthProvider()
  const [value, setValue] = useState("")
  const [index, setIndex] = useState(0)
  const { onCopy } = useClipboard(value)
  const toast = useToast();



  const handleCopy = (organization: any) => {

    console.log(`Copying info for organization: ${organization.oid}`);
    onCopy()
    toast({
      status: "success",
      description: " ID copied successfully",
      position: "top"
    })


  };

  return (
    <Box
      w="100%"
      pr={0}
      mt={32}
      bgGradient="linear-gradient(to right, #101827, #0f182a)"
      ml={[0, 0, 0, "252px"]}
      maxW={["100%", "100%", "100%", "100%"]}
      p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        My  Organizations
      </Text>
      <Flex w="100%" flexWrap="wrap">
        {organizations && organizations.length > 0 && organizations.map((org: any) => (
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="100%"
            key={org.oid} p={4} borderWidth="1px" borderRadius="md" m={2}>
            <Text fontWeight="bold">{org.name}</Text>
            <Text
              py={3}
              px={3}
              bg="blackAlpha.200"
            > {org.oid}</Text>
            <IconButton
              aria-label="Copy organization info"
              icon={<FaCopy />}
              onClick={() => handleCopy(org)}
            />
          </HStack>
        ))}
      </Flex>
    </Box>
  );
};



export default OrganizationList;
