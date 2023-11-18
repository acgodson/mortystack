import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import { Box, useDisclosure } from "@chakra-ui/react";
import CreateNewShopModal from "../Modal/CreateNewShopModal";

const CreateShopButton = ({ setShops }: { setShops: any }) => {
  const { organizations }: any = useWeb3AuthProvider();
  const isDisabled =
    !organizations || (organizations && organizations.length < 1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        border="solid 0.9px #253350"
        bg="rgba(11 3 46, 0.9)"
        sx={{
          backdropFilter: "blur(15px) saturate(120%)",
        }}
        cursor="pointer"
        px={4}
        py={6}
        borderRadius={"12px"}
        w="100%"
        color={"whiteAlpha.700"}
        mb={8}
        onClick={isDisabled ? () => null : onOpen}
      >
        New Shop
      </Box>

      <CreateNewShopModal
        isOpen={isOpen}
        onClose={onClose}
        setShops={setShops}
      />
    </>
  );
};

export default CreateShopButton;
