import { Button, Tooltip } from "@chakra-ui/react";
import { MdLinkOff } from "react-icons/md";
import { ConnectType, useEthereumProvider } from "@/contexts/WormholeContext/EthereumWalletContext";



const ToggleConnectedButton = ({
    disconnect,
    connected,
    pk,
    walletIcon,
}: {
    disconnect(): any;
    connected: boolean;
    pk: string;
    walletIcon?: string;
}) => {
    const { availableConnections, connect } = useEthereumProvider();




    const is0x = pk.startsWith("0x");
    return connected ? (
        <Tooltip w="100%" title={pk}>
            <Button
                w="100%"
                h="50px"
                color="gray"
                bg="blackAlpha.700"
                _hover={{
                    bg: "blackAlpha.700",
                    color: "gray"
                }}
                _active={{
                    bg: "blackAlpha.700",
                    color: "gray"
                }}
                _focus={{
                    bg: "blackAlpha.700",
                    color: "gray"
                }}
                // variant="outlined"
                size="small"
                onClick={disconnect}
                leftIcon={
                    walletIcon ? (
                        <img style={{ height: "auto", width: '25px' }} src={walletIcon} alt="Wallet" />
                    ) : (
                        <MdLinkOff />
                    )
                }
            >
                Disconnect {pk.substring(0, is0x ? 6 : 3)}...
                {pk.substr(pk.length - (is0x ? 4 : 3))}
            </Button>
        </Tooltip>
    ) : (
        <>

            {availableConnections
                .filter((connection) => {
                    if (connection.connectType === ConnectType.METAMASK) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .map((connection, i: number) => {
                    return (<Button
                        key={i}
                        h="50px"
                        leftIcon={
                            <img style={{ height: "auto", width: '25px' }} src={connection.icon} alt="Wallet" />}
                        w="100%"

                        
                        colorScheme="blue"
                        onClick={() => connect(connection.connectType)
                        }
                    >
                        Connect {connection.name}
                    </Button >)
                })}
        </>

    );
};

export default ToggleConnectedButton;
