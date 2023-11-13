
import SidePanel from './LeftPanel';
import DashboardContent from './DashboardContent';
import Dashboardlayout from '@/layout/DashboardLayout';
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, useDisclosure, Box } from '@chakra-ui/react';
import React from 'react';
import { MdSwitchAccessShortcut } from 'react-icons/md';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';


export default function Dashboard() {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef(null)
    const handleClick = () => {
        onOpen()
    }




    return (
        <Dashboardlayout

        >

            {/* menu Button */}
            <Box
                position={'fixed'}
                top={"130px"}
            >
                <Button ref={btnRef} colorScheme='yellow' onClick={onOpen}>
                    <MdSwitchAccessShortcut />
                </Button>
            </Box>


            {/* mobile */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent bg="#162138" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>
                    <DrawerBody>
                        <SidePanel />
                    </DrawerBody>

                </DrawerContent>
            </Drawer>


            {/* desktop */}
            <Box display={{ xl: 'fixed', base: "none" }}>
                <SidePanel />
            </Box>

            <DashboardContent />
        </Dashboardlayout>
    )
}
