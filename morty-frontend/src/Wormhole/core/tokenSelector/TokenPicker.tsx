
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Center, Container, Image, HStack, IconButton, Input, List, ListItem, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Text, Tooltip, Flex } from "@chakra-ui/react";
import { MdArrowDownward, MdRefresh } from "react-icons/md";
import { ChainId } from "@certusone/wormhole-sdk";
import { useWormholeContext } from "@/contexts/WormholeContext/WormholeStoreContext";
import { balancePretty } from "@/utils/helpers";
import { getIsTokenTransferDisabled } from "@/utils/wormhole/consts";
import { ParsedTokenAccount } from "@/utils/wormhole/parsedTokenAccount";

export function shortenAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : address;
}

export const BasicAccountRender = (
  account: any,
  displayBalance?: (account: any) => boolean
) => {

  const mintPrettyString = shortenAddress(account.mintKey);
  const uri = account.logo || account.uri;
  const symbol = account.symbol || "Unknown";
  const name = account.name || "Unknown";
  const shouldDisplayBalance = !displayBalance || displayBalance(account);


  const tokenContent = (
    <HStack
      w="100%"
      justifyContent={"space-between"}
      px={5}
    >
      <Flex>
        <Box>
          {uri && <Image
            h='25px'
            w="auto"
            alt="" src={uri} />}
        </Box>
        <Box ml={3}>
          <Text variant="subtitle1">{symbol}</Text>
        </Box>
      </Flex>



      <Box>
        {
          <Text color='gray' fontSize="xs" variant="body1">
            {account.isNativeAsset ? "Native" : mintPrettyString}
          </Text>
        }
      </Box>

      <Box>
        {shouldDisplayBalance ? (
          <>
            <Text fontSize={"xs"} variant="body2">{"Balance"}</Text>
            <Text fontSize={"xs"} variant="h6">
              {balancePretty(account.uiAmountString)}
            </Text>
          </>
        ) : (
          <Box />
        )}
      </Box>


    </HStack>
  );

  return tokenContent;
};



