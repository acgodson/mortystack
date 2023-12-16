import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  HStack,
  Text,
} from "@chakra-ui/react";

import { MdEmail, MdOutlineVisibility, MdPassword } from "react-icons/md";
// import { FaGoogle } from "react-icons/fa";
import useLoginWeb3Auth from "@/hooks/web3auth/useLoginWeb3Auth";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";

const LoginModal = ({ isOpen, onClose, page = 0 }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(page);
  const [signingIn, setSigningIn] = useState(false);
  const {
    loginWeb3,
    setUserCookie,
    mapUserData,
    isGoogleSignIn,
    setIsGoogleSignIn,
  }: any = useWeb3AuthProvider();
  const { signIn, signInWithGoogle } = useLoginWeb3Auth();

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e: any) => {
    setRepeatPassword(e.target.value); // Update repeatPassword state with the input value
  };

  const handleSubmitCreate = () => {
    if (password !== repeatPassword) {
      toast({
        status: "error",
        description: "Password Do not match",
      });
    }
    //remember to implement password account creation
  };
  const handleSubmitLogin = async () => {
    try {
      if (!email || !password) {
        return;
      }
      const request = await signIn(
        email,
        password,
        loginWeb3,
        setUserCookie,
        mapUserData,
        setSigningIn
      );
      if (request) {
        console.log(request);
        setSigningIn(false);
      }
    } catch (e: any) {
      setSigningIn(false);
      toast({
        status: "error",
        description: e.message,
      });
    }
  };

  const handleSubmitGoogle = async () => {
    try {
      const request = await signInWithGoogle(
        loginWeb3,
        setUserCookie,
        mapUserData,
        setIsGoogleSignIn
      );
      if (request) {
        console.log(request);
        setSigningIn(false);
      }
    } catch (e: any) {
      setIsGoogleSignIn(false);
      toast({
        status: "error",
        description: e.message,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay opacity={0} />
      <ModalContent
        mt={[32, 32, 32]}
        pb={[0, 0, 12]}
        bg="#232e47"
        color="whiteAlpha.700"
      >
        <ModalHeader color={"#0e76fd"}></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              {tabIndex === 0 && <Tab>Login</Tab>}
              {tabIndex === 1 && <Tab>Create Account</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>
                <FormControl mb={4}>
                  <FormLabel fontSize={"sm"}>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <MdEmail />
                    </InputLeftElement>
                    <Input
                      type="email"
                      h="50px"
                      placeholder="Enter Email Address"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel fontSize={"sm"}>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <MdPassword />
                    </InputLeftElement>
                    <Input
                      type="password"
                      h="50px"
                      placeholder="Enter your password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <InputRightElement>
                      <MdOutlineVisibility />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  mt={4}
                  h="50px"
                  colorScheme="blue"
                  width={"100%"}
                  isDisabled={
                    email.length < 3
                      ? true || password.length < 3
                        ? true
                        : false
                      : false
                  }
                  isLoading={signingIn}
                  onClick={handleSubmitLogin}
                >
                  Login to MortyStack
                </Button>

                {/* <Button
                  h="50px"
                  mt={4}
                  bg="gray.600"
                  width={"100%"}
                  leftIcon={<FaGoogle />}
                  onClick={handleSubmitGoogle}
                  isLoading={isGoogleSignIn}
                >
                  Google
                </Button> */}

                {/* <HStack mt={8} fontSize={"sm"} justifyContent="center">
                                    <Text>           Don't have an account?</Text>
                                    <Text
                                        color={'blue.200'}
                                        as="button"
                                        onClick={() => setTabIndex(1)}
                                    >
                                        Switch to Signup</Text>
                                </HStack> */}
              </TabPanel>

              <TabPanel>
                <FormControl mb={4}>
                  <FormLabel fontSize={"sm"}>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <MdEmail />
                    </InputLeftElement>
                    <Input
                      type="email"
                      h="50px"
                      placeholder="Enter Email Address"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel fontSize={"sm"}>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <MdPassword />
                    </InputLeftElement>
                    <Input
                      type="password"
                      h="50px"
                      placeholder="Enter your password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <InputRightElement>
                      <MdOutlineVisibility />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel fontSize={"sm"}>Repeat Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <MdPassword />
                    </InputLeftElement>
                    <Input
                      type="password"
                      h="50px"
                      placeholder="Enter your password"
                      name="repeat-assword"
                      value={repeatPassword}
                      onChange={handleRepeatPasswordChange}
                    />
                    <InputRightElement>
                      <MdOutlineVisibility />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  mt={4}
                  h="50px"
                  colorScheme="blue"
                  width={"100%"}
                  onClick={handleSubmitCreate}
                  isDisabled={
                    email.length < 3
                      ? true || password.length < 3
                        ? true
                        : false
                      : false
                  }
                >
                  Create a New Account
                </Button>

                <HStack mt={8} fontSize={"sm"} justifyContent="center">
                  <Text> Already have an account?</Text>
                  <Text
                    color={"blue.200"}
                    as="button"
                    onClick={() => setTabIndex(0)}
                  >
                    Switch to Login
                  </Text>
                </HStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
