import React, { useEffect, useState } from 'react';
import {
    Button,
    Select,
    Input,
    Box,
    Step,
    Stepper,
    StepTitle,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepStatus,
    VStack,
    HStack,
    StepSeparator,
    FormControl,
    FormLabel,
    Heading,
    Link
} from '@chakra-ui/react';
import Description from '../Invoice/InvoiceDescription';
import { useWeb3AuthProvider } from '@/contexts/Web3AuthContext';
import { validateEmail } from '@/utils/helpers';
import { InvoiceSummary } from '../Invoice/InvoiceSummary';
import AModalLayout from '@/layout/ActionModal';
import { useTransaction } from '@/contexts/TransactionContext';
import { FaCheckCircle } from 'react-icons/fa';


interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}



const Organization = ({ next }: any
) => {

    const { organizations, user }: any = useWeb3AuthProvider()
    const orgOptions = organizations || [];
    const [ctEmail, setCtEmail] = useState("")
    const [Org, setOrg] = useState("")


    const {
        setContactEmail,
        organization,
        setOrganization,
        contactEmail, } = useTransaction()



    const handleNextStep = () => {
        setOrganization(Org)
        setContactEmail(ctEmail)
        next();

    };


    useEffect(() => {
        setCtEmail(contactEmail);
        setOrg(organization)
    }, [])

    useEffect(() => {
        if (user) {
            if (user.email) setCtEmail(user.email)
        }
    }, [user])






    return (
        <Box w="100%" pt={32}>
            <FormControl>
                <FormLabel fontSize={["md", "md", "lg", "2xl"]}>Select Business or Organization</FormLabel>
                <Select
                    w="100%"
                    value={Org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Select your organization">
                    {orgOptions.map((x: any, i: number) => (
                        <option
                            key={x.oid}
                            value={x.oid}>{x.name}</option>
                    ))}


                </Select>
                <br />
                <FormLabel fontSize={["md", "md", "lg", "2xl"]} mt={4}>Contact Details</FormLabel>
                <Input
                    w="100%"
                    value={ctEmail}
                    onChange={(e) => setCtEmail(e.target.value)}
                    type="email" placeholder="Enter email" />
            </FormControl>


            <HStack
                py={12}
                w="100%"
                spacing={10}
                alignItems={"center"}
            >

                <Button colorScheme="green" onClick={handleNextStep}>
                    Continue
                </Button>

            </HStack>


        </Box >
    )
}

const Customer = ({ next, prev }: any) => {


    const [custEmail, setCustEmail] = useState("")
    const [custName, setCustName] = useState("")

    const {
        setCustomerEmail,
        setCustomerName,
        customerEmail,
        customerName,
    } = useTransaction()



    const handleNextStep = () => {
        setCustomerEmail(custEmail)
        setCustomerName(custName)
        next();
    };

    const handlePrevStep = () => {
        setCustomerEmail(custEmail)
        setCustomerName(custName)
        prev();
    };

    useEffect(() => {
        setCustEmail(customerEmail);
        setCustName(customerName)
    }, [])



    return (
        <Box w="100%" pt={32}>

            <FormLabel fontSize={["md", "md", "lg", "2xl"]}>Customer Name</FormLabel>
            <Input
                w="100%"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Enter customer name" />
            <br />
            <FormLabel fontSize={["md", "md", "lg", "2xl"]} mt={4}>Customer Email</FormLabel>
            <Input
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                w="100%"
                type="email" placeholder="Enter customer email" />




            <HStack
                py={12}
                w="100%"
                spacing={10}
                alignItems={"center"}
                pb={24}>

                <Button colorScheme="gray" variant="outline" onClick={handlePrevStep}>
                    Previous Step
                </Button>

                <Button colorScheme="green" onClick={handleNextStep}>
                    Continue
                </Button>

            </HStack>
        </Box>
    )
}


const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose }) => {
    const { user, organizations }: any = useWeb3AuthProvider()
    const {
        organization,
        invoiceTotal,
        contactEmail,
        customerName,
        customerEmail,
        invoiceTitle,
        invoiceToken,
        invoiceItems,
        reset,
        activeStep,
        setActiveStep,
        preview,
        setPreview,
        hasDispenser,
        record
    } = useTransaction();



    const handleClose = () => {
        onClose();
        if (activeStep === 4) {
            setActiveStep(0)
            setPreview(false)
            reset();
        }
    }

    const handleNextStep = () => {
        setActiveStep(activeStep + 1);
    };
    const handleDiscard = () => {
        reset()
        setActiveStep(0);
        setPreview(false)
    };

    const handlePrevStep = () => {
        setActiveStep(activeStep - 1);
    };


    const onComplete = () => {
        //validate inputs
        if (invoiceTotal < 1 || !validateEmail(customerEmail) || !validateEmail(contactEmail)) {
            console.error("some form details are incorrect")
            return
        }
        setActiveStep(3)
        setPreview(true)
    }


    const steps = [
        {
            title: 'Select Organization',
            content: <Organization
                next={handleNextStep}
            />
        },
        {
            title: 'Customer Information',
            content: <Customer
                next={handleNextStep}
                prev={handlePrevStep}
            />
        },
        {
            title: 'Invoice Details', content:
                <Description
                    next={onComplete}
                    prev={handlePrevStep}
                />
        },
    ];




    const summary = {
        organization,
        invoiceTotal,
        contactEmail,
        customerName,
        customerEmail,
        invoiceTitle,
        invoiceToken,
        invoiceItems,
        acceptWrapped: hasDispenser,
        record
    }

    const handleConfirmation = () => {
        console.log(summary)
    }


    const ModalBody = () => (
        <VStack

            w="100%"
            position={"relative"}
            justifyContent={"center"}
            alignItems={"center"}

        >
            <Box
                mb={8}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                alignSelf={"center"}
                w="100%"
                maxW={activeStep === 2 || activeStep === 3 ? "100%" : "500px"}
            >
                {!preview && steps[activeStep].content}
                {preview && activeStep === 3 &&
                    < InvoiceSummary {...summary}
                    />
                }

                {activeStep > 3 && (
                    <Box textAlign="center"
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        p={8}>

                        <FaCheckCircle
                            color="#4f4fde"
                            size="250px"
                        />

                        <Heading
                            my={6}
                            as="h2" fontSize="xl" mb={4}>
                            Invoice Created Successfully Offline
                        </Heading>

                        <Link
                            bg="blackAlpha.300"
                            color="white"
                            paddingX={8}
                            py={4}
                            minH="50px"
                            borderRadius="25px"
                            // onClick={handleCopyLink}
                            _hover={{ bg: '#4f4fde' }}
                        >
                            Click to Copy Link & Share
                        </Link>
                    </Box>
                )}
            </Box>

            {/*             
            {preview && (
                    <Button

                        onClick={handleDiscard}
                        colorScheme="gray">
                        Discard
                    </Button>
                )} */}


        </VStack>
    )

    const ModalFooter = () => (

        <Stepper index={activeStep}
            orientation={'horizontal'}
            w="100%"
        >
            {steps.map((step, index) => (
                <Step

                    key={index}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>
                    <Box
                        fontSize="xs"
                        w="100%"
                        flexShrink={0}
                    >
                        <StepTitle

                        >{step.title}</StepTitle>
                    </Box>
                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    )

    return (
        <AModalLayout
            isOpen={isOpen}
            onClose={handleClose}
            title={'Create New Invoice'}
            size={activeStep === 2 ? "100vh" : "fit-content"}
            body={<ModalBody />}
            footer={<ModalFooter />}

        />
    );
};

export default InvoiceModal;
