import React from "react";
import { TabPanels, TabPanel, Box, Tabs, Center, Spinner } from "@chakra-ui/react";


import NavigationBar from "@/components/NavBar/NavigationBar";
import { useTabs } from "@/contexts/TabContext/TabsContext";
import { HomeBackDrop } from "./HomeBackdrop";
import { BackDrop } from "./BackDrop";
import LoginModal from "@/components/Modal/LoginModal";
import { useSignInModal } from "@/contexts/ModalContext/useModalContext";
import { useWeb3AuthProvider } from "@/contexts/Web3AuthContext";


const Layout = ({ children }: any) => {
  const { activeTab, changeTab }: any = useTabs()
  const isHome = activeTab === 0 ? true : false
  // const isDashboard = activeTab === 1 ? true : false
  // const isInsurance = activeTab === 2 ? true : false
  const { isGoogleSignIn }: any = useWeb3AuthProvider()
  const { isModalOpen, closeModal }: any = useSignInModal();

  return (
    <>

      {/* {isHome && (
        <HomeBackDrop />
      )} */}

      {!isHome && (
        <BackDrop />
      )}

      <Tabs
        className={"mortyStack"}
        isFitted variant="unstyled" index={activeTab} onChange={(index) => changeTab(index)}>
        <Box
          // bg='rgba(16, 24, 39, 0.8)'
          minH="100vh"
        >
          <NavigationBar />
          <TabPanels>
            {children && children.map((widget: any, index: number) => (
              <TabPanel key={index}>
                {widget}
              </TabPanel>
            ))}
          </TabPanels>
        </Box>
      </Tabs>

      <LoginModal
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {isGoogleSignIn && (
        <Box
          bg="blackAlpha.900"
          zIndex={"tooltip"}
          position={"fixed"}
          top={0}
          w="100%"
          h="100vh"
          display={"flex"}
          justifyContent={"center"}
        >
          <Center>
            <Spinner />
          </Center>
        </Box>

      )}
    </>

  );
};

export default Layout;
