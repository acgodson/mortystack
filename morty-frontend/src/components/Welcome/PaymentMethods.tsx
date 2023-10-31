import { Box, Flex, Grid, Icon, List, ListItem, Text } from '@chakra-ui/react';
import { FaCreditCard, FaWallet, FaUniversity, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const IconMapping: any = {
    'Pera Wallet': FaWallet,
    Metamask: FaCreditCard,
    'Bank Account': FaUniversity,
};

const CustomListItem = ({ title }: any) => {
    const LeftIcon = IconMapping[title];

    return (

        <Flex
            px={3}
            py={3}
            borderRadius={"5px"}
            w="fit-content"
            align="center" bg="#152036" justify="space-between">
            <Box display="flex" alignItems="center">
                <Box display={"flex"}  >
                    <Icon color="#13c39a" mr={3} as={FaCheckCircle} boxSize={5} />
                    <Icon as={LeftIcon} mr={4} boxSize={6} />
                </Box>

                <Text>{title}</Text>
            </Box>

        </Flex>
    );
};

const PaymentMethods = () => {
    return (
        <Grid gap={5} gridTemplateColumns={"50% 50%"} >
            <CustomListItem title="Pera Wallet" />
            <CustomListItem title="Metamask" />
            <CustomListItem title="Bank Account" />
        </Grid>
    );
};

export default PaymentMethods;
