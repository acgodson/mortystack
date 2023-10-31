import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Switch,
} from '@chakra-ui/react';

const CreateStrategyModal = ({ isOpen, onClose }: any) => {
    const [formData, setFormData] = useState({
        amount: '',
        strategyName: '',
        riskCategory: '',
        isInsuranceOpted: false,
    });

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        // Clear form data if needed: setFormData({ amount: '', strategyName: '', riskCategory: '', isInsuranceOpted: false });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay
                opacity={0}
            />
            <ModalContent mt={[0, 0, 32]}
                bg="#232e47"
                color="whiteAlpha.700"

            >
                <ModalHeader color={"#0e76fd"}>New Strategy</ModalHeader>
                <ModalCloseButton />
                <ModalBody

                >
                    <FormControl mb={4}>
                        <FormLabel fontSize={"sm"}>Amount to be Invested</FormLabel>
                        <Input
                            type="number"
                            h="50px"
                            placeholder="Enter amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel fontSize={"sm"}>Strategy Name</FormLabel>
                        <Input
                            h="50px"
                            type="text"
                            placeholder="Enter strategy name"
                            name="strategyName"
                            value={formData.strategyName}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl display="flex" alignItems="center" mb={4}>
                        <FormLabel fontSize={"sm"} htmlFor="insuranceOptIn" mb="0">
                            Opt-in for Insurance
                        </FormLabel>
                        <Switch
                            id="insuranceOptIn"
                            name="isInsuranceOpted"
                            isChecked={formData.isInsuranceOpted}
                            onChange={handleInputChange}
                            colorScheme="teal"
                            ml={2}
                        />
                    </FormControl>

                    {formData.isInsuranceOpted && (
                        <FormControl mb={4}>
                            <FormLabel fontSize={"sm"}>Investment Risk Category Type</FormLabel>
                            <Select
                                h="50px"
                                placeholder="Select risk category"
                                name="riskCategory"
                                value={formData.riskCategory}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Select>
                        </FormControl>

                    )}

                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="teal" onClick={handleSubmit}>
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateStrategyModal;
