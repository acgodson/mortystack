import React from "react";
import { TabPanels, TabPanel, Box, Tabs } from "@chakra-ui/react";


import NavigationBar from "@/components/NavBar/NavigationBar";
import { useTabs } from "@/context/TabsContext";
import { HomeBackDrop } from "./HomeBackdrop";
import { BackDrop } from "./BackDrop";


const Layout = ({ children }: any) => {
  const { activeTab, changeTab }: any = useTabs()
  const isHome = activeTab === 0 ? true : false
  // const isDashboard = activeTab === 1 ? true : false
  // const isInsurance = activeTab === 2 ? true : false

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
    </>

  );
};

export default Layout;