export default function TokenPicker({
  value,
  options,
  RenderOption,
  onChange,
  isValidAddress,
  getAddress,
  disabled,
  resetAccounts,
  nft,
  chainId,
  error,
  showLoader,
  useTokenId,
  mintkey
}: {
  value: ParsedTokenAccount | null;
  options: any[];
  RenderOption: ({
    account,
  }: {
    account: any;
  }) => JSX.Element;
  onChange: (newValue: any | null) => Promise<void>;
  isValidAddress?: (address: string, chainId: ChainId) => boolean;
  getAddress?: (
    address: string,
    tokenId?: string
  ) => Promise<any>;
  disabled: boolean;
  resetAccounts: (() => void) | undefined;
  nft: boolean;
  chainId: ChainId;
  error?: string;
  showLoader?: boolean;
  useTokenId?: boolean;
  mintkey?: string
}) {

  const [holderString, setHolderString] = useState("");
  const [tokenIdHolderString, setTokenIdHolderString] = useState("");
  const [loadingError, setLoadingError] = useState("");
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const { targetChain }: any = useWormholeContext()



  useEffect(() => {
    setHolderString(mintkey!)
  }, [targetChain, holderString, chainId])



  const openDialog = useCallback(() => {
    setHolderString("");
    setSelectionError("");
    setDialogIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogIsOpen(false);
  }, []);



  const init = async (option: any) => {
    setSelectionError("");
    let newOption = null;
    try {
      //Covalent balances tend to be stale, so we make an attempt to correct it at selection time.
      if (getAddress && !option.isNativeAsset) {
        newOption = await getAddress(option.mintKey, option.tokenId);
        newOption = {
          ...option,
          ...newOption,
          // keep logo and uri from covalent / market list / etc (otherwise would be overwritten by undefined)
          logo: option.logo || newOption.logo,
          uri: option.uri || newOption.uri,
        } as any;
      } else {
        newOption = option;
      }
      await onChange(newOption);
      // closeDialog();
    } catch (e: any) {
      if (e.message?.includes("v1")) {
        setSelectionError(e.message);
      } else {
        setSelectionError(
          "Unable to retrieve required information about this token. Ensure your wallet is connected, then refresh the list."
        );
      }
    }
  };


  // useEffect(() => {
  //   init()
  // }, [getAddress, onChange, closeDialog])




  useEffect(() => {
    setHolderString(mintkey || ""); // Set holderString to mintkey on mount
    initFromMintkey(); // Load token based on mintkey
  }, [mintkey]); // Re-run when mintkey changes


  const initFromMintkey = async () => {
    if (!isValidAddress || !getAddress || !mintkey) {
      return;
    }

    setLoadingError("");
    let cancelled = false;
    if (isValidAddress(mintkey, chainId)) {
      const option = localFind(mintkey, tokenIdHolderString);
      if (option) {
        init(option);
        return () => {
          cancelled = true;
        };
      }
      setLocalLoading(true);
      setLoadingError("");
      getAddress(mintkey, useTokenId ? tokenIdHolderString : undefined).then(
        (result) => {
          if (!cancelled) {
            setLocalLoading(false);
            if (result) {
              init(result);
            }
          }
        },
        (error) => {
          if (!cancelled) {
            setLocalLoading(false);
            setLoadingError("Could not find the specified address.");
          }
        }
      );
    }
    return () => (cancelled = true);
  };


  const resetAccountsWrapper = useCallback(() => {
    setHolderString("");
    setTokenIdHolderString("");
    setSelectionError("");
    resetAccounts && resetAccounts();
  }, [resetAccounts]);

  const searchFilter = useCallback(
    (option: any) => {
      if (!holderString) {
        return true;
      }
      const optionString = (
        (option.publicKey || "") +
        " " +
        (option.mintKey || "") +
        " " +
        (option.symbol || "") +
        " " +
        (option.name || " ")
      ).toLowerCase();
      const searchString = holderString.toLowerCase();
      return optionString.includes(searchString);
    },
    [holderString]
  );

  const nonFeaturedOptions = useMemo(() => {
    return options.filter(
      (option: any) => searchFilter(option) // &&
      //nft
    );
  }, [options, searchFilter]);

  const localFind = useCallback(
    (address: string, tokenIdHolderString: string) => {
      return options.find(
        (x) =>
          x.mintKey === address &&
          (!tokenIdHolderString || x.tokenId === tokenIdHolderString)
      );
    },
    [options]
  );

  //This is the effect which allows pasting an address in directly
  useEffect(() => {

    if (!isValidAddress || !getAddress) {
      return;
    }

    if (useTokenId && !tokenIdHolderString) {
      return;
    }
    setLoadingError("");
    let cancelled = false;
    if (isValidAddress(holderString, chainId)) {
      console.log(holderString)
      const option = localFind(holderString, tokenIdHolderString);
      if (option) {
        init(option);
        return () => {
          cancelled = true;
        };
      }
      setLocalLoading(true);
      setLoadingError("");
      getAddress(
        holderString,
        useTokenId ? tokenIdHolderString : undefined
      ).then(
        (result) => {
          if (!cancelled) {
            setLocalLoading(false);
            if (result) {
              init(result);
            }
          }
        },
        (error) => {
          if (!cancelled) {
            setLocalLoading(false);
            setLoadingError("Could not find the specified address.");
          }
        }
      );
    }
    return () => (cancelled = true);
  }, [
    holderString,
    isValidAddress,
    getAddress,
    localFind,
    tokenIdHolderString,
    useTokenId,
    chainId,
  ]);


  const localLoader = (
    <Center>
      <Spinner /><br />
      <Text variant="body2">
        {showLoader ? "Loading available tokens" : "Searching for results"}
      </Text>
    </Center>
  );

  const displayLocalError = (
    <Center>
      <Text variant="body2" color="error">
        {loadingError || selectionError}
      </Text>
    </Center>
  );

  const dialog = (
    <Modal
      onClose={closeDialog}
      aria-labelledby="simple-dialog-title"
      isOpen={dialogIsOpen}
      // maxWidth="sm"
      w="full"
    >
      <ModalHeader>
        <Box>
          <Text variant="h5">Select a token</Text>
          <Box />
          <Tooltip title="Reload tokens">
            <IconButton aria-label="refresh" icon={<MdRefresh />} onClick={resetAccountsWrapper} />
          </Tooltip>
        </Box>
      </ModalHeader>
      <ModalBody bg='gray.700'>
        <ModalContent bg='gray.700' minH='40vh'
          pt={12}
        >

          {isLocalLoading || showLoader ? (
            localLoader
          ) : loadingError || selectionError ? (
            displayLocalError
          ) : (
            <List as="div"
              h="100%"
              justifyContent={"center"}
              flexDir={"column"}
              display={"flex"}
              alignItems={"center"}
            >
              {nonFeaturedOptions.map((option) => {
                return (
                  <ListItem
                    bg="gray.800"
                    py={3}
                    _hover={{
                      bg: "gray.900"
                    }}
                    w="100%"
                    as="button"
                    // onClick={() => handleSelectOption(option)}
                    key={
                      option.publicKey + option.mintKey + (option.tokenId || "")
                    }
                    disabled={getIsTokenTransferDisabled(
                      chainId,
                      targetChain,
                      option.mintKey
                    )}
                  >
                    <RenderOption account={option} />
                  </ListItem>
                );
              })}
              {nonFeaturedOptions.length ? null : (
                <Box textAlign={'center'}>
                  <Text>No results found</Text>
                </Box>
              )}
            </List>
          )}
        </ModalContent>
      </ModalBody>
    </Modal>
  );

  const selectionChip = (

    <Button
      mt={8}
      h="50px"
      w="100%"
      bg="#080d15"
      // onClick={openDialog}
      disabled={disabled}
      variant="outlined"
      leftIcon={<MdArrowDownward />}
    >
      {value ? (
        <RenderOption account={value} />
      ) : (
        <Text color="textSecondary">Select Payment Token</Text>
      )}
    </Button>

  );

  return (
    <Box py={1}>
      {dialog}

      {selectionChip}
    </Box>
  );
}
