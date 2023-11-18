import React, { useEffect, useState } from "react";
import { Flex, Box, Text, HStack, Step, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, Stepper, Center, VStack, Button } from "@chakra-ui/react";
import BulletTitle from "../Headers";
import CreateButton from "../Invoice/CreateButton";
import { useTransaction } from "@/contexts/TransactionContext";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";
import SubscribeButton from "../Subscription/SubscribeButton";
import AddOrgButton from "../Organization/AddOrgButton";
import { useWallet } from "@txnlab/use-wallet";
import AnimatedSpinner from "../Animations/AnimatedSpinner";



const CenterPanel = () => {

  const { selectedTransaction, setSelectedTransaction }: any = useTransaction();
  const { web3AuthAccount, loading, organizations, status, refs, invoices, fetchInvoices }: any = useWeb3AuthProvider()
  const { activeAddress, providers } = useWallet()
  const [data, setData] = useState<any | null>(null)
  const org = organizations ? organizations : []
  const [currentStep, setCurrentStep] = useState<number>(0);
  useEffect(() => {
    return setCurrentStep(
      !status || status === "0" ? 0 :
        status > 0 ?
          organizations && organizations.length < 1 ? 1 :
            2 : 0);
  }, [status, organizations, setCurrentStep])


  useEffect(() => {
    if (invoices) {
      setData(invoices)
    }
  }, [invoices])

  useEffect(() => {
    if (refs && refs.length > 0 && !invoices) {

      console.log(refs)
      fetchInvoices(refs);
    }

  })


  return (

    <Box
      flex={"1"}
      overflowY="hidden"
      w="100%"
      pr={[0, 0, !selectedTransaction ? 14 : 14]}
      bgGradient="linear-gradient(to right, #101827, #0f182a)"
      ml={[0, 0, 0, "252px"]}
      maxW={["100%", "100%", "100%", "54%"]}
      minH="100vh"
    >
      <Box
        mt={20}
        py={1}
        w="100%"
        pr={[0, 0, 16]} pl={[0, 0, 8]}>

        {web3AuthAccount &&
          <>

            {loading ?
              <Box w="100%">
                <Center
                  ml={[0, 0, 0, "252px"]}
                  mx={0}
                  position={"fixed"}
                  pt={32}>
                  <AnimatedSpinner />
                </Center>
              </Box>

              :
              <>

                {data && (
                  <BulletTitle title=
                    " Active Invoices"
                  />
                )}

                {data && Array.isArray(data) && data.length > 0 && (
                  <>
                    <Box
                      w="100%"
                      mt={[5, 5, 0, 0]}
                      pr={[0, 0, 10]}
                      pl={[0, 0, 3]}>


                      <Box
                        mt={5} px={2} w="100%" >
                        {data.map((item: any, index: number) => (
                          <Box
                            mb={8}
                            bg="rgba(21, 34, 57, 0.6)"
                            border="solid 0.9px #253350"
                            borderRadius={"12px"}
                            sx={{
                              backdropFilter: "blur(15px) saturate(120%)",
                            }}

                            pb={3}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            key={index}
                          >
                            <Box
                              bg={selectedTransaction === item ? "#253350" : "#182942"}

                              cursor={data ? "pointer" : "default"}
                              // onClick={() => { }}
                              onClick={() => setSelectedTransaction(index + 1)}
                              px={4}
                              py={4}
                              borderRadius={"12px"}
                              w="100%"
                              color={selectedTransaction === item ? "white" : "whiteAlpha.500"}

                            >
                              <HStack w="100%"

                                justifyContent={"space-between"}>
                                <VStack
                                  w="60%"
                                  pr={3}
                                  textAlign={"left"}
                                  justifyContent={"flex-start"}
                                  alignItems={"flex-start"}
                                >
                                  <Text
                                    textAlign={"left"}
                                    color="whiteAlpha.700"
                                    fontWeight={"semibold"}
                                  >
                                    {item.metadata.invoiceTitle?.toUpperCase() || ""}</Text>
                                  <Box
                                    color="whiteAlpha.800"
                                    fontSize={"xs"}

                                  >
                                    <Box as="span" color="#6c7686" pr={2}>
                                      Billed to:
                                    </Box>
                                    {item.metadata.customerName} ({item.metadata.customerEmail})</Box>
                                  <Box

                                    fontSize={"xs"}

                                  >org:   ({item.metadata.organization})</Box>



                                </VStack>
                                <VStack w="40%">
                                  <Text
                                    color="whiteAlpha.800"
                                    fontSize={["md", "md", "xl", "xl"]}
                                    fontWeight={"bold"}
                                  >


                                    ${item.metadata.invoiceTotal}</Text>
                                  <Text>in</Text>
                                  <Text
                                    color="whiteAlpha.800"
                                    fontSize={"lg"}
                                    fontWeight={"bold"}
                                  >
                                    {item.metadata.invoiceToken.split("(")[0].trim()}
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>

                            <Flex
                              px={3}
                              justifyContent={"space-between"}
                            >
                              <Box
                                px={3}
                                pt={3}
                                fontSize={"xs"}
                                color="#a6a6ee"
                                opacity={0.6}
                              >
                                created:  {
                                  item.createdAt}

                              </Box>
                              <Box
                                px={3}
                                pt={3}

                                fontSize={"xs"}
                                color="whiteAlpha.800"
                                opacity={0.6}

                              >
                                Next Action:
                                <Box as="span"
                                  color="yellow"
                                  textDecoration={"underline"}
                                  pl={2}
                                  cursor={"pointer"}
                                >
                                  {
                                    item.metadata.customerName}
                                </Box>



                              </Box>
                            </Flex>

                          </Box>

                        ))}
                      </Box>
                    </Box>
                  </>
                )}

                {!data && activeAddress && (

                  <Center>
                    {status !== 3 && (
                      <Stepper index={currentStep} orientation="vertical">
                        <Step >

                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box w="100%" flexShrink='0'
                            color={currentStep < 1 ? "white" : "#90cdf4"}
                          >
                            Get started for free
                            {status && status < 1 && (
                              <SubscribeButton
                                isCurrent={status === "0" ? true : false}
                              />
                            )}

                          </Box>
                          <StepSeparator />
                        </Step>


                        <Step>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box w="100%"
                            color={currentStep > 1 ? "#90cdf4" : "white"}
                          >
                            Ready for Business
                            {org < 1 && (
                              <AddOrgButton
                                isCurrent={currentStep === 1 ? true : false}

                              />
                            )}


                          </Box>
                          <StepSeparator />
                        </Step>


                        <Step>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box w="100%"
                          >


                            Your first Invoice
                            <CreateButton
                              isCurrent={org.length > 0 && currentStep === 2 ? true : false}
                            />

                          </Box>
                          <StepSeparator />
                        </Step>

                      </Stepper>
                    )}

                  </Center>
                )}

              </>
            }

          </>
        }

        {web3AuthAccount && organizations && !activeAddress && (
          <>
            <VStack mt={5}
              maxW="400px"
              position={"fixed"}
              px={12}
              w="100%" spacing={5}>

              <Text>Connect Wallet</Text>

              {providers?.map((provider, index) => (
                <Button
                  w="100%"
                  h="50px"
                  bg={index === 0 ? "black" : "#ffee55"}
                  color={index === 0 ? "white" : "black"}
                  px={5}
                  leftIcon={
                    <Box
                      width={30}
                      height={30}
                      alt={`${provider.metadata.name} icon`}
                      src={provider.metadata.icon}
                      as="img"
                    />
                  }
                  key={provider.metadata.id}
                  type="button"
                  onClick={() => {
                    if (!activeAddress) {
                      provider.connect();
                    }
                  }}
                  disabled={provider.isConnected}
                >
                  Connect {provider.metadata.name}
                </Button>
              ))}
            </VStack>
          </>

        )}

      </Box>
    </Box >

  );
};

export default CenterPanel;
